/**
 * @description Пользователь
 */

export default (sequelize: any, Sequelize: any) => {
    const User = sequelize.define("user", {
        user_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            notEmpty: true
        },
        telegram_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            notEmpty: true
        },
        first_name: {
            type: Sequelize.STRING(100),
            allowNull: false,
            notEmpty: true
        },
        last_name: {
            type: Sequelize.STRING(100),
            allowNull: true,
            notEmpty: true
        },
        username: {
            type: Sequelize.STRING(100),
            allowNull: true,
            notEmpty: true
        },
        state: {
            type: Sequelize.INTEGER,
            allowNull: false,
            notEmpty: true,
            defaultValue: 0
        },
        role: {
            type: Sequelize.INTEGER,
            allowNull: false,
            notEmpty: true,
            defaultValue: 0
        }
    }, {
            freezeTableName: true,
            tableName: "a_users",
            underscored: true
        });

    return User;
}