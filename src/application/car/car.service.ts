import { Injectable, Logger } from '@nestjs/common'
import { Except } from 'type-fest'

import {
  CarRepository,
  DatabaseConnection,
  IDatabaseConnection,
} from '../../persistence'

import { Car, type CarID, CarProperties } from './car'
import { ICarRepository } from './car.repository.interface'
import { ICarService } from './car.service.interface'

export class CarService implements ICarService {
  private readonly carRepository: ICarRepository
  private readonly databaseConnection: IDatabaseConnection
  private readonly logger: Logger

  public constructor(
    carRepository: ICarRepository,
    databaseConnection: IDatabaseConnection,
  ) {
    this.carRepository = carRepository
    this.databaseConnection = databaseConnection
    this.logger = new Logger(CarService.name)
  }

  public async get(id: CarID): Promise<Car> {
    return this.databaseConnection.transactional(tx =>
      this.carRepository.get(tx, id),
    )
  }
}
