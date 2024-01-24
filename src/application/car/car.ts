import { IsInt, IsNotEmpty, IsPositive, IsString, IsUrl } from 'class-validator'
import { Nullable } from 'class-validator-extended'
import { type Opaque } from 'type-fest'

import { validate } from '../../util'
import { CarState } from './car-state'
import { UserID } from '../user'
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
  licensePlate: string
  info: string
}
