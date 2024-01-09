import { IsInt, IsPositive, IsEnum, IsDate } from 'class-validator'
import { type Writable } from 'type-fest'

import {
  Booking,
  BookingID,
  BookingState,
  CarID,
  UserID,
} from 'src/application'

import { validate } from '../../util'

export class BookingDTO {
  @IsInt()
  @IsPositive()
  public readonly id!: BookingID

  @IsInt()
  @IsPositive()
  public readonly carId!: CarID

  @IsInt()
  @IsPositive()
  public readonly renterId!: UserID

  @IsEnum(BookingState)
  public readonly state!: BookingState

  @IsDate()
  public readonly startDate!: Date

  @IsDate()
  public readonly endDate!: Date

  public static create(data: {
    id: BookingID
    carId: CarID
    renterId: UserID
    state: BookingState
    startDate: Date
    endDate: Date
  }): BookingDTO {
    const instance = new BookingDTO() as Writable<BookingDTO>

    instance.id = data.id
    instance.carId = data.carId
    instance.renterId = data.renterId
    instance.state = data.state
    instance.startDate = data.startDate
    instance.endDate = data.endDate

    return validate(instance)
  }

  public static fromModel(booking: Booking): BookingDTO {
    return BookingDTO.create(booking)
  }
}
