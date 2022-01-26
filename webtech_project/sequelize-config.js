const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    dialect: "mysql",
    define: {
      timestamps: false,
    },
  }
);

const User = require("./models/user-model")(sequelize, Sequelize);
const Aliment = require("./models/aliment-model")(sequelize, Sequelize);
const Reservation = require("./models/reservation-model")(sequelize, Sequelize);
const Friend = require("./models/friend-model")(sequelize, Sequelize);

User.hasMany(Aliment);
Aliment.belongsTo(User);

User.hasMany(Reservation);
Reservation.belongsTo(User);

User.hasMany(Friend);
Friend.belongsTo(User);

Reservation.hasMany(Aliment);
Aliment.belongsTo(Reservation);

module.exports = {
  User,
  Aliment,
  Reservation,
  Friend,
};
