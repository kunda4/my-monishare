import { Injectable } from '@nestjs/common'

import { Car } from 'src/application/car/car'
import { CarNotFoundError } from 'src/application/car/car-not-found.error'

import {
  type CarID,
  type CarState,
  type FuelType,
  type CarTypeID,
  type UserID,
} from '../application'
import { ICarRepository } from '../application/car/car.repository.interface'

import { type Transaction } from './database-connection.interface'

type Row = {
  id: number
  car_type_id: number
  name: string
  owner_id: number
  state: string
  fuel_type: string
  horsepower: number
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
    horsepower: row.horsepower,
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

  public async get(tx: Transaction, id: CarID): Promise<Car> {
    const car = await this.find(tx, id)

    if (!car) {
      throw new CarNotFoundError(id)
    }

    return car
  }
}
