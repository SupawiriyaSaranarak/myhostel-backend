module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define(
    "Booking",
    {
      clientEmail: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      checkinDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      checkoutDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      price: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      paymentAmount: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      paymentMethod: {
        type: DataTypes.ENUM,
        values: ["CASH", "CREDIT", "TRANSFER"],
        allowNull: false,
      },
      paymentStatus: {
        type: DataTypes.ENUM,
        values: ["PAID", "PENDING"],
        defaultValue: "PENDING",
        allowNull: false,
      },
      paymentImg: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      discount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      bookingStatus: {
        type: DataTypes.ENUM,
        values: ["CONFIRM", "PENDING", "CANCEL"],
        defaultValue: "PENDING",
        allowNull: false,
      },
      verifyCode: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "SETAFTERBOOKINGCONFIRM",
      },
    },
    {
      underscored: true,
    }
  );
  Booking.associate = (models) => {
    Booking.hasMany(models.BookingItem, {
      foreignKey: {
        name: "bookingId",
        allowNull: false,
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });
    Booking.hasMany(models.CheckinGuess, {
      foreignKey: {
        name: "bookingId",
        allowNull: false,
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });
    Booking.hasMany(models.PreCheckinGuess, {
      foreignKey: {
        name: "bookingId",
        allowNull: false,
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });
    Booking.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });
  };
  return Booking;
};
