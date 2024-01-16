import { Injectable, Logger } from '@nestjs/common'
import dayjs, { extend } from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import { type Except } from 'type-fest'

import { IDatabaseConnection } from '../../persistence/database-connection.interface'
import { AccessDeniedError } from '../access-denied.error'
import {
  BookingState,
  IBookingRepository,
} from '../booking'
import { MissingBookingError } from '../booking/error'
import { CarTypeNotFoundError } from '../car-type/car-type-not-found.error'
import { ICarTypeService } from '../car-type/car-type.service.interface'
import { type UserID } from '../user'

import { Car, type CarID, type CarProperties } from './car'
import { CarNotFoundError } from './car-not-found.error'
import { ICarRepository } from './car.repository.interface'
import { type ICarService } from './car.service.interface'
import { DuplicateLicensePlateError } from './error'

extend(isSameOrBefore)

@Injectable()
export class CarService implements ICarService {
  private readonly carRepository: ICarRepository
  private readonly databaseConnection: IDatabaseConnection
  private readonly logger: Logger
  private readonly carTypeService: ICarTypeService
  private readonly bookingRepository: IBookingRepository

  public constructor(
    carRepository: ICarRepository,
    databaseConnection: IDatabaseConnection,
    carTypeService: ICarTypeService,
    bookingRepository: IBookingRepository,
  ) {
    this.carRepository = carRepository
    this.databaseConnection = databaseConnection
    this.logger = new Logger(CarService.name)
    this.carTypeService = carTypeService
    this.bookingRepository = bookingRepository
  }

  public async create(data: Except<CarProperties, 'id'>): Promise<Car> {
    return this.databaseConnection.transactional(async tx => {
      await this.carTypeService.get(data.carTypeId)

      if (data.licensePlate) {
        const carWithLicensePlate = await this.carRepository.findByLicensePlate(
          tx,
          data.licensePlate,
        )
        if (carWithLicensePlate)
          throw new DuplicateLicensePlateError(data.licensePlate)
      }
      return this.carRepository.insert(tx, data)
    })
  }

  public async getAll(): Promise<Car[]> {
    const result = this.databaseConnection.transactional(async tx => {
      const cars = await this.carRepository.getAll(tx)
      return cars
    })
    return result
  }

  public async get(id: CarID): Promise<Car> {
    return this.databaseConnection.transactional(tx =>
      this.carRepository.get(tx, id),
    )
  }

  public async update(
    carId: CarID,
    updates: Partial<Except<CarProperties, 'id'>>,
    currentUserId: UserID,
  ): Promise<Car> {
    return this.databaseConnection.transactional(async tx => {
      const car = await this.carRepository.get(tx, carId)
      if (!car) {
        throw new CarNotFoundError(carId)
      }

      const carBookings = await this.bookingRepository.getCarBookings(
        tx,
        car.id,
      )
      const booking = carBookings.find(
        carBooking =>
          carBooking.renterId === currentUserId &&
          dayjs().isSameOrAfter(carBooking.startDate) &&
          dayjs().isSameOrBefore(carBooking.endDate) &&
          carBooking.state === BookingState.PICKED_UP,
      )

      if (!booking) {
        throw new MissingBookingError('No car bookings found')
      }

      if (![car.ownerId, booking.renterId].includes(currentUserId)) {
        throw new AccessDeniedError(car.name, car.id)
      }

      if (booking.renterId === currentUserId) {
        updates = {
          state: updates.state,
        }
      }

      if (updates.carTypeId) {
        throw new CarTypeNotFoundError(updates.carTypeId)
      }
      if (updates.licensePlate) {
        const carWithLicensePlate = await this.carRepository.findByLicensePlate(
          tx,
          updates.licensePlate,
        )
        if (carWithLicensePlate && carWithLicensePlate.id !== car.id)
          throw new DuplicateLicensePlateError(updates.licensePlate)
      }
      const updatedCar = new Car({
        ...car,
        ...updates,
      })
      return this.carRepository.update(tx, updatedCar)
    })
  }
}
