import { Except } from 'type-fest'

import { PatchBookingDTO } from '../../controller/booking/booking.dto'

import { type BookingID, type Booking, BookingProperties } from './booking'

export abstract class IBookingService {
  public abstract get(bookingId: BookingID): Promise<Booking>
  public abstract getAll(): Promise<Booking[]>
  public abstract create(
    data: Except<BookingProperties, 'id'>,
  ): Promise<Booking>
  public abstract update(
    bookingId: BookingID,
    updates: PatchBookingDTO,
  ): Promise<Booking>
}
