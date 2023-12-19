import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common'
import { type Except } from 'type-fest'

import { IDatabaseConnection } from '../../persistence/database-connection.interface'
import { ICarTypeService } from '../car-type/car-type.service.interface'
import { type UserID } from '../user'

import { Car, type CarID, type CarProperties } from './car'
import { ICarRepository } from './car.repository.interface'
import { type ICarService } from './car.service.interface'

@Injectable()
export class CarService implements ICarService {
  private readonly carRepository: ICarRepository
  private readonly databaseConnection: IDatabaseConnection
  private readonly logger: Logger
  private readonly carTypeService: ICarTypeService

  public constructor(
    carRepository: ICarRepository,
    databaseConnection: IDatabaseConnection,
    carTypeService: ICarTypeService,
  ) {
    this.carRepository = carRepository
    this.databaseConnection = databaseConnection
    this.logger = new Logger(CarService.name)
    this.carTypeService = carTypeService
  }

  // Please remove the next line when implementing this file.
  /* eslint-disable @typescript-eslint/require-await */

  public async create(data: Except<CarProperties, 'id'>): Promise<Car> {
    return this.databaseConnection.transactional(async tx => {
      await this.carTypeService.get(data.carTypeId)

      if (typeof data.licensePlate !== 'string')
        throw new Error('License plate must be string')

      const carWithLicensePlate = await this.carRepository.findByLicensePlate(
        tx,
        data.licensePlate,
      )
      if (carWithLicensePlate)
        throw new ConflictException('License plate already exists')

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
      if (updates.ownerId !== currentUserId) {
        throw new UnauthorizedException(
          'You are not allowed to update this car',
        )
      }

      if (typeof updates.carTypeId !== 'number')
        throw new BadRequestException('Cartype id must be a number')

      await this.carTypeService.get(updates.carTypeId)

      if (typeof updates.licensePlate !== 'string')
        throw new Error('License plate must be string')
      const carWithLicensePlate = await this.carRepository.findByLicensePlate(
        tx,
        updates.licensePlate,
      )

      if (carWithLicensePlate)
        throw new ConflictException('Car with license plate already exists')

      const car = await this.carRepository.get(tx, carId)

      const updatedCar = new Car({
        ...car,
        ...updates,
      })
      return this.carRepository.update(tx, updatedCar)
    })
  }
}
