import { IsInt, IsNotEmpty, IsPositive, IsString, IsUrl } from 'class-validator'
import { Nullable } from 'class-validator-extended'
import { type Opaque } from 'type-fest'

import { validate } from '../../util'

export type CarID = Opaque<number, 'car-id'>

export type CarProperties = {
  id: CarID
  carTypeId: number
  name: string
  ownerId: number
  state: string
  fuelType: string
  horsepower: number
  licensePlate: string
  info: string
}
