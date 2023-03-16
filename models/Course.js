'use strict';
const Sequelize = require('sequelize');


module.exports = (sequelize) => {
    class Course extends Sequelize.Model { }
    Course.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please provide a value for Title'
                },
                notEmpty: {
                    msg: "Please provide a value for Title"
                }
            }
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please provide a value for Description'
                },
                notEmpty: {
                    msg: "Please provide a value for Description"
                }
            }
        },
        estimatedTime: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        materialsNeeded: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    }, { sequelize });

    // Model association
    Course.associate = (models) => {
        Course.belongsTo(models.User, {
            foreignKey: {
                fieldName: 'userId',
                allowNull: false,
            }
        });
    };

    return Course;
};