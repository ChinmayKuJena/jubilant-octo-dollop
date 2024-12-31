from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text("Hello! I am your bot. How can I help you?")

if __name__ == "__main__":
    app = ApplicationBuilder().token("").build()

    app.add_handler(CommandHandler("start", start))
    app.run_polling()
