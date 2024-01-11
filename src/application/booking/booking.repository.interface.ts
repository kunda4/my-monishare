import { type Transaction } from '../../persistence/database-connection.interface'

import { type Booking, type BookingID } from './booking'

export abstract class IBookingRepository {
  public abstract get(tx: Transaction, id: BookingID): Promise<Booking>

  public abstract getAll(tx: Transaction): Promise<Booking[]>
}
