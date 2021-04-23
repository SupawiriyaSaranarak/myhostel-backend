const {
  Room,
  Accomodation,
  Facility,
  FacilitySync,
  sequelize,
} = require("../models");
const { QueryTypes } = require("sequelize");
exports.getRoomById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let room = await Room.findOne({
      where: { id },
      include: [
        {
          model: Accomodation,
          attributes: ["id", "price", "accomodationLocation"],
        },
        {
          model: FacilitySync,
          attributes: ["id"],
          include: {
            model: Facility,
            attributes: ["name"],
          },
        },
      ],
    });
    // const modifiedRoom = JSON.parse(JSON.stringify(room));
    // console.log(modifiedRoom);
    const FacilitySyncs = room.FacilitySyncs.map((item) => item.Facility.name);

    const convertRoom = JSON.parse(JSON.stringify(room));
    const modifiedRoom = { ...convertRoom, FacilitySyncs };

    res.status(200).json({ room: modifiedRoom });
  } catch (err) {
    next(err);
  }
};

exports.getAllRooms = async (req, res, next) => {
  try {
    let room = await Room.findAll({
      include: [
        {
          model: Accomodation,
          attributes: ["id", "price", "accomodationLocation"],
        },
        {
          model: FacilitySync,
          attributes: ["id"],
          include: {
            model: Facility,
            attributes: ["name"],
          },
        },
      ],
    });

    const convertRooms = JSON.parse(JSON.stringify(room));
    const modifiedRoom = [];
    convertRooms.forEach((item) => {
      console.log("1111111");
      const x = item.FacilitySyncs.map((facility) => {
        return facility.Facility.name;
      });

      const newItem = { ...item, FacilitySyncs: x };
      console.log(newItem);
      modifiedRoom.push(newItem);
    });
    console.log(modifiedRoom);

    res.status(200).json({ room: modifiedRoom });

    // const result = await sequelize.query(
    //   "SELECT * FROM rooms r JOIN accomodations a ON r.id = a.room_id LEFT JOIN facility_syncs fs ON r.id = fs.room_id LEFT JOIN facilities f ON fs.facility_id = f.id ORDER BY a.id",
    //   { type: QueryTypes.SELECT }
    // );
    // res.status(200).json({ result });
  } catch (err) {
    next(err);
  }
};

exports.createRoom = async (req, res, next) => {
  try {
    const { volume, name, type, stair, location, roomImg } = req.body;
    if (!+volume)
      return res
        .status(400)
        .json({ message: "Room's volume must be a number." });
    if (!+stair)
      return res
        .status(400)
        .json({ message: "Room's stair must be a number." });
    if (!name || !name.trim())
      return res.status(400).json({ message: "Room's name is required." });
    if (!type || !type.trim())
      return res.status(400).json({ message: "Room's type is required." });
    if (!location || !location.trim())
      return res.status(400).json({ message: "Room's location is required." });
    const room = await Room.create({
      volume,
      name,
      type,
      stair,
      location,
      roomImg,
    });
    res.status(201).json({ message: `Room is created successfully.` });
  } catch (err) {
    next(err);
  }
};
exports.updateRoomById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { volume, name, type, stair, location, roomImg } = req.body;
    const room = await Room.findOne({ where: { id } });
    if (!room) return res.status(400).json({ message: "Room not found." });
    await Room.update(
      { volume, name, type, stair, location, roomImg },
      { where: { id } }
    );
    res.status(200).json({
      message: `Room with id: ${id} was updated successfully`,
    });
  } catch (err) {
    next(err);
  }
};
exports.deleteRoomById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const room = await Room.findOne({ where: { id } });
    if (!room) return res.status(400).json({ message: "Room not found." });
    await room.destroy();
    res.status(204).json({ message: "Room has been deleted" });
  } catch (err) {
    next(err);
  }
};
