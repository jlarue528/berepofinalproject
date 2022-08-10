const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
    class Users extends Sequelize.Model {}
    Users.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firstName: {
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
        lastName: {
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
        emailAddress: {
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
        password:  {
            type: DataTypes.STRING,
            allowNull: false,
            set(val) {
                    const hashedPassword = bcrypt.hashSync(val, 10);
                    this.setDataValue('password', hashedPassword);
            },
            validate: {
                notNull: {
                    msg: 'Please enter title'
                }, 
                notEmpty: {
                    msg: 'Please provide a title'
                },
            },
        },
    },
    { sequelize });

    Users.associate = (models) => {
        Users.hasMany(models.Courses, 
            {
                foreignKey: 'userId',
                allowNull: false
            }
        );
    };

    return Users;
}