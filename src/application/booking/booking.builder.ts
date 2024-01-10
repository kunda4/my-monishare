import dayjs from 'dayjs'
import { type Except } from 'type-fest'

import { Booking, type BookingID, type BookingProperties } from '../booking'
import { type Car, type CarID } from '../car'
import { type User, type UserID } from '../user'

import { BookingState } from './booking-state'

type UntaggedBookingProperties = Except<
  BookingProperties,
  'id' | 'carId' | 'renterId'
> & { id: number; carId: number; renterId: number }

export class BookingBuilder {
  private readonly properties: UntaggedBookingProperties = {
    id: 10 as BookingID,
    renterId: 2 as UserID,
    carId: 1 as CarID,
    startDate: dayjs('2024-02-08T14:07:27.828Z'),
    endDate: dayjs('2024-06-09T07:20:56.959Z'),
    state: BookingState.PENDING,
  }

  public static from(
    properties: Booking | Partial<UntaggedBookingProperties>,
  ): BookingBuilder {
    return new BookingBuilder().with(properties)
  }

  public with(properties: Partial<UntaggedBookingProperties>): this {
    let key: keyof UntaggedBookingProperties

    for (key in properties) {
      const value = properties[key]

      if (value !== undefined) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.properties[key] = value
      }
    }

    return this
  }

  public withId(id: number): this {
    this.properties.id = id
    return this
  }

  public withRenter(data: number | User): this {
    this.properties.renterId = typeof data === 'number' ? data : data.id

    return this
  }

  public withCar(data: number | Car): this {
    this.properties.carId = typeof data === 'number' ? data : data.id

    return this
  }

  public withState(data: BookingState): this {
    this.properties.state = data

    return this
  }

  public withStartDate(startDate: dayjs.Dayjs): this {
    this.properties.startDate = startDate

    return this
  }

  public withEndDate(endDate: dayjs.Dayjs): this {
    this.properties.endDate = endDate

    return this
  }

  public build(): Booking {
    return new Booking({
      ...this.properties,
      id: this.properties.id as BookingID,
      renterId: this.properties.renterId as UserID,
      carId: this.properties.carId as CarID,
    })
  }
}
