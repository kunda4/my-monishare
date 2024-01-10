import { type IBookingRepository } from './booking.repository.interface'

export type BookingRepositoryMock = jest.Mocked<IBookingRepository>

export function mockBookingRepository(): BookingRepositoryMock {
  return {
    get: jest.fn(),
    getAll: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
  }
}
