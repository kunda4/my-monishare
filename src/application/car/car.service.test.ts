import {
  type CarRepositoryMock,
  type DatabaseConnectionMock,
  mockCarRepository,
  mockDatabaseConnection,
  mockCarTypeService,
  CarTypeServiceMock,
} from '../../mocks'
import { UserBuilder } from '../user/user.builder'

import { CarBuilder } from './car.builder'
import { CarService } from './car.service'

describe('CarService', () => {
  let carService: CarService
  let carRepositoryMock: CarRepositoryMock
  let databaseConnectionMock: DatabaseConnectionMock
  let carTypeServiceMock: CarTypeServiceMock

  beforeEach(() => {
    carRepositoryMock = mockCarRepository()
    carTypeServiceMock = mockCarTypeService()
    databaseConnectionMock = mockDatabaseConnection()

    carService = new CarService(
      carRepositoryMock,
      databaseConnectionMock,
      carTypeServiceMock,
    )
  })

  describe('update', () => {
    xit('should update a car', async () => {
      const owner = new UserBuilder().build()
      const car = new CarBuilder().withOwner(owner).withHorsepower(50).build()
      const updatedCar = CarBuilder.from(car).withHorsepower(555).build()

      await expect(
        carService.update(car.id, { horsepower: 555 }, owner.id),
      ).resolves.toEqual(updatedCar)
    })
  })
})
