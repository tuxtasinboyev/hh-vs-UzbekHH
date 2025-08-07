import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { ReviewsModule } from './reviews/reviews.module';

@Module({
    imports: [AuthModule,UsersModule, ReviewsModule]
})
export class ModulesModule { }