import { Module } from '@nestjs/common';
import { HashingHelperService } from './helper/hashing.helper.service';

@Module({
  providers: [HashingHelperService],
  exports: [HashingHelperService],
})
export class CommonModule {}
