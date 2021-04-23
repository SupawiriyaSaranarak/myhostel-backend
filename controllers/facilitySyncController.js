const { Facility, FacilitySync, Room } = require("../models");
exports.getFacilitySyncById = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const facilitySync = await FacilitySync.findOne({
      where: { roomId },
      order: [["createdAt", "desc"]],
    });
    res.status(200).json({ facilitySync });
  } catch (err) {
    next(err);
  }
};

// exports.getAllFacilitySync = async (req, res, next) => {
//   try {
//     const facilitySyncs = await FacilitySync.findAll({

//     });
//     res.status(200).json({ facilitySyncs });
//   } catch (err) {
//     next(err);
//   }
// };

exports.createFacilitySync = async (req, res, next) => {
  try {
    const { roomId, facilityId } = req.body;
    if (!+roomId)
      return res.status(400).json({ message: "Room ID must be a number." });
    if (!+facilityId)
      return res
        .status(400)
        .json({ message: "Facility's ID must be a number." });
    const rooms = await Room.findOne({ where: { id: roomId } });
    const facility = await Facility.findOne({ where: { id: facilityId } });
    console.log(rooms);
    if (!rooms) return res.status(400).json({ message: "Room not found." });
    if (!facility)
      return res.status(400).json({ message: "Facility not found." });

    const faciltySync = await FacilitySync.findAll({ where: { roomId } });
    const result = faciltySync.filter((item) => item.facilityId == facilityId);
    if (result.length)
      return res
        .status(400)
        .json({ message: "Assignment cannot be duplicated." });
    const addFacilitySync = await FacilitySync.create({ roomId, facilityId });
    res.status(201).json({ message: `Assignment is created successfully.` });
  } catch (err) {
    next(err);
  }
};
exports.updateFacilitySyncById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { roomId, facilityId } = req.body;
    if (!+roomId)
      return res.status(400).json({ message: "Room ID must be a number." });
    if (!+facilityId)
      return res
        .status(400)
        .json({ message: "Facility's ID must be a number." });
    const rooms = await Room.findOne({ where: { id: roomId } });
    const facility = await Facility.findOne({ where: { id: facilityId } });
    console.log(rooms);
    if (!rooms) return res.status(400).json({ message: "Room not found." });
    if (!facility)
      return res.status(400).json({ message: "Facility not found." });

    const faciltySync = await FacilitySync.findAll({ where: { roomId } });
    const result = faciltySync.filter((item) => item.facilityId == facilityId);
    if (result.length)
      return res
        .status(400)
        .json({ message: "Assignment cannot be duplicated." });

    await FacilitySync.update({ roomId, facilityId }, { where: { id } });
    res.status(200).json({
      message: `Assignment with id: ${id} was updated successfully`,
    });
  } catch (err) {
    next(err);
  }
};
exports.deleteFacilitySyncById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const facilitySync = await FacilitySync.findOne({ where: { id } });
    if (!facilitySync)
      return res.status(400).json({ message: "Assignment not found." });
    await facilitySync.destroy();
    res.status(204).json({ message: "Assignment has been deleted" });
  } catch (err) {
    next(err);
  }
};
