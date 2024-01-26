import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
} from 'class-validator'
import { Nullable } from 'class-validator-extended'
import { type Writable } from 'type-fest'

import {
  CarTypeID,
  type Car,
  type CarID,
  UserID,
  CarState,
  FuelType,
} from '../../application'
import { validate } from '../../util'
import { ESLint } from 'eslint'
import { PickType } from '@nestjs/swagger'

export class CarDTO {
  @IsInt()
  @IsPositive()
  public readonly id!: CarID

  @IsInt()
  @IsPositive()
  public readonly carTypeId!: CarTypeID

  @IsString()
  @IsNotEmpty()
  public readonly name!: string

  @IsInt()
  @IsPositive()
  public readonly ownerId!: UserID

  @IsEnum(CarState)
  public readonly state!: CarState

  @IsEnum(FuelType)
  public readonly fuelType!: FuelType

  @IsInt()
  @IsPositive()
  public readonly horsepower!: number

  @Nullable()
  @IsString()
  @IsNotEmpty()
  public readonly licensePlate!: string | null

  @IsString()
  @Nullable()
  public readonly info!: string | null

  public static create(data: {
    id: CarID
    carTypeId: CarTypeID
    name: string
    state: CarState
    ownerId: UserID
    fuelType: FuelType
    horsepower: number
    licensePlate: string | null
    info: string | null
  }): CarDTO {
    const instance = new CarDTO() as Writable<CarDTO>

    instance.id = data.id
    instance.carTypeId = data.carTypeId
    instance.name = data.name
    instance.state = data.state
    instance.ownerId = data.ownerId
    instance.fuelType = data.fuelType
    instance.horsepower = data.horsepower
    instance.licensePlate = data.licensePlate
    instance.info = data.info

    return validate(instance)
  }

  public static fromModel(car: Car): CarDTO {
    return CarDTO.create(car)
  }
}

export class CreateCarDTO extends PickType(CarDTO, [
  'carTypeId',
  'name',
  'fuelType',
  'horsepower',
  'licensePlate',
  'info',
] as const) {}
