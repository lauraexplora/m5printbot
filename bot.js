const { Bot } = require("grammy");
const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://mqtt.m5stack.com");
require('dotenv').config();

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
    client.publish(process.env.PRINTER_MAC, "TEXT,0,0:"+ ctx.message.text);
});

bot.start();