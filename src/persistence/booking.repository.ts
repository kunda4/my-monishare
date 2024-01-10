import { Injectable } from '@nestjs/common'
import { type Except } from 'type-fest'

import {
  type BookingID,
  type BookingState,
  type IBookingRepository,
  type CarID,
  type UserID,
} from '../application'
import { Booking, BookingNotFoundError, BookingProperties } from '../application/booking'

import { type Transaction } from './database-connection.interface'

type Row = {
  id: number
  car_id: number
  renter_id: number
  state: string
  start_date: Date
  end_date: Date
}

function rowToDomain(row: Row): Booking {
  return new Booking({
    id: row.id as BookingID,
    carId: row.car_id as CarID,
    renterId: row.renter_id as UserID,
    state: row.state as BookingState,
    startDate: row.start_date,
    endDate: row.end_date,
  })
}

@Injectable()
export class BookingRepository implements IBookingRepository {
  public async find(tx: Transaction, id: BookingID): Promise<Booking | null> {
    const maybeRow = await tx.oneOrNone<Row>(
      'SELECT * FROM bookings WHERE id = $(id)',
      {
        id: id,
      },
    )
    return maybeRow ? rowToDomain(maybeRow) : null
  }

  public async get(tx: Transaction, id: BookingID): Promise<Booking> {
    const booking = await this.find(tx, id)

    if (!booking) {
      throw new BookingNotFoundError(id)
    }

    return booking
  }

  public async getAll(tx: Transaction): Promise<Booking[]> {
    const rows = await tx.manyOrNone<Row>('SELECT * FROM bookings')
    return rows.map(row => rowToDomain(row))
  }

  public async insert(
    tx: Transaction,
    booking: Except<BookingProperties, 'id'>,
  ): Promise<Booking>{
    const row = await tx.one<Row>(
      `INSERT INTO bookings(
        car_id,
        state,
        renter_id,
        start_date,
        end_date
      )VALUES(
        $(carId),
        $(state),
        $(renterId),
        $(startDate),
        $(endDate)
      )RETURNING *`,
      {...booking},
    )
    return rowToDomain(row)
  }
}
