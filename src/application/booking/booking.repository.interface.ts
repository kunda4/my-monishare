import { type Except } from 'type-fest'

import { type Transaction } from '../../persistence/database-connection.interface'

import { BookingProperties, type Booking, type BookingID } from './booking'

export abstract class IBookingRepository {
  public abstract get(tx: Transaction, id: BookingID): Promise<Booking>

  public abstract getAll(tx: Transaction): Promise<Booking[]>

  public abstract insert(
    tx: Transaction,
    booking: Except<BookingProperties, 'id'>,
  ): Promise<Booking>
}
