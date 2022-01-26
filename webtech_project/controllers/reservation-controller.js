const httpStatus = require("http-status");
const { User, Reservation, Aliment } = require("../sequelize-config");


module.exports = {


    getReservations: async(req, res) => {
        try {
            const userId = parseInt(req.params.uid);
            if (isNaN(userId)) {
                res.status(httpStatus.BAD_REQUEST).json({ message: 'User id is not a number' });
            } else {
                const user = await User.findByPk(userId);
                if (user) {
                    const reservations = await user.getReservations({
                        include: [Aliment]
                    });
                    res.status(httpStatus.OK).json(reservations);
                } else {
                    res.status(httpStatus.NOT_FOUND).json({ message: 'The user was not found' });
                }
            }
        } catch (error) {
            console.warn(error);
        }
    },

    getReservation: async(req, res) => {
        try {
            const userId = parseInt(req.params.uid);
            if (isNaN(userId)) {
                res.status(httpStatus.BAD_REQUEST).json({ message: 'User id is not a number' });
            } else {
                const user = await User.findByPk(userId);
                if (user) {
                    const reservations = await user.getReservations({ where: { id: req.params.rid } });
                    const reservation = reservations.shift();
                    if (reservation) {
                        res.status(httpStatus.OK).json(reservation);
                    } else {
                        res.status(httpStatus.BAD_REQUEST).json({ message: 'The reservation doesn\'t exist' });
                    }
                } else {
                    res.status(httpStatus.BAD_REQUEST).json({ message: 'The user doesn\'t exist' });
                }
            }
        } catch (error) {
            console.warn(error);
        }
    },

    createReservation: async(req, res) => {
        try {
            const userId = req.params.uid;
            if (isNaN(userId)) {
                res.status(httpStatus.BAD_REQUEST).json({ message: 'User id is not a number' });
            } else {
                const user = await User.findByPk(userId);
                if (user) {
                    const { FoodItemsIds } = req.body;
                    if (FoodItemsIds) {
                        const newReservation = await Reservation.create(req.body);
                        newReservation.userId = user.id;

                        for (let i = 0; i < FoodItemsIds.length; i++) {
                            const foundAliment = await Aliment.findByPk(FoodItemsIds[i]);
                            newReservation.addAliment(foundAliment);
                        }
                        await newReservation.save();
                        res.status(httpStatus.CREATED).json(newReservation);
                    } else {
                        res.status(httpStatus.BAD_REQUEST).json({ message: 'At least one aliment have to be selected for reservation' });
                    }
                } else {
                    res.status(httpStatus.NOT_FOUND).json({ message: 'The user doesn\'t exist' });
                }
            }
        } catch (error) {
            console.warn(error);
        }
    },

    deleteReservation: async(req, res) => {
        try {
            const userId = parseInt(req.params.uid);
            if (isNaN(userId)) {
                res.status(httpStatus.BAD_REQUEST).json({ message: 'User id is not a number' });
            } else {
                const user = await User.findByPk(userId);
                if (user) {
                    const reservations = await user.getReservations({ where: { id: req.params.rid } });
                    const reservation = reservations.shift();
                    if (reservation) {
                        const FoodItems = await Aliment.findAll({
                            where: {
                                reservationId: reservation.id
                            }
                        });
                        let newFoodItems = FoodItems;
                        for (let aliment of newFoodItems) {
                            aliment.status = 'AVAILABLE';
                            await aliment.save();
                        }
                        await reservation.destroy();
                        res.status(httpStatus.NO_CONTENT).json('Inexistent content');
                    } else {
                        res.status(httpStatus.NOT_FOUND).json({ message: 'The reservation doesn\'t exist' });
                    }
                } else {
                    res.status(httpStatus.NOT_FOUND).json({ message: 'The user doesn\'t exist' });
                }
            }
        } catch (error) {
            console.warn(error);
        }
    }
}