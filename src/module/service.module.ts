import { Module } from '@nestjs/common'

import {
  AuthenticationService,
  CarService,
  CarTypeService,
  IAuthenticationService,
  IBookingService,
  ICarService,
  ICarTypeService,
  IUserService,
  UserService,
} from '../application'
import { BookingService } from '../application/booking/booking.service'

import { DatabaseModule } from './database.module'
import { RepositoryModule } from './repository.module'

@Module({
  imports: [DatabaseModule, RepositoryModule],
  providers: [
    {
      provide: IAuthenticationService,
      useClass: AuthenticationService,
    },
    {
      provide: ICarService,
      useClass: CarService,
    },
    {
      provide: ICarTypeService,
      useClass: CarTypeService,
    },
    {
      provide: IUserService,
      useClass: UserService,
    },
    {
      provide: IBookingService,
      useClass: BookingService,
    },
  ],
  exports: [
    IAuthenticationService,
    ICarService,
    ICarTypeService,
    IUserService,
    IBookingService,
  ],
})
export class ServiceModule {}
