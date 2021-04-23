module.exports = (sequelize, DataTypes) => {
  const BookingItem = sequelize.define(
    "BookingItem",
    {
      dateUse: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    {
      underscored: true,
    }
  );
  BookingItem.associate = (models) => {
    BookingItem.belongsTo(models.Accomodation, {
      foreignKey: {
        name: "accomodationId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    BookingItem.belongsTo(models.Booking, {
      foreignKey: {
        name: "bookingId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };

  return BookingItem;
};
