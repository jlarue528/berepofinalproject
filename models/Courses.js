const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Courses extends Sequelize.Model {}
    Courses.init({
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please enter title'
                }, 
                notEmpty: {
                    msg: 'Please provide a title'
                },
            },
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please add description'
                },
                notEmpty: {
                    msg: 'Please provide a description'
                },
            },
        },
        estimatedTime: {
            type: DataTypes.STRING
        },
        materialsNeeded: {
            type: DataTypes.STRING
        }
    },
    { sequelize });

    Courses.associate = (models) => {
        Courses.belongsTo(models.Users,
            {
                foreignKey: 'userId',
                allowNull: false
            }
        )
    };

    return Courses;
}