module.exports = (sequelize, DataTypes) => {
  const FacilitySync = sequelize.define(
    "FacilitySync",
    {},
    {
      timestamps: false,
      underscored: true,
    }
  );
  FacilitySync.associate = (models) => {
    FacilitySync.belongsTo(models.Facility, {
      foreignKey: {
        as: "FacilityId",
        name: "facilityId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    FacilitySync.belongsTo(models.Room, {
      foreignKey: {
        name: "roomId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };
  return FacilitySync;
};
