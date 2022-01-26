const { BAD_REQUEST, OK, NOT_FOUND, CREATED, NO_CONTENT } = require('http-status');
const { User, Aliment } = require('../sequelize-config');


module.exports = {


    getUserFoodItems: async(req, res) => {
        try {
            const userId = parseInt(req.params.uid);
            if (isNaN(userId)) {
                res.status(BAD_REQUEST).json({ message: 'User id is not a number' });
            } else {
                const user = await User.findByPk(userId);
                if (user) {
                    const aliments = await user.getAliments();
                    res.status(OK).json(aliments);
                } else {
                    res.status(NOT_FOUND).json({ message: 'The user doesn\'t exist' });
                }
            }
        } catch (error) {
            console.warn(error);
        }
    },

    createUserFoodItems: async(req, res) => {
        try {
            const userId = parseInt(req.params.uid);
            if (isNaN(userId)) {
                res.status(BAD_REQUEST).json({ message: 'User id is not a number' });
            } else {
                const user = await User.findByPk(userId);
                if (user) {
                    const aliment = await Aliment.create(req.body);
                    aliment.userId = user.id;
                    await aliment.save();
                    res.status(CREATED).json(aliment);
                } else {
                    res.status(NOT_FOUND).json({ message: 'The user doesn\'t exist' });
                }
            }
        } catch (error) {
            console.warn(error);
        }
    },

    getUserFoodItem: async(req, res) => {
        try {
            const userId = parseInt(req.params.uid);
            if (isNaN(userId)) {
                res.status(BAD_REQUEST).json({ message: 'User id is not a number' });
            } else {
                const user = await User.findByPk(userId);
                if (user) {
                    const aliments = await user.getAliments({ where: { id: req.params.aid } });
                    const aliment = aliments.shift();
                    if (aliment) {
                        res.status(OK).json(aliment);
                    } else {
                        res.status(NOT_FOUND).json({ message: 'The aliment doesn\'t exist' });
                    }
                } else {
                    res.status(NOT_FOUND).json({ message: 'The user doesn\'t exist' });
                }
            }
        } catch (error) {
            console.warn(error);
        }
    },

    updateUserFoodItems: async(req, res) => {
        try {
            const userId = parseInt(req.params.uid);
            if (isNaN(userId)) {
                res.status(BAD_REQUEST).json({ message: 'User is not a number' });
            } else {
                const user = await User.findByPk(userId);
                if (user) {
                    const aliment = await Aliment.findByPk(req.params.aid);
                    if (aliment) {
                        aliment.id = req.body.id;
                        aliment.name = req.body.name;
                        aliment.category = req.body.category;
                        aliment.expirationDate = req.body.expirationDate;
                        aliment.ingredients = req.body.ingredients;
                        aliment.weight = req.body.weight;
                        aliment.status = req.body.status;
                        aliment.reservationId = req.body.reservationId;
                        await aliment.save();
                        res.status(OK).json(aliment);
                    } else {
                        res.status(NOT_FOUND).json({ message: 'The aliment doesn\'t exist' });
                    }
                } else {
                    res.status(NOT_FOUND).json({ message: 'The user doesn\'t exist' });
                }
            }
        } catch (error) {
            console.warn(error);
        }
    },

    deleteUserFoodItems: async(req, res) => {
        try {
            const userId = parseInt(req.params.uid);
            if (isNaN(userId)) {
                res.status(BAD_REQUEST).json({ message: 'User id is not a number' });
            } else {
                const user = await User.findByPk(userId);
                if (user) {
                    const aliments = await user.getAliments({ where: { id: req.params.aid } });
                    const aliment = aliments.shift();
                    console.log("aliment", aliment)
                    if (aliment) {
                        await aliment.destroy();
                        res.status(NO_CONTENT).json({ message: 'Inexistent content' });
                    } else {
                        res.status(NOT_FOUND).json({ message: 'The aliment doesn\'t exist' });
                    }
                } else {
                    res.status(NOT_FOUND).json({ message: 'The user doesn\'t exist' });
                }
            }
        } catch (error) {
            console.warn(error);
        }
    }
}