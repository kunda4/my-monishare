import dayjs from 'dayjs'

import {
  type BookingRepositoryMock,
  type DatabaseConnectionMock,
  mockBookingRepository,
  mockDatabaseConnection,
  CarRepositoryMock,
  mockCarRepository,
} from '../../mocks'
import { CarID, CarNotFoundError } from '../car'
import { CarBuilder } from '../car/car.builder'
import { UserID } from '../user'

import { Booking, BookingID } from './booking'
import { BookingNotFoundError } from './booking-not-found.error'
import { BookingState } from './booking-state'
import { BookingBuilder } from './booking.builder'
import { BookingService } from './booking.service'

describe('BookingService', () => {
  let bookingService: BookingService
  let bookingRepositoryMock: BookingRepositoryMock
  let databaseConnectionMock: DatabaseConnectionMock
  let carRepositoryMock: CarRepositoryMock

  beforeEach(() => {
    bookingRepositoryMock = mockBookingRepository()
    databaseConnectionMock = mockDatabaseConnection()
    carRepositoryMock = mockCarRepository()

    bookingService = new BookingService(
      bookingRepositoryMock,
      databaseConnectionMock,
      carRepositoryMock,
    )
  })

  describe('get', () => {
    it('should get single booking', async () => {
      const booking = new BookingBuilder().withId(1).build()

      bookingRepositoryMock.get.mockResolvedValueOnce(booking)

      await expect(bookingService.get(booking.id)).resolves.toBe(booking)
    })

    it('should throw not found error if the bookingId does not exist', async () => {
      const booking = new BookingBuilder().withId(2).build()

      bookingRepositoryMock.get.mockRejectedValueOnce(
        new BookingNotFoundError(booking.id),
      )

      await expect(bookingService.get(booking.id)).rejects.toBeInstanceOf(
        BookingNotFoundError,
      )
    })

    it('should get all bookings', async () => {
      const booking = new BookingBuilder().withId(1).build()

      bookingRepositoryMock.getAll.mockResolvedValueOnce([booking])

      await expect(bookingService.getAll()).resolves.toEqual([booking])
    })
  })

  describe('create booking', () => {
    it('should create a booking', async () => {
      const car = new CarBuilder().build()

      carRepositoryMock.get.mockResolvedValue(car)

      const booking = new Booking({
        id: 1 as BookingID,
        carId: 13 as CarID,
        startDate: dayjs('2023-08-08T14:07:27.828Z'),
        endDate: dayjs('2023-08-09T07:20:56.959Z'),
        state: BookingState.PENDING,
        renterId: 2 as UserID,
      })

      bookingRepositoryMock.create.mockResolvedValueOnce(booking)

      await expect(
        bookingService.create({
          carId: 13 as CarID,
          startDate: dayjs('2023-08-08T14:07:27.828Z'),
          endDate: dayjs('2023-08-09T07:20:56.959Z'),
          state: BookingState.PENDING,
          renterId: 2 as UserID,
        }),
      ).resolves.toEqual(booking)
    })

    it('should throw error when no car associated with car id', async () => {
      carRepositoryMock.get.mockRejectedValue(new CarNotFoundError(1 as CarID))

      await expect(
        bookingService.create({
          carId: 13 as CarID,
          startDate: dayjs('2023-08-08T14:07:27.828Z'),
          endDate: dayjs('2023-08-09T07:20:56.959Z'),
          state: BookingState.PENDING,
          renterId: 2 as UserID,
        }),
      ).rejects.toThrow(CarNotFoundError)
    })
  })
  describe('update booking', () => {
    it('should update a booking', async () => {
      const booking = new BookingBuilder().withId(1).build()

      bookingRepositoryMock.get.mockResolvedValueOnce(booking)
      bookingRepositoryMock.update.mockResolvedValueOnce(booking)

      await expect(
        bookingService.update(booking.id, booking),
      ).resolves.toBeInstanceOf(Booking)
    })

    it('should fail if trying to update a booking that doesnt exist', async () => {
      const booking = new BookingBuilder().withId(9990).build()

      bookingRepositoryMock.get.mockResolvedValueOnce(null)

      await expect(
        bookingService.update(66 as BookingID, booking),
      ).rejects.toThrow(BookingNotFoundError)
    })
  })
})
