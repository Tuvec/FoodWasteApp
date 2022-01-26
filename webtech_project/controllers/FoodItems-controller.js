const { Aliment } = require('../sequelize-config');
const httpStatus = require('http-status');


module.exports = {
    getFoodItems: async(req, res) => {
        try {
            const aliments = await Aliment.findAll();
            res.status(httpStatus.OK).json(aliments);
        } catch (error) {
            console.warn(error);
        }
    },



    createFoodItems: async(req, res) => {
        try {
            if (req.body.name && req.body.expirationDate) {
                const newData = await Aliment.create(req.body);
                res.status(httpStatus.OK).json(newData);
            } else {
                res.status(httpStatus.BAD_REQUEST).json({ message: "Complete the name and expiration date fields" })
            }
        } catch (error) {
            console.warn(error);
        }
    },

    getFoodItem: async(req, res) => {
        try {
            const alimentId = req.params.aid;
            if (isNaN(alimentId)) {
                res.status(httpStatus.BAD_REQUEST).json({ message: 'Aliment id is not a number' });
            } else {
                const resultAliment = await Aliment.findByPk(alimentId);
                if (resultAliment) {
                    res.status(httpStatus.OK).json(resultAliment);
                } else {
                    res.status(httpStatus.BAD_REQUEST).json({ message: 'Sorry! The aliment was not found' });
                }
            }
        } catch (error) {
            console.warn(error);
        }
    },

    updateFoodItems: async(req, res) => {
        try {
            const alimentId = req.params.aid;
            if (isNaN(alimentId)) {
                res.status(httpStatus.BAD_REQUEST).json({ message: 'Aliment id is not a number' });
            } else {
                const foundAliment = await Aliment.findByPk(alimentId);
                if (foundAliment) {
                    if (req.body.name && req.body.expirationDate) {
                        foundAliment.name = req.body.name;
                        foundAliment.category = req.body.category;
                        foundAliment.expirationDate = req.body.expirationDate;
                        foundAliment.ingredients = req.body.ingredients;
                        foundAliment.weight = req.body.weight;
                        foundAliment.status = req.body.status;
                        await foundAliment.save();
                        res.status(httpStatus.OK).json(foundAliment);
                    } else {
                        res.status(httpStatus.BAD_REQUEST).json({ message: "Complete the name and expiration date fields" })
                    }
                } else {
                    res.status(httpStatus.BAD_REQUEST).json({ message: 'Sorry! The aliment was not found' });
                }
            }
        } catch (error) {
            console.warn(error);
        }
    },

    deleteFoodItems: async(req, res) => {
        try {
            const alimentId = req.params.aid;
            if (isNaN(alimentId)) {
                res.status(httpStatus.BAD_REQUEST).json({ message: 'Aliment id should be a number' });
            } else {
                const foundAliment = await Aliment.findByPk(alimentId);
                if (foundAliment) {
                    await foundAliment.destroy();
                    res.status(httpStatus.NO_CONTENT).json({ message: 'Sorry! There was no content found' });
                } else {
                    res.status(httpStatus.NOT_FOUND).json({ message: 'Sorry! The aliment was not found' });
                }
            }
        } catch (error) {
            console.warn(error);
        }
    }
}