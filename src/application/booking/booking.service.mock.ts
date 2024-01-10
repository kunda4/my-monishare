import { type IBookingService } from './booking.service.interface'

export type BookingServiceMock = jest.Mocked<IBookingService>

export function mockBookingService(): BookingServiceMock {
  return {
    get: jest.fn(),
    getAll: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
  }
}
