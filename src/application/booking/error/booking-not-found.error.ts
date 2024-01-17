import { type BookingID } from '..'
import { NotFoundError } from '../../not-found.error'

export class BookingNotFoundError extends NotFoundError<BookingID> {
  public constructor(bookingId: BookingID) {
    super('Booking not found', bookingId)
  }
}
