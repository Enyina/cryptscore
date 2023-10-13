import { Controller, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';

@Controller('prediction')
@UseGuards(JwtGuard)
export class PredictionController {}
