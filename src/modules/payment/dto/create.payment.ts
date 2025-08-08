import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsInt, IsEnum, IsOptional } from 'class-validator';
import { PaymentGateway, PaymentStatus } from '@prisma/client';

export class CreatePaymentDto {
  @ApiProperty({ description: 'Buyurtmachi ID' })
  @IsUUID()
  payer_id: string;

  @ApiProperty({ description: 'Dasturchi ID' })
  @IsUUID()
  receiver_id: string;

  @ApiProperty({ description: 'Loyiha ID' })
  @IsUUID()
  project_id: string;

  @ApiProperty({ description: 'To‘lov summasi (so‘m)', example: 500000 })
  @IsInt()
  amount: number;

  @ApiProperty({ enum: PaymentGateway, description: 'To‘lov gatewayi' })
  @IsEnum(PaymentGateway)
  gateway: PaymentGateway;

  @ApiProperty({ enum: PaymentStatus, description: 'To‘lov statusi', required: false })
  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;
}
