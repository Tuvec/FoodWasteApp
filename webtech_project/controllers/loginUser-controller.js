const httpStatus = require('http-status');
const { User } = require('../sequelize-config');


module.exports = {

    loginUser: async(req, res) => {
        try {
            const username = req.body.userName;
            const pass = req.body.password;
            if (username) {
                if (pass) {
                    const userlogged = await User.findOne({
                        where: {
                            userName: username,
                            password: pass
                        },
                    });

                    if (userlogged) {
                        res.status(httpStatus.OK).json(userlogged);
                    } else {
                        res.status(httpStatus.NOT_FOUND).json({ message: "The user was not found" });
                    }
                } else {
                    res.status(httpStatus.BAD_REQUEST).json({ message: "The password field must be completed" });
                }
            } else {
                res.status(httpStatus.BAD_REQUEST).json({ message: "The username field is mandatory" });
            }
        } catch (error) {
            console.log(error)
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "server error" });
        }
    }
}