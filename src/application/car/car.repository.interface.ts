import { Except } from 'type-fest'

import { type Transaction } from '../../persistence'

import { type Car, type CarID, CarProperties } from './car'

export abstract class ICarRepository {
  public abstract get(tx: Transaction, id: CarID): Promise<Car>

  public abstract getAll(tx: Transaction): Promise<Car[]>

  // public abstract update(tx: Transaction, id: CarID): Promise<Car>

  public abstract insert(
    tx: Transaction,
    properties: Except<CarProperties, 'id'>,
  ): Promise<Car>

  public abstract findByLicensePlate(
    tx: Transaction,
    licensePlate: string,
  ): Promise<Car | null>
}
