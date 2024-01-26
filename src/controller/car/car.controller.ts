import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common'

import {
  Car,
  type CarID,
  ICarService,
  IUserService,
  UserID,
} from '../../application'
import { AuthenticationGuard } from '../authentication.guard'
import { UserDTO } from '../user'

import { CarDTO } from './car.dto'

@Controller('/cars')
export class CarController {
  private readonly carService: ICarService

  public constructor(carService: ICarService) {
    this.carService = carService
  }

  @Get(':id')
  public async get(@Param('id', ParseIntPipe) id: CarID): Promise<CarDTO> {
    const car = await this.carService.get(id)
    return CarDTO.fromModel(car)
  }

  @Get()
  public async getAll()
}
