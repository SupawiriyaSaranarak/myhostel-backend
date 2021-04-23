const { BookingItem } = require("../models");
exports.getBookingItemId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const bookingItem = await BookingItem.findOne({
      where: { id },
      order: [["createdAt", "desc"]],
    });
    res.status(200).json({ bookingItem });
  } catch (err) {
    next(err);
  }
};

exports.getAllBookingItems = async (req, res, next) => {
  try {
    const bookingItems = await BookingItem.findAll({
      // include: {
      //   model: FacilitySync,
      //   include: {
      //     model: Facility,
      //   },
      //   // attributes: [],
      // },
      order: [["createdAt", "desc"]],
    });
    res.status(200).json({ bookingItems });
  } catch (err) {
    next(err);
  }
};

exports.updateBookingItemById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { dateUse, bookingId, accomodationId } = req.body;
    const bookingItem = await BookingItem.findOne({ where: { id } });
    if (!bookingItem)
      return res.status(400).json({ message: "Booking item  not found." });
    await BookingItem.update(
      { dateUse, bookingId, accomodationId },
      { where: { id } }
    );
    res.status(200).json({
      message: `Booking item with id: ${id} was updated successfully`,
    });
  } catch (err) {
    next(err);
  }
};
exports.deleteBookingItemById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const bookingItem = await BookingItem.findOne({ where: { id } });
    if (!bookingItem)
      return res.status(400).json({ message: "Booking item not found." });
    await bookingItem.destroy();
    res.status(204).json({ message: "Booking item has been deleted" });
  } catch (err) {
    next(err);
  }
};
