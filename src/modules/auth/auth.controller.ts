import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  signIn(@Body() signInArgs: { email: string; password: string }) {
    return this.authService.signIn(signInArgs);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('sign-out')
  signOut(@Request() req) {
    const { token } = req.user;
    return this.authService.signOut(token);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('verify-token')
  verifyToken(@Request() req) {
    const { user } = req;
    return { user };
  }
}
