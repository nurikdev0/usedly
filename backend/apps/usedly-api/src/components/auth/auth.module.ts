import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';

@Module({
	imports: [
		HttpModule,
		JwtModule.register({
			secret: `${process.env.ACCESS_SECRET_TOKEN}`,
			signOptions: { expiresIn: '20m' },
		}),
	],
	providers: [AuthService],
	exports: [AuthService],
})
export class AuthModule {}
