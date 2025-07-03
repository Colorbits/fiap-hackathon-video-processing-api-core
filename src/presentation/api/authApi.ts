import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Inject,
  Logger,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  LoginDto,
  RefreshTokenDto,
  TokenResponseDto,
  User,
} from 'src/shared/models';
import { AuthService } from 'src/application/auth/service/authService';

@ApiTags('Auth')
@Controller('auth')
export class AuthApi {
  private readonly logger = new Logger(AuthApi.name);

  constructor(
    @Inject('AuthService')
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate user and get access token' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Authentication successful',
    type: TokenResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid credentials',
  })
  async login(@Body() loginDto: LoginDto): Promise<TokenResponseDto> {
    this.logger.log(`Login attempt for user: ${loginDto.email}`);
    try {
      const response = await this.authService.login(loginDto);
      this.logger.log(`User ${loginDto.email} authenticated successfully`);
      return response;
    } catch (error) {
      this.logger.error(
        `Authentication failed for ${loginDto.email}: ${error.message}`,
      );
      throw error;
    }
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    type: TokenResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid refresh token',
  })
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<TokenResponseDto> {
    this.logger.log('Token refresh requested');
    try {
      const authSession = await this.authService.refreshToken(refreshTokenDto);
      return {
        token: authSession.token,
        refreshToken: authSession.refreshToken,
        expiresAt: authSession.expiresAt,
        user: {
          id: authSession.user.id,
          name: authSession.user.name,
          email: authSession.user.email,
        },
      };
    } catch (error) {
      this.logger.error(`Token refresh failed: ${error.message}`);
      throw error;
    }
  }

  @Delete('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Logout current session' })
  @ApiResponse({ status: 204, description: 'Logout successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid token' })
  async logout(@Headers('authorization') authHeader: string): Promise<void> {
    const token = this.extractTokenFromHeader(authHeader);
    this.logger.log('Logout requested');

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      await this.authService.logout(token);
      this.logger.log('User logged out successfully');
    } catch (error) {
      this.logger.error(`Logout failed: ${error.message}`);
      throw error;
    }
  }

  @Delete('logout/all')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Logout all sessions for current user' })
  @ApiResponse({
    status: 204,
    description: 'All sessions terminated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid token' })
  async logoutAllSessions(
    @Headers('authorization') authHeader: string,
  ): Promise<void> {
    const token = this.extractTokenFromHeader(authHeader);
    this.logger.log('Logout all sessions requested');

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      // First validate the token to get the user
      const user = await this.authService.validateToken(token);
      // Then logout from all sessions
      await this.authService.logoutAll(user.id);
      this.logger.log(`All sessions terminated for user ${user.id}`);
    } catch (error) {
      this.logger.error(`Logout all sessions failed: ${error.message}`);
      throw error;
    }
  }

  @Get('validate')
  @ApiOperation({ summary: 'Validate token and get user info' })
  @ApiResponse({ status: 200, description: 'Token is valid', type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid token' })
  async validateToken(
    @Headers('authorization') authHeader: string,
  ): Promise<User> {
    const token = this.extractTokenFromHeader(authHeader);
    this.logger.log('Token validation requested');

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const user = await this.authService.validateToken(token);
      this.logger.log(`Token validated successfully for user ${user.id}`);
      return user;
    } catch (error) {
      this.logger.error(`Token validation failed: ${error.message}`);
      throw error;
    }
  }

  private extractTokenFromHeader(authHeader: string): string {
    if (!authHeader) {
      return null;
    }

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : null;
  }
}
