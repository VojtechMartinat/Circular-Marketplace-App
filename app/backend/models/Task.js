const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    class Task extends Model {}
Task.init({
    taskID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    description:{
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'Task',
})
    return Task;
}