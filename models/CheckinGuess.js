module.exports = (sequelize, DataTypes) => {
  const CheckinGuess = sequelize.define(
    "CheckinGuess",
    {
      prefix: {
        type: DataTypes.ENUM,
        values: ["Mr", "Mrs", "Ms", "OTHER"],
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      govId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      govIdType: {
        type: DataTypes.ENUM,
        values: ["NATIONALID", "PASSPORT"],
        allowNull: false,
      },
      birthDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      gender: {
        type: DataTypes.ENUM,
        values: ["MALE", "FEMALE"],
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      postcode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      passportImg: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      checkInStatus: {
        type: DataTypes.ENUM,
        values: ["CHEKEDIN", "PENDING"],
        allowNull: false,
        defaultValue: "PENDING",
      },
    },
    {
      underscored: true,
    }
  );
  CheckinGuess.associate = (models) => {
    CheckinGuess.belongsTo(models.Booking, {
      foreignKey: {
        name: "bookingId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };
  return CheckinGuess;
};
