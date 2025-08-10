import { Module } from '@nestjs/common';
import { PaymentsService } from './payment.service';
import { PaymentsController } from './payment.controller';
import { JwtModule } from '@nestjs/jwt';
import { GuardsService } from 'src/common/guards/guards.service';

@Module({
    imports: [JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret_key', 
      signOptions: { expiresIn: '1d' },
    }),],
    providers: [PaymentsService,GuardsService],
    controllers: [PaymentsController]
})
export class PaymentModule {};