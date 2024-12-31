import { Injectable } from '@nestjs/common';
import { Command, Ctx, On, Start, Update } from 'nestjs-telegraf';
import { GroqService } from 'src/groq/groq.service';
import { Context } from 'telegraf';

@Update()
@Injectable()
export class BotService {
  constructor(private readonly service: GroqService) {}

  private isAdmin(user: any): boolean {
    const adminUsernames = ['chinmay']; // Add admin usernames here (case-insensitive)
    return adminUsernames.includes(user?.first_name.toLowerCase());
  }

  private logUserActivity(user: any, activity: string): void {
    const userInfo = `User: ${user?.first_name || 'Guest'} ${
      user?.username ? `(@${user.username})` : ''
    }, ID: ${user?.id || 'N/A'}`;
    console.log(`[Activity Log] ${userInfo} - ${activity}`);
  }

  private async restrictToAdmins(
    ctx: Context,
    user: any,
    activity: string,
  ): Promise<boolean> {
    this.logUserActivity(user, activity);

    if (!this.isAdmin(user)) {
      await ctx.reply(
        'Access Denied: This command is restricted to administrators.',
      );
      return false;
    }
    return true;
  }

  // @Start()
  // async onStart(@Ctx() ctx: Context) {
  //   const user = ctx.message?.from;
  //   const firstName = user?.first_name || 'Guest';
  //   const username = user?.username ? `(@${user.username})` : '';

  //   this.logUserActivity(user, 'Start Command');
  //   const currentHour = new Date().getHours();
  //   const greeting =
  //     currentHour >= 5 && currentHour < 12
  //       ? 'Good Morning! 🌞'
  //       : currentHour >= 12 && currentHour < 18
  //       ? 'Good Afternoon! 🌤️'
  //       : currentHour >= 18 && currentHour < 22
  //       ? 'Good Evening! 🌇'
  //       : 'Good Night! 🌙';

  //   const aiGreeting = await this.service.getChatCompletionWithPrompt(
  //     `${greeting}, ${firstName} ${username}! Welcome the user warmly.`,
  //   );

  //   await ctx.reply(aiGreeting.content || greeting);
  // }

  @Start()
  async onStart(@Ctx() ctx: Context) {
    const user = ctx.message?.from;
    const firstName = user?.first_name || 'Guest';

    this.logUserActivity(user, 'Start Command');

    // Define special days and greetings
    const specialDays: { [key: string]: string } = {
      '01-01': "Happy New Year! 🎉 Let's make this year amazing!",
      '12-25': 'Merry Christmas! 🎄 Hope you have a wonderful holiday!',
      '10-02': 'Happy Gandhi Jayanti! 🇮🇳 Let us remember the Mahatma today.',
      '31-12': 'Advance New Year, ',
      // Add more special days here in the format MM-DD
    };

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(5, 10); // Format as MM-DD
    const specialGreeting = specialDays[formattedDate];

    const currentHour = currentDate.getHours();
    const greeting =
      currentHour >= 5 && currentHour < 12
        ? 'Good Morning! 🌞'
        : currentHour >= 12 && currentHour < 17
          ? 'Good Afternoon! 🌤️'
          : currentHour >= 17 && currentHour < 22
            ? 'Good Evening! 🌇'
            : 'Good Night! 🌙';

    const baseGreeting = `${greeting}, To : ${firstName}!`;

    // const finalGreeting = specialGreeting
    //   ? `${baseGreeting}\n\n🎉 Special Message: ${specialGreeting}`
    //   : baseGreeting;

    const aiGreeting = await this.service.getChatCompletionWithPrompt(
      `${baseGreeting} Welcome the user warmly.`,
    );

    await ctx.reply(aiGreeting.content);
  }

  @On('sticker')
  async onSticker(@Ctx() ctx: Context) {
    const user = ctx.message?.from;
    this.logUserActivity(user, 'Sent Sticker');
    await ctx.reply('Nice sticker! But I cannot reply to stickers.');
  }

  @Command('time')
  async onTime(@Ctx() ctx: Context) {
    const user = ctx.message?.from;

    if (!(await this.restrictToAdmins(ctx, user, 'Time Command'))) {
      return;
    }

    const currentTime = new Date().toLocaleString();
    await ctx.reply(`The current time is: ${currentTime}`);
  }

  @Command('help')
  async onHelp(@Ctx() ctx: Context) {
    const user = ctx.message?.from;

    if (!(await this.restrictToAdmins(ctx, user, 'Help Command'))) {
      return;
    }

    await ctx.reply(
      'Here are the available commands:\n' +
        '/start - Start the bot\n' +
        '/help - Get help with bot commands\n' +
        '/time - Get the current time',
    );
  }

  private async handleRestrictedCommand(
    ctx: Context,
    user: any,
    description: string,
    restrictedTo: string,
  ) {
    const response =
      await this.service.getChatCompletionWithPrompt(description);
    await ctx.reply(response.content);
  }

  @On('text')
  async onText(@Ctx() ctx: Context) {
    const user = ctx.message?.from;
    const userMessage = (ctx.message as any)?.text;
    this.logUserActivity(user, `Sent Text: ${userMessage}`);

    if (userMessage.startsWith('/')) {
      return;
    }

    const aiResponse =
      await this.service.getChatCompletionWithPrompt(userMessage);
    await ctx.reply(
      aiResponse.content || 'Sorry, I could not understand that.',
    );
  }
}
