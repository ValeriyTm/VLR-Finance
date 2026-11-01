import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SessionsModule } from './sessions/sessions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => {
        // Validate required environment variables
        const requiredVars = [
          'DATABASE_URL',
          'JWT_ACCESS_SECRET',
          'JWT_REFRESH_SECRET',
          'REDIS_URL',
        ];
        
        for (const varName of requiredVars) {
          if (!env[varName]) {
            throw new Error(`Missing required environment variable: ${varName}`);
          }
        }
        
        return env;
      },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 10, // 10 requests per minute
      },
    ]),
    AuthModule,
    UsersModule,
    SessionsModule,
  ],
})
export class AppModule {}
