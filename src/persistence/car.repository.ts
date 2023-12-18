import { Injectable } from '@nestjs/common'
import { type Except } from 'type-fest'

import {
  type CarID,
  type CarProperties,
  type CarState,
  type CarTypeID,
  type FuelType,
  type ICarRepository,
  type UserID,
} from '../application'
import { Car, CarNotFoundError } from '../application/car'

import { type Transaction } from './database-connection.interface'

type Row = {
  id: number
  car_type_id: number
  owner_id: number
  name: string
  state: string
  fuel_type: string
  horsepower: number
  license_plate: string | null
  info: string | null
}

// Please remove the next line when implementing this file.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function rowToDomain(row: Row): Car {
  return new Car({
    id: row.id as CarID,
    carTypeId: row.car_type_id as CarTypeID,
    ownerId: row.owner_id as UserID,
    state: row.state as CarState,
    name: row.name,
    fuelType: row.fuel_type as FuelType,
    horsepower: row.horsepower,
    licensePlate: row.license_plate,
    info: row.info,
  })
}

// Please remove the next line when implementing this file.
/* eslint-disable @typescript-eslint/require-await */

@Injectable()
export class CarRepository implements ICarRepository {
  public async find(_tx: Transaction, _id: CarID): Promise<Car | null> {
    const maybeRow = await _tx.oneOrNone<Row>(
      'SELECT * FROM cars WHERE id = $(id)',
      {
        id: _id,
      },
    )
    return maybeRow ? rowToDomain(maybeRow) : null
  }

  public async get(_tx: Transaction, _id: CarID): Promise<Car> {
    const car = await this.find(_tx, _id)

    if (!car) {
      throw new CarNotFoundError(_id)
    }
    return car
  }

  public async getAll(_tx: Transaction): Promise<Car[]> {
    const rows = await _tx.any<Row>('SELECT * FROM cars ')
    return rows.map(row => rowToDomain(row))
  }

  public async findByLicensePlate(
    _tx: Transaction,
    _licensePlate: string,
  ): Promise<Car | null> {
    const row = await _tx.oneOrNone<Row>(
      `
    SELECT * FROM cars
    WHERE license_plate = $(licensePlate)
    `,
      {
        licensePlate: _licensePlate,
      },
    )

    return row ? rowToDomain(row) : null
  }

  public async update(_tx: Transaction, _car: Car): Promise<Car> {
    const row = await _tx.oneOrNone<Row>(
      `UPDATE cars SET
        car_type_id = $(carTypeId),
        owner_id = $(ownerId),
        name = $(name),
        state = $(state),
        fuel_type = $(fuelType),
        horsepower = $(horsepower),
        license_plate = $(licensePlate),
        info = $(info)
      WHERE id = $(id)
      RETURNING *`,
      { ..._car },
    )
    if (row === null) {
      throw new CarNotFoundError(_car.id)
    }
    return rowToDomain(row)
  }

  public async insert(
    _tx: Transaction,
    _car: Except<CarProperties, 'id'>,
  ): Promise<Car> {
    const row = await _tx.one<Row>(
      `INSERT INTO cars(
        car_type_id,
        owner_id,
        name,
        state,
        fuel_type,
        horsepower,
        license_plate,
        info
      )VALUES(
        $(carTypeId),
        $(ownerId),
        $(name),
        $(state),
        $(fuelType),
        $(horsepower),
        $(licensePlate),
        $(info)
      )RETURNING *`,
      { ..._car },
    )
    return rowToDomain(row)
  }
}
