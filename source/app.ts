declare var require: any;

require("dotenv").config();
import TelegramBot from "node-telegram-bot-api";
import EventHandler from "./EventHandler";

const Agent = require("socks5-https-client/lib/Agent");

class Bot {
    bot: TelegramBot;
    eventHandler: EventHandler;

    constructor() {
        const options: any = {
            polling: true,
            request: {
                agentClass: Agent,
                agentOptions: {
                    socksHost: "127.0.0.1",
                    socksPort: 9150
                }
            }
        };

        this.bot = new TelegramBot(process.env.TELEGRAM_TOKEN, options);
        this.eventHandler = new EventHandler(this.bot);
    }

    start() {
        this.eventHandler.listen();
    }
}

new Bot().start();