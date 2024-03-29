import { Except } from 'type-fest'

import { type Car, type CarID, CarProperties } from './car'

export abstract class ICarService {
  public abstract get(id: CarID): Promise<Car>
  public abstract getAll(): Promise<Car[]>
  public abstract create(data: Except<CarProperties, 'id'>): Promise<Car>
}
