import dayjs from 'dayjs'

import {
  type BookingRepositoryMock,
  type DatabaseConnectionMock,
  mockBookingRepository,
  mockDatabaseConnection,
} from '../../mocks'

import { Booking, BookingID } from './booking'
import { BookingNotFoundError } from './booking-not-found.error'
import { BookingBuilder } from './booking.builder'
import { BookingService } from './booking.service'

describe('BookingService', () => {
  let bookingService: BookingService
  let bookingRepositoryMock: BookingRepositoryMock
  let databaseConnectionMock: DatabaseConnectionMock

  beforeEach(() => {
    bookingRepositoryMock = mockBookingRepository()
    databaseConnectionMock = mockDatabaseConnection()

    bookingService = new BookingService(
      bookingRepositoryMock,
      databaseConnectionMock,
    )
  })

  afterEach(() => jest.clearAllMocks())

  it('should be defined', () => {
    expect(bookingService).toBeDefined()
  })

  describe('get', () => {
    it('should get single booking', async () => {
      const booking = new BookingBuilder().withId(1).build()

      bookingRepositoryMock.get.mockResolvedValueOnce(booking)

      await expect(bookingService.get(booking.id)).resolves.toBeInstanceOf(
        Booking,
      )
    })

    it('should throw not found error if a wrong bookingId is given', async () => {
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

      await expect(bookingService.getAll()).resolves.toBeInstanceOf(
        Array<Booking>,
      )
    })
  })

  describe('create and update', () => {
    it('should create a booking', async () => {
      const booking = new BookingBuilder()
        .withId(1)
        .withStartDate(dayjs('2023-08-08T14:07:27.828Z'))
        .build()

      bookingRepositoryMock.insert.mockResolvedValueOnce(booking)

      await expect(bookingService.insert(booking)).resolves.toBeInstanceOf(
        Booking,
      )
    })

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
