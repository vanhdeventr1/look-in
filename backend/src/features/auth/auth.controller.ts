import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from "@nestjs/common";
import type { Response } from "express";
import { CurrentUser } from "src/cores/decorators/current-user.decorator";
import { JwtAuthGuard } from "src/cores/guards/jwt-auth.guard";
import { LocalAuthGuard } from "src/cores/guards/local-auth.guard";
import { JoiValidationPipe } from "src/cores/validators/pipes/joi-validation.pipe";
import { CreateUserDto } from "src/features/auth/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { registerSchema } from "./validations/requests/register.request";

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private getCookieOptions() {
    const isProduction = process.env.NODE_ENV === "production";

    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax" as const,
      maxAge: 365 * 24 * 60 * 60 * 1000,
      path: "/",
    };
  }

  private getAccessTokenFromRequest(req: any) {
    const bearer = req.headers.authorization?.replace(/^Bearer\s+/i, "");
    if (bearer) return bearer;

    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) return "";

    const tokenCookie = cookieHeader
      .split(";")
      .map((cookie: string) => cookie.trim())
      .find((cookie: string) => cookie.startsWith("access_token="));

    return tokenCookie
      ? decodeURIComponent(tokenCookie.split("=").slice(1).join("="))
      : "";
  }

  @UseGuards(LocalAuthGuard)
  @Post("login")
  login(@Request() req, @Res({ passthrough: true }) res: Response) {
    const result: any = this.authService.login(req.user);
    res.cookie("access_token", result.data.access_token, this.getCookieOptions());
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Post("logout")
  logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    const token = this.getAccessTokenFromRequest(req);
    res.clearCookie("access_token", this.getCookieOptions());
    return this.authService.logout(token);
  }

  @Post("register")
  register(
    @Body(new JoiValidationPipe(registerSchema)) createUserDto: CreateUserDto,
  ) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  profile(@CurrentUser() user) {
    return this.authService.profile(user);
  }
}
