import { Injectable } from '@nestjs/common'
import { type Except } from 'type-fest'

import { IDatabaseConnection } from '../../persistence'

import { Booking, BookingID, BookingProperties } from './booking'
import { IBookingRepository } from './booking.repository.interface'
import { IBookingService } from './booking.service.interface'

@Injectable()
export class BookingService implements IBookingService {
  private readonly bookingRepository: IBookingRepository
  private readonly databaseConnection: IDatabaseConnection

  public constructor(
    bookingRepository: IBookingRepository,
    databaseConnection: IDatabaseConnection,
  ) {
    this.bookingRepository = bookingRepository
    this.databaseConnection = databaseConnection
  }

  public async get(id: BookingID): Promise<Booking> {
    return this.databaseConnection.transactional(tx =>
      this.bookingRepository.get(tx, id),
    )
  }

  public async getAll(): Promise<Booking[]> {
    return this.databaseConnection.transactional(async tx => {
      const bookings = await this.bookingRepository.getAll(tx)
      return bookings
    })
  }

  public async create(data: Except<BookingProperties, 'id'>): Promise<Booking> {
    return this.databaseConnection.transactional(tx => {
      return this.bookingRepository.insert(tx, data)
    })
  }
}
