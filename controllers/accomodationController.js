const { Accomodation, Room, BookingItem } = require("../models");
exports.getAccomodationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const room = await Accomodation.findOne({
      where: { id },
      order: [["createdAt", "desc"]],
    });
    res.status(200).json({ room });
  } catch (err) {
    next(err);
  }
};

exports.getAllAccomodation = async (req, res, next) => {
  try {
    const accomodations = await Accomodation.findAll({
      // include: {
      //   model: FacilitySync,
      //   include: {
      //     model: Facility,
      //   },
      //   // attributes: [],
      // },
      attributes: ["id", "price", "status", "accomodationLocation", "roomId"],
    });
    res.status(200).json({ accomodations });
  } catch (err) {
    next(err);
  }
};

exports.createAccomodation = async (req, res, next) => {
  try {
    const { price, accomodationImg, roomId, accomodationLocation } = req.body;
    if (!+price)
      return res.status(400).json({ message: "Price must be a number." });
    if (!+roomId)
      return res.status(400).json({ message: "Room's ID must be a number." });
    const room = await Room.findOne({ where: { id: roomId } });
    if (!room) return res.status(400).json({ message: "Room not found." });
    const accomodation = await Accomodation.findAll({ where: { roomId } });
    if (room.type !== "single-reserved" && accomodation.length)
      return res
        .status(400)
        .json({ message: "Cannot add accomodation more into this room." });

    const result = accomodation.filter(
      (item) => item.accomodationLocation === accomodationLocation
    );
    if (result.length)
      return res
        .status(400)
        .json({ message: "Accomodation cannot be duplicated." });
    const addAccomodation = await Accomodation.create({
      price,
      accomodationImg,
      roomId,
      accomodationLocation,
    });
    res.status(201).json({ message: `Accomodation is created successfully.` });
  } catch (err) {
    next(err);
  }
};
exports.updateAccomodationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      price,
      accomodationImg,
      roomId,
      status,
      accomodationLocation,
    } = req.body;
    const accomodation = await Accomodation.findOne({ where: { id } });
    if (!accomodation)
      return res.status(400).json({ message: "Accomodation not found." });

    if (!+price)
      return res.status(400).json({ message: "Price must be a number." });
    if (!+roomId)
      return res.status(400).json({ message: "Room's ID must be a number." });
    const room = await Room.findOne({ where: { id: roomId } });
    if (!room) return res.status(400).json({ message: "Room not found." });
    if (room.type !== "single-reserved")
      return res
        .status(400)
        .json({ message: "Cannot add the accomodation into this room." });
    const accomodationCheck = await Accomodation.findAll({ where: { roomId } });
    const result = accomodationCheck.filter(
      (item) => item.accomodationLocation === accomodationLocation
    );
    if (result.length)
      return res
        .status(400)
        .json({ message: "Accomodation cannot be duplicated." });

    await Accomodation.update(
      { price, accomodationImg, roomId, status, accomodationLocation },
      { where: { id } }
    );
    res.status(200).json({
      message: `Accomodation with id: ${id} was updated successfully`,
    });
  } catch (err) {
    next(err);
  }
};
exports.deleteAccomodationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const accomodation = await Accomodation.findOne({ where: { id } });
    if (!accomodation)
      return res.status(400).json({ message: "Accomodation not found." });
    await accomodation.destroy();
    res.status(204).json({ message: "Accomodation has been deleted" });
  } catch (err) {
    next(err);
  }
};
exports.getValidAccomodationByInOutDate = async (req, res, next) => {
  try {
    const { checkinDate, checkoutDate } = req.query;
    console.log(checkinDate);
    console.log(checkoutDate);

    const checkindate = new Date(checkinDate);
    const checkinTime = checkindate.getTime();
    const checkoutdate = new Date(checkoutDate);
    const checkoutTime = checkoutdate.getTime();
    const dayRange = (checkoutTime - checkinTime) / 86400000;
    console.log(dayRange);
    const dayUse = dayRange - 1;
    console.log(dayUse);
    const dateArrayForCheckin = [checkindate];
    for (let i = 1; i <= dayUse; i++) {
      const x = new Date(
        dateArrayForCheckin[dateArrayForCheckin.length - 1].getTime() + 86400000
      );
      dateArrayForCheckin.push(x);
    }
    console.log(dateArrayForCheckin);

    const dateArrayForSearch = dateArrayForCheckin.map((item) =>
      item.toJSON().slice(0, 10)
    );
    console.log(dateArrayForSearch);

    const accomodations = await Accomodation.findAll({ attributes: ["id"] });
    console.log(JSON.parse(JSON.stringify(accomodations)));

    const accomodationArray = accomodations.map((item) => item.id);
    console.log(accomodationArray);
    let validAccomodationByDate = [];
    for (let date of dateArrayForSearch) {
      const bookingItems = await BookingItem.findAll({
        where: { dateUse: date },
      });
      // bookingItemUse = [...bookingItemUse, ...bookingItems];
      const accomodationUse = bookingItems.map((item) => item.accomodationId);
      console.log(accomodationUse);
      const validAccomodationId = arr_diff(accomodationUse, accomodationArray);
      const validAccomodationItems = await Accomodation.findAll({
        where: { id: validAccomodationId },
      });
      let validAccomodation = {};
      validAccomodation.date = date;
      validAccomodation.validAccomodationItems = validAccomodationItems;
      validAccomodationByDate.push(validAccomodation);
    }
    // console.log(JSON.parse(JSON.stringify(validBookingItem)));

    res.status(200).json({ validAccomodationByDate });

    // const accomodationUse = [
    //   ...new Set(bookingItemUse.map((item) => item.accomodationId)),
    // ];
    // console.log(accomodationUse);
    // console.log(accomodationUse.length);

    // const a = [1, 2, 3];
    // const b = [1, 4, 5];
    // const results = [];
    // for (let bItem of b) {
    //   if (!a.includes(bItem)) {
    //     results.push(bItem);
    //   }
    // }

    function arr_diff(a1, a2) {
      var a = [],
        diff = [];

      for (var i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
      }

      for (var i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
          delete a[a2[i]];
        } else {
          a[a2[i]] = true;
        }
      }

      for (var k in a) {
        diff.push(k);
      }

      return diff;
    }
    // const validAccomodation = arr_diff(accomodationUse, accomodationArray);

    // console.log(validAccomodation);
    // const room = await Accomodation.findOne({ where: { id } });
    // res.status(200).json({ room });
  } catch (err) {
    next(err);
  }
};
