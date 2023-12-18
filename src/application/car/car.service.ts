import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
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

  public async create(_data: Except<CarProperties, 'id'>): Promise<Car> {
    return this.databaseConnection.transactional(async tx => {
      await this.carTypeService.get(_data.carTypeId)

      if (typeof _data.licensePlate !== 'string')
        throw new Error('License plate must be string')

      const carWithLicensePlate = await this.carRepository.findByLicensePlate(
        tx,
        _data.licensePlate,
      )
      if (carWithLicensePlate)
        throw new ConflictException('License plate already exists')

      return this.carRepository.insert(tx, _data)
    })
  }

  public async getAll(): Promise<Car[]> {
    const result = this.databaseConnection.transactional(async tx => {
      const cars = await this.carRepository.getAll(tx)
      return cars
    })
    return result
  }

  public async get(_id: CarID): Promise<Car> {
    return this.databaseConnection.transactional(_tx =>
      this.carRepository.get(_tx, _id),
    )
  }

  public async update(
    _carId: CarID,
    _updates: Partial<Except<CarProperties, 'id'>>,
    _currentUserId: UserID,
  ): Promise<Car> {
    return this.databaseConnection.transactional(async tx => {
      if (_updates.ownerId !== _currentUserId) {
        throw new BadRequestException('You are not allowed to update this car')
      }

      if (typeof _updates.carTypeId !== 'number')
        throw new BadRequestException('Cartype id must be a number')

      await this.carTypeService.get(_updates.carTypeId)

      if (typeof _updates.licensePlate !== 'string')
        throw new Error('License plate must be string')
      const carWithLicensePlate = await this.carRepository.findByLicensePlate(
        tx,
        _updates.licensePlate,
      )

      if (carWithLicensePlate)
        throw new ConflictException('Car with license plate already exists')

      const car = await this.carRepository.get(tx, _carId)

      const updatedCar = new Car({
        ...car,
        ..._updates,
        id: _carId,
      })
      return this.carRepository.update(tx, updatedCar)
    })
  }
}
