import { ConflictException, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create.payment';
import { UpdatePaymentDto } from './dto/update.payment';
import { PrismaService } from 'src/core/config/prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}
  async create(dto: CreatePaymentDto) {
    let payment = await this.prisma.payment.findFirst({
      where: {
        payer_id: dto.payer_id,
        receiver_id: dto.receiver_id,
        project_id: dto.project_id,
      },
    });
    if (payment) {
      throw new ConflictException('Payment already exists');
    }
    return {
      success: true,
      data: await this.prisma.payment.create({
        data: dto,
      }),
    };
  }

  async findAll(role: string, type?: string, userId?: string) {
    if (role === 'ADMIN') {
      if (!type) {
        return {
          success: true,
          data: await this.prisma.payment.findMany(),
        };
      }
      let where: any = {};

      if (type === 'payer_id') {
        where.payer_id = { not: null };
      } else if (type === 'receiver_id') {
        where.receiver_id = { not: null };
      } else if (type === 'project_id') {
        where.project_id = { not: null };
      }

      return {
        success: true,
        data: await this.prisma.payment.findMany({ where }),
      };
    }

    if (role === 'CUSTOMER') {
      return {
        success: true,
        data: await this.prisma.payment.findMany({
          where: { payer_id: userId },
        }),
      };
    }

    if (role === 'DEVELOPER') {
      return {
        success: true,
        data: await this.prisma.payment.findMany({
          where: { receiver_id: userId },
        }),
      };
    }
  }

  findOne(id: string) {
    const payment = this.prisma.payment.findUnique({
      where: { id },
      include: { project: true, payer: true, receiver: true },
    });
    if (!payment) {
      throw new ConflictException('Payment not found');
    }
    return { success: true, data: payment };
  }
}
