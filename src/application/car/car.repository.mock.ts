import { UserBuilder } from '../user/user.builder'

import { CarID, type Car } from './car'
import { CarBuilder } from './car.builder'
import { type ICarRepository } from './car.repository.interface'

export type CarRepositoryMock = jest.Mocked<ICarRepository>

export function mockCarRepository(): CarRepositoryMock {
  return {
    findByLicensePlate: jest.fn(),
    get: jest.fn((_, id: CarID): Promise<Car> => {
      const owner = new UserBuilder().build()
      const car = new CarBuilder().withId(id).withOwner(owner).build()

      return Promise.resolve(car)
    }),
    getAll: jest.fn(),
    insert: jest.fn(),
    update: jest.fn((_, updatedCar: Car) => Promise.resolve(updatedCar)),
  }
}
