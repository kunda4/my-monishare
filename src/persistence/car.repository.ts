import { Injectable } from '@nestjs/common'
import { Except } from 'type-fest'

import { CarState } from 'src/application/car/car-state'
import { FuelType } from 'src/application/car/fuel-type'

import {
  Car,
  type CarID,
  CarNotFoundError,
  CarProperties,
  type ICarRepository,
  UserID,
} from '../application'

import { type Transaction } from './database-connection.interface'

type Row = {
  id: CarID
  carTypeId: number
  name: string
  ownerId: UserID
  state: CarState
  fuelType: FuelType
  horsePower: number
  licensePlate: string | null
  info: string | null
}

function rowToDomain(row: Row): Car {
  return new Car({
    id: row.id,
    carTypeId: row.carTypeId,
    name: row.name,
    ownerId: row.ownerId,
    state: row.state,
    fuelType: row.fuelType,
    horsePower: row.horsePower,
    licensePlate: row.licensePlate,
    info: row.info,
  })
}

@Injectable()
export class CarRepository implements ICarRepository {
    
}