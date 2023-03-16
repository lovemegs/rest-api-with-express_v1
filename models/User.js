'use strict';

const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  class User extends Model {}
  User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
            msg: 'Please provide a value for First Name'
        },
        notEmpty: {
            msg: "Please provide a value for First Name"
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
            msg: 'Please provide a value for Last Name'
        },
        notEmpty: {
            msg: "Please provide a value for Last Name"
        }
      }
    },
    emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: 'Please provide an Email Address'
            },
            notEmpty: {
                msg: "Please provide an Email Address"
            },
            isEmail: true
          }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Please provide a value for Password'
            },
            notEmpty: {
                msg: "Please provide a value for Password"
            },
            len: {
                args: [8, 20],
                msg: 'The password must be between 8 and 20 characters in length'
            },
            set(val) {
                if (val === this.password) {
                    const hashedPassword = bcrypt.hashSync(this.password, 10);
                    this.setDataValue('password', hashedPassword);
                 }
            }
        },
    },
  }, { sequelize });

 // Model association
  User.associate = (models) => {
    User.hasMany(models.Course, {
        foreignKey: {
            fieldName: 'userId'
        }
    });
  };

  return User;
};