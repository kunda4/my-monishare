import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  Post,
  Patch,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import dayjs from 'dayjs'

import {
  type BookingID,
  IBookingService,
  BookingState,
  User,
  CarNotFoundError,
  ICarService,
} from '../../application'
import { AuthenticationGuard } from '../authentication.guard'
import { CurrentUser } from '../current-user.decorator'

import { BookingDTO, CreateBookingDTO, PatchBookingDTO } from './booking.dto'

@ApiTags('Booking')
@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description:
    'The request was not authorized because the JWT was missing, expired or otherwise invalid.',
})
@ApiInternalServerErrorResponse({
  description: 'An internal server error occurred.',
})
@UseGuards(AuthenticationGuard)
@Controller('booking')
export class BookingController {
  public constructor(
    private readonly bookingService: IBookingService,
    private readonly carService: ICarService,
  ) {}

  @ApiOperation({
    summary: 'Retrieve all bookings.',
  })
  @Get()
  public async getAll(): Promise<BookingDTO[]> {
    const bookings = await this.bookingService.getAll()
    return bookings.map(booking => BookingDTO.fromModel(booking))
  }

  @ApiOperation({
    summary: 'Retrieve a specific Booking.',
  })
  @ApiOkResponse({
    description: 'The request was successful.',
    type: BookingDTO,
  })
  @ApiBadRequestResponse({
    description:
      'The request was malformed, e.g. missing or invalid parameter or property in the request body.',
  })
  @ApiNotFoundResponse({
    description: 'No Booking with the given id was found.',
  })
  @Get(':id')
  public async get(
    @Param('id', ParseIntPipe) id: BookingID,
    @CurrentUser() user: User,
  ): Promise<BookingDTO> {
    try {
      const booking = await this.bookingService.get(id)
      const car = await this.carService.get(booking.carId)
      if (car.ownerId !== user.id && booking.renterId !== user.id) {
        throw new UnauthorizedException(
          'You are not allowed to access this booking.',
        )
      }
      return BookingDTO.fromModel(booking)
    } catch (error) {
      throw error
    }
  }

  @ApiOperation({
    summary: 'Create a new booking.',
  })
  @ApiCreatedResponse({
    description: 'A new booking was created.',
  })
  @ApiBadRequestResponse({
    description:
      'The request was malformed, e.g. missing or invalid parameter or property in the request body.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal sever error',
  })
  @Post()
  public async create(
    @Body() data: CreateBookingDTO,
    @CurrentUser() renter: User,
  ): Promise<BookingDTO> {
    try {
      const newBookingData = {
        carId: data.carId,
        startDate: dayjs(data.startDate),
        endDate: dayjs(data.endDate),
        renterId: renter.id,
        state: BookingState.PENDING,
      }
      const newBooking = await this.bookingService.create(newBookingData)
      return BookingDTO.fromModel(newBooking)
    } catch (error) {
      if (error instanceof CarNotFoundError) {
        throw new BadRequestException(error.message)
      }
      throw error
    }
  }

  @ApiOperation({
    summary: 'Update an existing booking.',
  })
  @ApiOkResponse({
    description: 'The booking was updated',
  })
  @ApiNotFoundResponse({
    description: 'No booking with the given id was found.',
  })
  @ApiBadRequestResponse({
    description:
      'The request was malformed, e.g. missing or invalid parameter or property in the request body.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @Patch(':id')
  public async update(
    @Param('id', ParseIntPipe) id: BookingID,
    @Body() data: PatchBookingDTO,
  ): Promise<BookingDTO> {
    try {
      const booking = await this.bookingService.update(id, data)
      return BookingDTO.fromModel(booking)
    } catch (error) {
      throw error
    }
  }
}
