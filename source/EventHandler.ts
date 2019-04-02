import TelegramBot from 'node-telegram-bot-api';
import Sequelize from "./Models";
import sequelize = require('sequelize');

export default class EventHandler {
    bot: TelegramBot;
    user: any;

    constructor(bot: TelegramBot) {
        this.bot = bot;
        this.user = Sequelize.models.user;
    }

    /**
     * states: 0 - не активен, 1 - в игре
     * roles: 0 - мирный житель, 1 - мафия, 2 - комиссар, 3 - врач
     */

    public listen() {
        // Начало работы с ботом
        this.bot.onText(/\/start/, (data: TelegramBot.Message) => {
            this.user.findOrCreate({
                where: {
                    telegram_id: data.from.id
                },
                defaults: {
                    first_name: data.from.first_name,
                    last_name: data.from.last_name,
                    username: data.from.username
                }
            }).spread((user: any, created: boolean) => {
                if (created) {
                    this.bot.sendMessage(data.from.id, `Добрый день, ${data.from.first_name}! Вы успешно зарегистрированы в системе 😊`);
                } else {
                    this.bot.sendMessage(data.from.id, `С возвращением, ${data.from.first_name}!`);
                }

                this.bot.sendMessage(data.from.id, "Нажмите кнопку \"Играть\", чтобы начать игру 😊", {
                    reply_markup: {
                        keyboard: [
                            [{
                                text: "Играть"
                            }]
                        ],
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                });
            });
        });

        // Назначение ведущего
        this.bot.onText(/\/lead/, (data: TelegramBot.Message) => {
            this.bot.sendMessage(data.from.id, "Нажмите \"Начать\", чтобы распределить роли, когда все будут готовы 😊", {
                reply_markup: {
                    keyboard: [
                        [{
                            text: "Начать"
                        }]
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            });
        });

        // Сброс игроков
        this.bot.onText(/\/reset/, (data: TelegramBot.Message) => {
            this.user.findAll({
                where: {
                    state: 1
                }
            }).then((users: any) => {
                for (let user of users) {
                    user.update({
                        state: 0,
                        role: 0
                    });

                    this.bot.sendMessage(user.telegram_id, "Нажмите кнопку \"Играть\", чтобы начать игру 😊", {
                        reply_markup: {
                            keyboard: [
                                [{
                                    text: "Играть"
                                }]
                            ],
                            resize_keyboard: true,
                            one_time_keyboard: true
                        }
                    });
                }

                this.bot.sendMessage(data.from.id, "Игроки сброшены ))");
            });
        });

        // Пасхалка
        this.bot.onText(/\/egg/, (data: TelegramBot.Message) => {
            this.sendPlayers("Илья чмо 😊");
        });

        // Обработка reply_keyboard
        this.bot.on("message", (data: TelegramBot.Message) => {
            switch (data.text) {
                case "Играть":
                    this.user.findOne({
                        where: {
                            telegram_id: data.from.id
                        }
                    }).then((user: any) => {
                        user.update({
                            state: 1
                        });

                        this.bot.sendMessage(data.from.id, "Игра начнется после команды ведущего, ожидайте 😊");
                    });

                    break;
                case "Начать":
                    this.startGame();
                    break;
                default:
                    break;
            }
        });
    }

    public startGame() {
        let mafia_count = 0;
        let comissar = false;
        let doctor = false;

        this.user.findAll({
            where: {
                state: 1
            },
            order: sequelize.literal("RAND()")
        }).then((users: any) => {
            for (let user of users) {
                /**
                 * states: 0 - не активен, 1 - в игре
                 * roles: 0 - мирный житель, 1 - мафия, 2 - комиссар, 3 - врач
                 */

                if (mafia_count < 2) {
                    user.update({
                        role: 1
                    });

                    mafia_count++;

                    this.bot.sendMessage(user.telegram_id, `${user.first_name}, в этой игре вы мафия!`);
                } else if (!comissar) {
                    user.update({
                        role: 2
                    });

                    comissar = true;

                    this.bot.sendMessage(user.telegram_id, `${user.first_name}, в этой игре вы комиссар!`);
                } else if (!doctor) {
                    user.update({
                        role: 3
                    });

                    doctor = true;

                    this.bot.sendMessage(user.telegram_id, `${user.first_name}, в этой игре вы врач!`);
                } else {
                    this.bot.sendMessage(user.telegram_id, `${user.first_name}, в этой игре вы мирный житель!`);
                }
            }
        });
    }

    public sendPlayers(text: string) {
        this.user.findAll({
            where: {
                state: 1
            }
        }).then((users: any) => {
            for (let user of users) {
                this.bot.sendMessage(user.telegram_id, text);
            }
        });
    }

}