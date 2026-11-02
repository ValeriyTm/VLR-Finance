import { Controller } from '@nestjs/common';
import { GrpcMethod, GrpcService } from '@nestjs/microservices';
import { AuthService } from './auth.service';

interface ValidateUserTariffRequest {
  access_token: string;
  user_id?: string;
}

interface ValidateUserTariffResponse {
  is_valid: boolean;
  user_id: string;
  role: string;
  remaining_limits: Record<string, number>;
  error_message?: string;
}

@GrpcService('auth.AuthService')
export class AuthGrpcController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'ValidateUserTariff')
  async validateUserTariff(
    data: ValidateUserTariffRequest,
  ): Promise<ValidateUserTariffResponse> {
    try {
      // Validate access token
      const payload = await this.authService.validateAccessToken(data.access_token);

      // Check if user_id matches (if provided)
      if (data.user_id && data.user_id !== payload.sub) {
        return {
          is_valid: false,
          user_id: '',
          role: '',
          remaining_limits: {},
          error_message: 'User ID mismatch',
        };
      }

      // TODO: Check revocation status in Redis
      // TODO: Check and decrement business limits in Redis
      // For now, return default limits based on role
      const limits = this.getBusinessLimits(payload.role);

      return {
        is_valid: true,
        user_id: payload.sub,
        role: payload.role,
        remaining_limits: limits,
      };
    } catch (error) {
      return {
        is_valid: false,
        user_id: '',
        role: '',
        remaining_limits: {},
        error_message: error.message || 'Invalid token',
      };
    }
  }

  private getBusinessLimits(role: string): Record<string, number> {
    // Business limits per role
    const limits: Record<string, Record<string, number>> = {
      USER: {
        ai_requests_per_minute: 5,
        premium_analytics: 0,
      },
      PREMIUM: {
        ai_requests_per_minute: 30,
        premium_analytics: 100,
      },
      ADMIN: {
        ai_requests_per_minute: 1000,
        premium_analytics: 1000,
      },
    };

    return limits[role] || limits.USER;
  }
}
