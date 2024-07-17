import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserAuthenticationService } from '../user-authentication.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwtService: JwtService,
    private authService: UserAuthenticationService
  ) {}
  
  async canActivate( context: ExecutionContext ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException('There is no bearer token');

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        token, { secret: process.env.JWT_SEED }
      );
        
      const user = await this.authService.findOneById( payload.id );
      if ( !user ) throw new UnauthorizedException('User does not exists');
      if ( !user.isActive ) throw new UnauthorizedException('User is not active');
      
      request['user'] = user;

    } catch (error) {
      throw new UnauthorizedException();
    }
   
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}