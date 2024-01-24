import { Injectable } from '@nestjs/common'
import { Except } from 'type-fest'

import { Car, IcarRepository } from 'src/application/car/car'
import { CarState } from 'src/application/car/car-state'
import { ICarRepository } from 'src/application/car/car.repository.interface'
import { FuelType } from 'src/application/car/fuel-type'

import {
  type CarID,
  type CarProperties,
  type CarState,
  type FuelType,
  type CarTypeID,
  type ICarRepository,
  type UserID,
} from '../application'

import { type Transaction } from './database-connection.interface'

type Row = {
  id: number
  car_type_id: number
  name: string
  owner_id: number
  state: string
  fuel_type: string
  horse_power: number
  license_plate: string | null
  info: string | null
}

function rowToDomain(row: Row): Car {
  return new Car({
    id: row.id as CarID,
    carTypeId: row.car_type_id as CarTypeID,
    name: row.name,
    ownerId: row.owner_id as UserID,
    state: row.state as CarState,
    fuelType: row.fuel_type as FuelType,
    horsePower: row.horse_power,
    licensePlate: row.license_plate,
    info: row.info,
  })
}

@Injectable()
export class CarRepository implements ICarRepository {
  public async find(tx: Transaction, id: CarID): Promise<Car | null> {
    const maybeRow = await tx.oneOrNone<Row>(
      'SELECT * FROM cars WHERE id = $(id)',
      {
        id,
      },
    )
    return maybeRow ? rowToDomain(maybeRow) : null
  }
}
