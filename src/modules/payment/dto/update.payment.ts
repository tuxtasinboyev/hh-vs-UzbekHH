import { PartialType } from '@nestjs/swagger';
import { CreatePaymentDto } from './create.payment';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {}
