import { Injectable, Logger } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthGrpcClient {
  private readonly logger = new Logger(AuthGrpcClient.name);
  private authService: any;

  constructor(private client: ClientGrpc) {
    this.authService = this.client.getService('auth.AuthService');
  }

  async validateUserTariff(accessToken: string, userId?: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.authService.validateUserTariff({
          access_token: accessToken,
          user_id: userId,
        }),
      );

      return response;
    } catch (error) {
      this.logger.error('Failed to validate user tariff:', error);
      return {
        is_valid: false,
        user_id: '',
        role: '',
        remaining_limits: {},
        error_message: error.message,
      };
    }
  }
}
