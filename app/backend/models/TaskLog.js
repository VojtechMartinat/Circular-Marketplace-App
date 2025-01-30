const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    class TaskLog extends Model {}
    TaskLog.init({
        logID: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue : DataTypes.UUIDV4
        },
        taskID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        timeTaken:{
            type: DataTypes.BIGINT,
            allowNull: false,
        }
    },{
        sequelize,
        modelName: 'TaskLog',
    })
    return TaskLog;
}