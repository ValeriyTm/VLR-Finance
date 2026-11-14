import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { BullMQModule } from '../bullmq/bullmq.module';
import { MinIOModule } from '../minio/minio.module';

@Module({
  imports: [BullMQModule, MinIOModule],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}
