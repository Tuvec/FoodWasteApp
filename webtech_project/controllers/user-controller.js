const { User, Aliment, Reservation, Friend } = require("../sequelize-config");
const Sequelize = require('sequelize');
const { OK, CONFLICT, CREATED, BAD_REQUEST, NOT_FOUND, NO_CONTENT } = require("http-status");
const Op = Sequelize.Op;


module.exports = {


    getUsers: async(req, res) => {
        try {
            const users = await User.findAll();
            res.status(OK).json(users);
        } catch (error) {
            console.warn(error);
        }
    },

    createUser: async(req, res) => {
        try {
            if (req.body.userName && req.body.password && req.body.email) {
                const existingUser = await User.findOne({
                    where: {
                        [Op.or]: [
                            { userName: req.body.userName },
                            { email: req.body.email }
                        ]
                    }
                });
                if (existingUser) {
                    res.status(CONFLICT).json({ message: 'The user account already exist' });
                } else {
                    const newUser = await User.create(req.body);
                    res.status(CREATED).json(newUser);
                }
            } else {
                res.status(BAD_REQUEST).json({ message: "The username, password and email fields are mandatory" });

            }
        } catch (error) {
            console.warn(error);
        }
    },

    getUser: async(req, res) => {
        try {
            const userId = parseInt(req.params.id);
            if (isNaN(userId)) {
                res.status(BAD_REQUEST).json({ message: 'User id is not a number' });
            } else {
                const foundUser = await User.findByPk(userId, {
                    include: [Reservation, Aliment, Friend]
                });
                if (foundUser) {
                    res.status(OK).json(foundUser);
                } else {
                    res.status(NOT_FOUND).json({ message: 'The user doesn\'t exist' });
                }
            }
        } catch (error) {
            console.warn(error);
        }
    },

    updateUser: async(req, res) => {
        try {
            const userId = parseInt(req.params.id);
            if (isNaN(userId)) {
                res.status(BAD_REQUEST).json({ message: 'User ID is not a number' });
            } else {
                const foundUser = await User.findByPk(userId);
                if (foundUser) {
                    if (req.body.userName && req.body.email) {
                        const anotherSameUser = await User.findOne({
                            where: {
                                [Op.or]: [
                                    { userName: req.body.userName },
                                    { email: req.body.email }
                                ]
                            }
                        });
                        if (anotherSameUser && (anotherSameUser.id !== foundUser.id)) {
                            res.status(CONFLICT).json({ message: "This user account already exists" });
                        } else {
                            foundUser.userName = req.body.userName;
                            foundUser.name = req.body.name;
                            foundUser.email = req.body.email;
                            await foundUser.save();
                            res.status(OK).json(foundUser);
                        }
                    } else {
                        res.status(BAD_REQUEST).json({ message: "The username, password and email fields are mandatory" });
                    }
                } else {
                    res.status(NOT_FOUND).json({ message: 'The user doesn\'t exist' });
                }
            }
        } catch (error) {
            console.warn(error);
        }

    },

    deleteUser: async(req, res) => {
        try {
            const userId = parseInt(req.params.id);
            if (isNaN(userId)) {
                res.status(BAD_REQUEST).json({ message: 'User id is not a number' });
            } else {
                const foundUser = await User.findByPk(userId);
                if (foundUser) {
                    await foundUser.destroy();
                    res.status(NO_CONTENT).json({ message: 'Inexistent content' });
                } else {
                    res.status(NOT_FOUND).json({ message: 'The user doesn\'t exist' });
                }
            }
        } catch (error) {
            console.warn(error);
        }
    }

}