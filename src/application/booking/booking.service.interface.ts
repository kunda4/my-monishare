import { Except } from 'type-fest'

import { type BookingID, type Booking, BookingProperties } from './booking'
import { UserID } from '../user'

export abstract class IBookingService {
  public abstract get(bookingId: BookingID): Promise<Booking>
  public abstract getAll(): Promise<Booking[]>
  public abstract insert(
    data: Except<BookingProperties, 'id'>,
  ): Promise<Booking>
  public abstract update(
    bookingId: BookingID,
    updates: Partial<Except<BookingProperties, 'id'>>,
  ): Promise<Booking>

}
