/**
 * @description Экспорт моделей
 */

import fs from "fs";
import path from "path";
import { Sequelize as sequelize } from "sequelize";

const Sequelize = new sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    dialect: "mysql",
    operatorsAliases: false,
    timezone: "+08:00",
    logging: false
});

fs
    .readdirSync(__dirname)
    .filter((folder: string) => {
        return (folder.indexOf(".") === -1);
    })
    .forEach((folder: string) => {
        Sequelize.import(path.join(__dirname, folder, process.env.ENVIRONMENT === "development" ? 'index.ts' : "index.js"));
    });

const User = Sequelize.models.user;

/**
 * Синхронизация таблиц
 * Не использовать Sequelize.sync(), так как важен порядок!
 */
(async () => {
    await User.sync();
})();

export default Sequelize;