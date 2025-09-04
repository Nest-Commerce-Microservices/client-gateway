import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { handleRpcError } from 'src/common';
import { NATS_SERVICE } from 'src/config';
import { Token, User } from './decorators';
import { LoginUserDto, RegisterUserDto } from './dto';
import { AuthGuard } from './guards';
import { ICurrentUser } from './interfaces/current-user.interface';

@Controller('auth')
export class AuthController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post('register')
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.client.send('auth.register.user', registerUserDto).pipe(handleRpcError());
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.client.send('auth.login.user', loginUserDto).pipe(handleRpcError());
  }

  @UseGuards(AuthGuard)
  @Get('verify')
  verifyToken(@User() user: ICurrentUser, @Token() token: string) {
    // return this.client.send('auth.verify.token', {user, token}).pipe(handleRpcError());
    return { user, token };
  }
}
