import { type Except } from 'type-fest'

import { type Transaction } from '../../persistence/database-connection.interface'
import { CarID } from '../car'

import { BookingProperties, type Booking, type BookingID } from './booking'

export abstract class IBookingRepository {
  public abstract get(tx: Transaction, id: BookingID): Promise<Booking | null>

  public abstract getCarBookings(tx: Transaction, id: CarID): Promise<Booking[]>
  public abstract getAll(tx: Transaction): Promise<Booking[]>

  public abstract create(
    tx: Transaction,
    booking: Except<BookingProperties, 'id'>,
  ): Promise<Booking>

  public abstract update(tx: Transaction, booking: Booking): Promise<Booking>
}
