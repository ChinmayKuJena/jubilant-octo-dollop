import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';

@Injectable()
export class CommandRegistrationService {
  constructor() {
    this.registerBotCommands();
  }

  private async registerBotCommands() {
    const botToken = process.env.BOT_TOKEN; // Your Telegram Bot Token
    const bot = new Telegraf(botToken);

    await bot.telegram.setMyCommands([
      { command: 'start', description: 'Start the bot' },
      { command: 'help', description: 'Get help with bot commands' },
      { command: 'about', description: 'Learn about this bot' },
      { command: 'time', description: 'Get the current time' },
      { command: 'joke', description: 'Get a random joke' },
    ]);

    console.log('Bot commands registered successfully!');
  }
}
