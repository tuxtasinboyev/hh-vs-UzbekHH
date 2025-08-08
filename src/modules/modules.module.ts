import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { ReviewsModule } from './reviews/reviews.module';
import { PaymentModule } from './payment/payment.module';

@Module({
    imports: [AuthModule,UsersModule, ReviewsModule, PaymentModule]
})
export class ModulesModule { }