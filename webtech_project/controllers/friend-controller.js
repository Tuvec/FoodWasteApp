const httpStatus = require("http-status");
const { User, Friend } = require("../sequelize-config");

module.exports = {
  getAllFriends: async (req, res) => {
    try {
      const Id = parseInt(req.params.uid);
      if (isNaN(Id)) {
        req
          .status(httpStatus.BAD_REQUEST)
          .json({ message: "User id is not a number" });
      } else {
        const user = await User.findByPk(Id);
        if (user) {
          const friends = await user.getFriends();
          res.status(httpStatus.OK).json(friends);
        } else {
          res
            .status(httpStatus.NOT_FOUND)
            .json({ message: "The user doesn't exist" });
        }
      }
    } catch (error) {
      console.warn(error);
    }
  },

  addFriend: async (req, res) => {
    try {
      const Id = parseInt(req.params.uid);
      if (isNaN(Id)) {
        res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: "User id is not a number" });
      } else {
        const user = await User.findByPk(Id);
        if (user) {
          const friend = await Friend.create(req.body);
          friend.Id = Id;
          await friend.save();
          res.status(httpStatus.CREATED).json(friend);
        } else {
          res
            .status(httpStatus.NOT_FOUND)
            .json({ message: "The user doesn't exist" });
        }
      }
    } catch (error) {
      console.warn(error);
    }
  },

  getFriendFoodItems: async (req, res) => {
    try {
      const Id = parseInt(req.params.uid);
      const usernameFriend = req.params.usernameFriend;
      if (isNaN(Id)) {
        res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: "User id is not a number" });
      } else {
        const user = await User.findByPk(Id);
        if (user) {
          const friends = await user.getFriends();
          friend = friends.shift();
          if (friend) {
            const userFriend = await User.findOne({
              where: { userName: usernameFriend },
            });
            if (userFriend) {
              const FoodItems = await userFriend.getFoodItems();
              res.status(httpStatus.OK).json(FoodItems);
            } else {
              res
                .status(httpStatus.BAD_REQUEST)
                .json({ message: "userFriend was not found" });
            }
          } else {
            res
              .status(httpStatus.BAD_REQUEST)
              .json({ message: "The friend doesn't exist" });
          }
        } else {
          res
            .status(httpStatus.NOT_FOUND)
            .json({ message: "The user does not exist" });
        }
      }
    } catch (error) {
      console.warn(error);
    }
  },
};
