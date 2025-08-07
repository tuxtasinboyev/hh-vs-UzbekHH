import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GuardsService implements CanActivate {
  constructor(private jwtService: JwtService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token yoq');
    }

    const token = authHeader.split(' ')[1];
    let payload: any;

    try {
      const secret = process.env.JWT_SECRET
      payload = await this.jwtService.verifyAsync(token, { secret: secret });
      
    } catch (err) {


      throw new UnauthorizedException('Token notogri yoki muddati tugagan');
    }
    request.user = payload;

    return true;
  }
}
