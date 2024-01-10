import { type IBookingService } from './booking.service.interface'

export type BookingServiceMock = jest.Mocked<IBookingService>

export function mockBookingService(): BookingServiceMock {
  return {
    getAll: jest.fn(),
    get: jest.fn(),
    insert: jest.fn(),
  }
}
