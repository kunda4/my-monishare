import { ApiProperty, PickType } from '@nestjs/swagger'
import { IsInt, IsPositive, IsEnum, IsDateString } from 'class-validator'
import { type Dayjs } from 'dayjs'
import { type Writable } from 'type-fest'

import {
  Booking,
  BookingID,
  BookingState,
  CarID,
  UserID,
} from 'src/application'

import { validate } from '../../util'
import { IsDayjs } from 'class-validator-extended'

export class BookingDTO {
  @ApiProperty({
    description: 'The id of the booking.',
    type: 'integer',
    minimum: 1,
    example: 13,
    readOnly: true,
  })
  @IsInt()
  @IsPositive()
  public readonly id!: BookingID

  @ApiProperty({
    description: 'The id of the car.',
    type: 'integer',
    minimum: 1,
    example: 23,
  })
  @IsInt()
  @IsPositive()
  public readonly carId!: CarID

  @ApiProperty({
    description: 'The id of the renter.',
    type: 'integer',
    minimum: 1,
    example: 42,
  })
  @IsInt()
  @IsPositive()
  public readonly renterId!: UserID

  @ApiProperty({
    description: 'The state of the booking.',
    enum: BookingState,
    example: BookingState.PENDING,
  })
  @IsEnum(BookingState)
  public readonly state!: BookingState

  @ApiProperty({
    description: 'The start date of the booking.',
    type: 'string',
    format: 'date-time',
    example: '2020-11-01T00:00:00.000Z',
  })
  @IsDayjs()
  public readonly startDate!: Dayjs

  @ApiProperty({
    description: 'The end date of the booking.',
    type: 'string',
    format: 'date-time',
    example: '2020-11-01T00:00:00.000Z',
  })
  @IsDayjs()
  public readonly endDate!: Dayjs

  public static create(data: {
    id: BookingID
    carId: CarID
    renterId: UserID
    state: BookingState
    startDate: Dayjs
    endDate: Dayjs
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

export class CreateBookingDTO extends PickType(BookingDTO, [
  'carId',
  'startDate',
  'endDate',
] as const) {}

export class PatchBookingDTO extends PickType(BookingDTO, ['state'] as const) {}
