
const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    class Message extends Model {}

    Message.init(
        {
            messageID: {
                type: DataTypes.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue : DataTypes.UUIDV4
            },
            senderID: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            receiverID: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            message: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            messageType: {
                type: DataTypes.ENUM('text','bargain'),
                allowNull: false,
                defaultValue: 'text'
            }
        },
        {
            sequelize,
            modelName: 'Message',
        },
    );

    return Message;
};
