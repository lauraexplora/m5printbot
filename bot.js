require('dotenv').config();

const { Bot } = require("grammy");
const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://mqtt.m5stack.com");
const wordwrap = require('wordwrapjs');

const bot = new Bot(process.env.BOT_TOKEN);

client.on("connect", () => {
  client.subscribe(process.env.PRINTER_MAC, (err) => {
    if (err) {
        console.log(err);
    }
  });
});

bot.on("message:text", (ctx) => {
    ctx.reply("Sending to printer: " + ctx.message.text);
    client.publish(process.env.PRINTER_MAC, "TEXT,0,0:"+ wordwrap.wrap(ctx.message.text, { width: 32 }));
});

bot.start();