import { Injectable } from '@nestjs/common'
import dayjs from 'dayjs'
import { type Except } from 'type-fest'

import {
  type BookingID,
  type BookingState,
  type IBookingRepository,
  type CarID,
  type UserID,
} from '../application'
import {
  Booking,
  BookingNotFoundError,
  BookingProperties,
} from '../application/booking'

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
    startDate: dayjs(row.start_date),
    endDate: dayjs(row.end_date),
  })
}

@Injectable()
export class BookingRepository implements IBookingRepository {
  public async get(tx: Transaction, id: BookingID): Promise<Booking | null> {
    const maybeRow = await tx.oneOrNone<Row>(
      'SELECT * FROM bookings WHERE id = $(id)',
      {
        id: id,
      },
    )
    return maybeRow ? rowToDomain(maybeRow) : null
  }

  public async getAll(tx: Transaction): Promise<Booking[]> {
    const rows = await tx.manyOrNone<Row>('SELECT * FROM bookings')
    return rows.map(row => rowToDomain(row))
  }

  public async create(
    tx: Transaction,
    booking: Except<BookingProperties, 'id'>,
  ): Promise<Booking> {
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
      {
        ...booking,
        startDate: booking.startDate.toISOString(),
        endDate: booking.endDate.toISOString(),
      },
    )
    return rowToDomain(row)
  }

  public async update(tx: Transaction, booking: Booking): Promise<Booking> {
    const row = await tx.oneOrNone<Row>(
      `UPDATE bookings SET
      car_id = $(carId) ,
      state =  $(state),
      renter_id = $(renterId),
      start_date  = $(startDate),
      end_date = $(endDate)
      WHERE id = $(id)
      RETURNING *
      `,
      { ...booking },
    )
    if (row === null) {
      throw new BookingNotFoundError(booking.id)
    }
    return rowToDomain(row)
  }
}
