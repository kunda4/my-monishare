import dayjs from 'dayjs'

import {
  type CarRepositoryMock,
  type DatabaseConnectionMock,
  mockCarRepository,
  mockDatabaseConnection,
  mockCarTypeService,
  CarTypeServiceMock,
  BookingRepositoryMock,
  mockBookingRepository,
} from '../../mocks'
import { AccessDeniedError } from '../access-denied.error'
import { BookingState } from '../booking'
import { BookingBuilder } from '../booking/booking.builder'
import { UserBuilder } from '../user/user.builder'

import { CarBuilder } from './car.builder'
import { CarService } from './car.service'

describe('CarService', () => {
  let carService: CarService
  let carRepositoryMock: CarRepositoryMock
  let databaseConnectionMock: DatabaseConnectionMock
  let carTypeServiceMock: CarTypeServiceMock
  let bookingRepositoryMock: BookingRepositoryMock

  beforeEach(() => {
    carRepositoryMock = mockCarRepository()
    carTypeServiceMock = mockCarTypeService()
    databaseConnectionMock = mockDatabaseConnection()
    bookingRepositoryMock = mockBookingRepository()

    carService = new CarService(
      carRepositoryMock,
      databaseConnectionMock,
      carTypeServiceMock,
      bookingRepositoryMock,
    )
  })

  afterEach(() => jest.clearAllMocks())

  describe('update', () => {
    it("should update owner's car", async () => {
      const owner = new UserBuilder().build()
      const car = new CarBuilder().withOwner(owner).withHorsepower(50).build()
      const updatedCar = CarBuilder.from(car).withHorsepower(555).build()
      const booking = new BookingBuilder()
        .withCar(car.id)
        .withState(BookingState.PICKED_UP)
        .withStartDate(dayjs().subtract(1, 'day'))
        .withEndDate(dayjs().add(2, 'months'))
        .build()

      carRepositoryMock.get.mockResolvedValue(car)
      carRepositoryMock.update.mockResolvedValue(updatedCar)
      bookingRepositoryMock.getCarBookings.mockResolvedValue([booking])
      await expect(
        carService.update(car.id, { horsepower: 555 }, owner.id),
      ).resolves.toEqual(updatedCar)
    })
    it('should throw an error if you are not the car owner', async () => {
      const owner = new UserBuilder().withId(2).build()
      const car = new CarBuilder().withOwner(55).withHorsepower(60).build()

      carRepositoryMock.get.mockResolvedValue(car)
      bookingRepositoryMock.getCarBookings.mockResolvedValue([])

      await expect(
        carService.update(car.id, { horsepower: 555 }, owner.id),
      ).rejects.toBeInstanceOf(AccessDeniedError)
    })
  })
})
