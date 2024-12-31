import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotService } from './bot.service';
import { GroqModule } from 'src/groq/groq.module';
import { CommandRegistrationService } from './command-registration.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // TelegrafModule.forRoot({
    //   // token: process.env['BOT_TOKEN'],
    //   token: '7902385594:AAHcHJPYJE05VjzpgZUi--55gTJ_0XCqdUI',
    // }),
    TelegrafModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        token: configService.get<string>('BOT_TOKEN'), // Get BOT_TOKEN from ConfigService
      }),
    }),
    GroqModule,
  ],
  providers: [BotService, CommandRegistrationService],
})
export class BotModule {}
