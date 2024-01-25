import { Except } from 'type-fest'

import { type Car, type CarID, CarProperties } from './car'

export abstract class ICarService {
  public abstract get(id: CarID): Promise<Car>
}
