import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import {
  Car,
  type CarID,
  ICarService,
  type User,
  CarState,
  AccessDeniedError,
  CarTypeNotFoundError,
} from '../../application'
import { DuplicateLicensePlateError } from '../../application/car/error'
import { AuthenticationGuard } from '../authentication.guard'
import { CurrentUser } from '../current-user.decorator'

import { CarDTO, CreateCarDTO, PatchCarDTO } from './car.dto'

@ApiTags(Car.name)
@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description:
    'The request was not authorized because the JWT was missing, expired or otherwise invalid.',
})
@ApiInternalServerErrorResponse({
  description: 'An internal server error occurred.',
})
@UseGuards(AuthenticationGuard)
@Controller('/cars')
export class CarController {
  private readonly carService: ICarService

  public constructor(carService: ICarService) {
    this.carService = carService
  }

  @ApiOperation({
    summary: 'Retrieve all cars.',
  })
  @Get()
  public async getAll(): Promise<CarDTO[]> {
    const cars = await this.carService.getAll()
    return cars.map(car => CarDTO.fromModel(car))
  }

  @ApiOperation({
    summary: 'Retrieve a specific car.',
  })
  @ApiOkResponse({
    description: 'The request was successful.',
    type: CarDTO,
  })
  @ApiBadRequestResponse({
    description:
      'The request was malformed, e.g. missing or invalid parameter or property in the request body.',
  })
  @ApiNotFoundResponse({
    description: 'No car with the given id was found.',
  })
  @Get(':id')
  public async get(@Param('id', ParseIntPipe) id: CarID): Promise<CarDTO> {
    const car = await this.carService.get(id)
    return CarDTO.fromModel(car)
  }

  @ApiOperation({
    summary: 'Create a new car.',
  })
  @ApiCreatedResponse({
    description: 'A new car was created.',
  })
  @ApiBadRequestResponse({
    description:
      'The request was malformed, e.g. missing or invalid parameter or property in the request body.',
  })
  @ApiConflictResponse({
    description: 'A car with the given license plate already exists.',
  })
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

  @ApiOperation({
    summary: 'Update an existing car.',
  })
  @ApiOkResponse({
    description: 'The car was updated.',
  })
  @ApiBadRequestResponse({
    description:
      'The request was malformed, e.g. missing or invalid parameter or property in the request body.',
  })
  @ApiNotFoundResponse({
    description: 'No car with the given id was found.',
  })
  @Patch(':id')
  public async patch(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) carId: CarID,
    @Body() data: PatchCarDTO,
  ): Promise<CarDTO> {
    try {
      const updatedCar = await this.carService.update(carId, data, user.id)
      return CarDTO.fromModel(updatedCar)
    } catch (error) {
      if (error instanceof AccessDeniedError) {
        throw new UnauthorizedException(error.message)
      }
      if (error instanceof CarTypeNotFoundError) {
        throw new BadRequestException('CarType doesnt exist')
      }
      if (error instanceof DuplicateLicensePlateError) {
        throw new ConflictException(error.message)
      }
      throw error
    }
  }
}
