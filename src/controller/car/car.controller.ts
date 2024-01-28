import {
  Body,
  ConflictException,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common'

import { DuplicateLicensePlateError } from 'src/application/car/duplicate-license-plate.error'

import {
  Car,
  type CarID,
  ICarService,
  IUserService,
  UserID,
  CarProperties,
  User,
  CarState,
} from '../../application'
import { AuthenticationGuard } from '../authentication.guard'
import { CurrentUser } from '../current-user.decorator'
import { UserDTO } from '../user'

import { CarDTO, CreateCarDTO } from './car.dto'

// @UseGuards(AuthenticationGuard)
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
  public async getAll(): Promise<CarDTO[]> {
    const cars = await this.carService.getAll()
    return cars.map(car => CarDTO.fromModel(car))
  }

  @Post()
  public async create(
    @CurrentUser() owner: User,
    @Body() data: CreateCarDTO,
  ): Promise<CarDTO> {
    try {
      const ownerId = owner.id
      const state = CarState.LOCKED
      const newData = { ...data, ownerId, state }

      const newCar = await this.carService.create(newData)
      return CarDTO.fromModel(newCar)
    } catch (error) {
      if (error instanceof DuplicateLicensePlateError) {
        throw new ConflictException(error.message)
      }
      throw error
    }
  }
}
