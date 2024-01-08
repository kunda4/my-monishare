import { Module } from '@nestjs/common'
import { ConfigModule as NestjsConfigModule } from '@nestjs/config'

import { ControllerModule, UtilityModule } from './module'
import { BookingService } from './application/booking/booking.service';
import { BookingController } from './controller/booking/booking.controller';

@Module({
  imports: [
    NestjsConfigModule.forRoot({ isGlobal: true }),
    UtilityModule,
    ControllerModule,
  ],
  providers: [BookingService],
  controllers: [BookingController],
})
export class MainModule {}
