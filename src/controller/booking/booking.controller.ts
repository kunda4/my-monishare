import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  UseGuards,
  Post,
  Patch,
  BadRequestException,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
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
  BookingNotFoundError,
  BookingState,
  User,
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
  public constructor(private readonly bookingService: IBookingService) {}

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
  ): Promise<BookingDTO> {
    try {
      const booking = await this.bookingService.get(id)
      return BookingDTO.fromModel(booking)
    } catch (error) {
      if (error instanceof BookingNotFoundError)
        throw new NotFoundException('Booking not found')

      throw error
    }
  }

  @Post()
  public async insert(
    @Body() data: CreateBookingDTO,
    @CurrentUser() renter: User,
  ): Promise<BookingDTO> {
    const state = BookingState.PENDING
    const renterId = renter.id

    if (!dayjs(data.startDate).isValid() || !dayjs(data.endDate).isValid()) {
      throw new BadRequestException('Invalid date format it should be ISO 8601')
    }
    const newData = { ...data, renterId, state }

    const newBooking = await this.bookingService.insert(newData)
    const newUpdatedBooking = {
      ...newBooking,
      startDate: dayjs(newBooking.startDate).toISOString(),
      endDate: dayjs(newBooking.endDate).toISOString(),
    }

    return BookingDTO.fromModel(newUpdatedBooking)
  }

  @Patch(':id')
  public async update(
    @Param('id', ParseIntPipe) id: BookingID,
    @Body() data: PatchBookingDTO,
  ): Promise<BookingDTO> {
    try {
      const booking = await this.bookingService.update(id, data)
      return BookingDTO.fromModel(booking)
    } catch (error) {
      if (error instanceof BookingNotFoundError)
        throw new NotFoundException('Booking not found')

      throw error
    }
  }
}
