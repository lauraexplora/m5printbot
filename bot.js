import "dotenv/config.js";

import { Bot } from "grammy";
import mqtt from "mqtt";
import wordwrap from "wordwrapjs";
import getUrls from "get-urls";

const client = mqtt.connect("mqtt://mqtt.m5stack.com");
const bot = new Bot(process.env.BOT_TOKEN);

client.on("connect", () => {
  client.subscribe(process.env.PRINTER_MAC, (err) => {
    if (err) {
      console.log(err);
    }
  });
});

bot.on("message:text", (ctx) => {
  const urls = getUrls(ctx.message.text);

  ctx.reply("Sending to printer: " + ctx.message.text);

  if (!urls.has(ctx.message.text)) {
    client.publish(
      process.env.PRINTER_MAC,
      "TEXT,0,0:" + wordwrap.wrap(ctx.message.text, { width: 32 }),
    );
  }

  urls.forEach((url) => {
    client.publish(
      process.env.PRINTER_MAC,
      "TEXT,0,0:" + wordwrap.wrap(url, { width: 32 }),
    ),
    client.publish(process.env.PRINTER_MAC, "QR:" + url);
  });
});

bot.start();
