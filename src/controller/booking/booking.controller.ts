import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common'

import {
  type BookingID,
  IBookingService,
  BookingNotFoundError,
} from '../../application'
import { AuthenticationGuard } from '../authentication.guard'

import { BookingDTO } from './booking.dto'

@UseGuards(AuthenticationGuard)
@Controller('booking')
export class BookingController {
  public constructor(private readonly bookingService: IBookingService) {}

  @Get()
  public async getAll(): Promise<BookingDTO[]> {
    const bookings = await this.bookingService.getAll()
    return bookings.map(booking => BookingDTO.fromModel(booking))
  }

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
}
