import { Module } from '@nestjs/common';
import { ApplicationsModule } from './applications/applications.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [SharedModule, ApplicationsModule],
})
export class AppModule {}
