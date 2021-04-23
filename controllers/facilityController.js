const { Facility } = require("../models");
exports.getFacilityById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const facility = await Facility.findOne({
      where: { id },
      order: [["createdAt", "desc"]],
    });
    res.status(200).json({ facility });
  } catch (err) {
    next(err);
  }
};

exports.getAllFacilities = async (req, res, next) => {
  try {
    const facilities = await Facility.findAll({
      // include: {
      //   model: FacilitySync,
      //   include: {
      //     model: Facility,
      //   },
      //   // attributes: [],
      // },
    });
    res.status(200).json({ facilities });
  } catch (err) {
    next(err);
  }
};

exports.createFacility = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim())
      return res.status(400).json({ message: "Facility's name is require." });

    await Facility.create({
      name,
    });
    res.status(201).json({ message: `Facility is created successfully.` });
  } catch (err) {
    next(err);
  }
};
exports.updateFacilityById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const facility = await Facility.findOne({ where: { id } });
    if (!facility)
      return res.status(400).json({ message: "Facility not found." });
    await Facility.update({ name }, { where: { id } });
    res.status(200).json({
      message: `Accomodation with id: ${id} was updated successfully`,
    });
  } catch (err) {
    next(err);
  }
};
exports.deleteFacilityById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const facility = await Facility.findOne({ where: { id } });
    if (!facility)
      return res.status(400).json({ message: "Facility not found." });
    await facility.destroy();
    res.status(204).json({ message: "Facility has been deleted" });
  } catch (err) {
    next(err);
  }
};
