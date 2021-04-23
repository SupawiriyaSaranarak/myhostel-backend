module.exports = (sequelize, DataTypes) => {
  const PreCheckinGuess = sequelize.define(
    "PreCheckinGuess",
    {
      prefix: {
        type: DataTypes.ENUM,
        values: ["Mr", "Mrs", "Ms", "OTHER"],
      },
      firstName: {
        type: DataTypes.STRING,
      },
      lastName: {
        type: DataTypes.STRING,
      },
      govId: {
        type: DataTypes.STRING,
      },
      govIdType: {
        type: DataTypes.ENUM,
        values: ["NATIONALID", "PASSPORT"],
      },
      birthDate: {
        type: DataTypes.DATEONLY,
      },
      age: {
        type: DataTypes.INTEGER,
      },
      gender: {
        type: DataTypes.ENUM,
        values: ["MALE", "FEMALE"],
      },
      phone: {
        type: DataTypes.STRING,
      },
      country: {
        type: DataTypes.STRING,
      },
      state: {
        type: DataTypes.STRING,
      },
      postcode: {
        type: DataTypes.STRING,
      },
      passportImg: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      checkinStatus: {
        type: DataTypes.ENUM,
        values: ["REQUESTTOCHECKIN", "PENDING"],

        defaultValue: "PENDING",
      },
    },
    {
      underscored: true,
    }
  );
  PreCheckinGuess.associate = (models) => {
    PreCheckinGuess.belongsTo(models.Booking, {
      foreignKey: {
        name: "bookingId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };
  return PreCheckinGuess;
};
