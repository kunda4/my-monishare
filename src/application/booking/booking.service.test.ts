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
})
