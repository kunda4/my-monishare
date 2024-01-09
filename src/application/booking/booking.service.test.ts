import { Test, TestingModule } from '@nestjs/testing'
import { BookingService } from './booking.service'
import { after } from 'node:test'
import {
  type BookingRepositoryMock,
  type DatabaseConnectionMock,
  mockBookingRepository,
  mockDatabaseConnection,
  mockBookingService,
  BookingServiceMock,
} from '../../mocks'
import { UserBuilder } from '../user/user.builder'

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
})
