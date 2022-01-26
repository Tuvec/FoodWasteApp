module.exports = (sequelize, DataTypes) => {
    return sequelize.define('aliment', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                notNull: {
                    message: 'Please write your product!'
                },
                len: [1, 30],
            }
        },
        category: {
            type: DataTypes.ENUM,
            allowNull: true,
            values: ['Vegetables', 'Fruits', 'Meat', 'Fish', 'Dairy']
        },
        expirationDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            validate: {
                isDate: true,
                notEmpty: true,
                notNull: {
                    message: 'Please write the product\'s expiration date!'
                },
            }
        },
        ingredients: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        weight: {
            type: DataTypes.FLOAT,
            allowNull: true,
            validate: {
                min: 0,
            }
        },
        status: {
            type: DataTypes.ENUM,
            allowNull: true,
            values: ['AVAILABLE', 'RESERVED'],
            defaultValue: 'AVAILABLE'
        }
    });
}