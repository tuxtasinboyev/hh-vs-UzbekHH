import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { PaymentsService } from './payment.service';
import { CreatePaymentDto } from './dto/create.payment';
import { UpdatePaymentDto } from './dto/update.payment';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { roles } from 'src/common/role/role.decorator';
import { GuardsService } from 'src/common/guards/guards.service';
import { RoleGuard } from 'src/common/role/role.service';
import { IsEnum, isEnum } from 'class-validator';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @UseGuards(GuardsService, RoleGuard)
  @roles('ADMIN')
  @ApiOperation({ summary: 'Yangi to‘lov yaratish' })
  create(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.create(dto);
  }

  @Get()
  @UseGuards(GuardsService)
  @ApiOperation({ summary: 'Barcha to‘lovlarni olish' })
  @ApiQuery({ name: "type",required: false,enum:['payer_id', 'receiver_id', 'project_id'], description: 'Filtrlash turi' })
  findAll(@Query('type') type?: string,@Req() req?: any) {
    return this.paymentsService.findAll(req.user.role, type,req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta to‘lovni olish' })
  @ApiParam({ name: 'id', description: 'To‘lov ID' })
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

}
