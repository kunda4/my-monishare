import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { type Except } from 'type-fest'

import { IDatabaseConnection } from '../../persistence/database-connection.interface'
import { type UserID } from '../user'

import { Car, type CarID, type CarProperties } from './car'
import { ICarRepository } from './car.repository.interface'
import { type ICarService } from './car.service.interface'

@Injectable()
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

  // Please remove the next line when implementing this file.
  /* eslint-disable @typescript-eslint/require-await */

  public async create(_data: Except<CarProperties, 'id'>): Promise<Car> {
    throw new Error('Not implemented')
  }

  public async getAll(): Promise<Car[]> {
    throw new Error('Not implemented')
  }

  public async get(_id: CarID): Promise<Car> {
    throw new Error('Not implemented')
  }

  public async update(
    _carId: CarID,
    _updates: Partial<Except<CarProperties, 'id'>>,
    _currentUserId: UserID,
  ): Promise<Car> {
    return this.databaseConnection.transactional(async tx => {
      if (_updates.ownerId !== _currentUserId) {
        throw new UnauthorizedException(
          'You are not allowed to update this car',
        )
      }
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
