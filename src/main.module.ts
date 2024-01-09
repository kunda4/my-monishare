import { Module } from '@nestjs/common'
import { ConfigModule as NestjsConfigModule } from '@nestjs/config'

import { ControllerModule, ServiceModule, UtilityModule } from './module'

@Module({
  imports: [
    NestjsConfigModule.forRoot({ isGlobal: true }),
    UtilityModule,
    ControllerModule,
  ],
  providers: [ServiceModule],
})
export class MainModule {}
