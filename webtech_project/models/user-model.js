module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user', {
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
                notNull: {
                    message: 'Please write a valid username!'
                },
                len: [4, 20]
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                notNull: {
                    message: 'Please write a valid password!'
                },
                len: [4, 20]
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [3, 60]
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
                notNull: {
                    message: 'Please write a valid email!'
                },
                isEmail: true,
                len: [10, 50],
            }
        },
    }, {
        defaultScope: {
            attributes: {
                exclude: ['password']
            },
        }
    });

}