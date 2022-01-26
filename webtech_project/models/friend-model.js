module.exports = (sequelize, DataTypes) => {
    return sequelize.define('friend', {
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                notNull: {
                    message: 'Please write a valid username!'
                },
                len: [4, 20]
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [3, 30]
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                notNull: {
                    message: 'Please write a valid email!'
                },
                isEmail: true,
                len: [10, 50]
            }
        },
        tag: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                notNull: {
                    message: 'Please select a valid tag'
                },
                len: [3, 50]
            }

        }

    });
}