import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const isValid = this.authService.validateCredentials(loginDto.login, loginDto.password);

    if (!isValid) {
      throw new UnauthorizedException('Invalid login or password');
    }

    const { token, expiresIn, payload } = this.authService.generateToken();

    return {
      token,
      expiresIn,
      user: { login: payload.login },
    };
  }
}
