import { after } from 'node:test'
import {
  type CarRepositoryMock,
  type DatabaseConnectionMock,
  mockCarRepository,
  mockDatabaseConnection,
  mockCarTypeService,
  CarTypeServiceMock,
} from '../../mocks'
import { AccessDeniedError } from '../access-denied.error'
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

  afterEach(() => jest.clearAllMocks())

  describe('update', () => {
    it('should update a car', async () => {
      const owner = new UserBuilder().build()
      const car = new CarBuilder().withOwner(owner).withHorsepower(50).build()
      const updatedCar = CarBuilder.from(car).withHorsepower(555).build()

      carRepositoryMock.get.mockResolvedValue(car)
      carRepositoryMock.update.mockResolvedValue(updatedCar)
      await expect(
        carService.update(car.id, { horsepower: 555 }, owner.id),
      ).resolves.toEqual(updatedCar)
    })
    it('should throw an error if you are not the car owner', async () => {
      const owner = new UserBuilder().withId(2).build()
      const car = new CarBuilder().withOwner(55).withHorsepower(60).build()

      carRepositoryMock.get.mockResolvedValue(car)

      await expect(
        carService.update(car.id, { horsepower: 555 }, owner.id),
      ).rejects.toBeInstanceOf(AccessDeniedError)
    })
  })
})
