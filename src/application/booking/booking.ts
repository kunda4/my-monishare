import { IsDate, IsEnum, IsInt, IsPositive } from 'class-validator'
import { type Opaque } from 'type-fest'

import { validate } from '../../util'
import { type CarID } from '../car'
import { type UserID } from '../user'

import { BookingState } from './booking-state'

/**********************************************************************************************************************\
   *                                                                                                                     *
   *   This file is already fully implemented. You don't need to modify it to successfully finish your project.          *
   *                                                                                                                     *
   \*********************************************************************************************************************/

export type BookingID = Opaque<number, 'booking-id'>

export type BookingProperties = {
  id: BookingID
  carId: CarID
  state: BookingState
  renterId: UserID
  startDate: Date
  endDate: Date
}

export class Booking {
  @IsInt()
  @IsPositive()
  public readonly id: BookingID

  @IsInt()
  @IsPositive()
  public readonly carId: CarID

  @IsInt()
  @IsPositive()
  public readonly renterId: UserID

  @IsEnum(BookingState)
  public readonly state: BookingState

  @IsDate()
  public readonly startDate: Date

  @IsDate()
  public readonly endDate: Date

  public constructor(data: BookingProperties) {
    this.id = data.id
    this.carId = data.carId
    this.state = data.state
    this.renterId = data.renterId
    this.startDate = data.startDate
    this.endDate = data.endDate
    validate(this)
  }
}
