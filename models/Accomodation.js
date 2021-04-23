module.exports = (sequelize, DataTypes) => {
  const Accomodation = sequelize.define(
    "Accomodation",
    {
      price: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM,
        values: ["ACTIVE", "INACTIVE"],
        defaultValue: "ACTIVE",
        allowNull: false,
      },
      accomodationImg: DataTypes.STRING,
      accomodationLocation: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      underscored: true,
    }
  );
  Accomodation.associate = (models) => {
    Accomodation.hasMany(models.BookingItem, {
      foreignKey: {
        name: "accomodationId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    Accomodation.belongsTo(models.Room, {
      foreignKey: {
        name: "roomId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };
  return Accomodation;
};
