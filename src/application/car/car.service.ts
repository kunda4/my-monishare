import { Injectable, Logger } from '@nestjs/common'

import { IDatabaseConnection } from '../../persistence/'
import { ICarTypeService } from '../car-type/car-type.service.interface'

import { Car, type CarID, CarProperties } from './car'
import { ICarRepository } from './car.repository.interface'
import { ICarService } from './car.service.interface'

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

  public async get(id: CarID): Promise<Car> {
    return this.databaseConnection.transactional(tx =>
      this.carRepository.get(tx, id),
    )
  }

  public async getAll(): Promise<Car[]> {
    const result = this.databaseConnection.transactional(async tx => {
      const cars = await this.carRepository.getAll(tx)
      return cars
    })
    return result
  }
}
