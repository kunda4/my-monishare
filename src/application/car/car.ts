import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
} from 'class-validator'
import { Nullable } from 'class-validator-extended'
import { type Opaque } from 'type-fest'

import { validate } from '../../util'
import { UserID } from '../user'

import { CarState } from './car-state'
import { FuelType } from './fuel-type'

export type CarID = Opaque<number, 'car-id'>

export type CarProperties = {
  id: CarID
  carTypeId: number
  name: string
  ownerId: UserID
  state: CarState
  fuelType: FuelType
  horsepower: number
  licensePlate: string | null
  info: string | null
}

export class CarType {
  @IsInt()
  @IsPositive()
  public readonly id: CarID

  @IsInt()
  @IsPositive()
  public readonly CarTypeId: number

  @IsString()
  @IsNotEmpty()
  public readonly name: string

  @IsInt()
  @IsPositive()
  public readonly ownerId: UserID

  @IsEnum(CarState)
  public readonly state: CarState

  @IsEnum(FuelType)
  public readonly fuelType: FuelType

  @IsInt()
  @IsPositive()
  public readonly horsepower: number

  @IsString()
  @Nullable()
  @IsNotEmpty()
  public readonly licensePlate: string | null

  @IsString()
  @Nullable()
  public readonly info: string | null

  public constructor(data: CarProperties) {
    this.id = data.id
    this.CarTypeId = data.carTypeId
    this.name = data.name
    this.ownerId = data.ownerId
    this.state = data.state
    this.fuelType = data.fuelType
    this.horsepower = data.horsepower
    this.licensePlate = data.licensePlate
    this.info = data.info

    validate(this)
  }
}
