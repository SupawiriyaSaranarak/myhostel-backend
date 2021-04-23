const { Booking, PreCheckinGuess, sequelize } = require("../models");

const { PreCheckinGuess } = require("../models");

exports.getAllPreGuesses = async (req, res, next) => {
  try {
    const guesses = await PreCheckinGuess.findAll({
      order: [["createdAt", "desc"]],
    });
    res.status(200).json({ guesses });
  } catch (err) {
    next(err);
  }
};
exports.getPreGuessByBookingId = async (req, res, next) => {
  try {
    const { bookingId } = req.user;
    const guess = await findAll({
      where: { bookingId },
      order: [["createdAt", "desc"]],
    });
    res.status(200).json({ guesses });
  } catch (err) {
    next(err);
  }
};
exports.createPreGuess = async (req, res, next) => {
  try {
    const { bookingId } = req.user;
    const {
      prefix,
      firstName,
      lastName,
      govId,
      govIdType,
      birthDate,
      gender,
      email,
      phone,
      country,
      state,
      postcode,
      passportImg,
    } = req.body;

    const preGuess = await Booking.findOne({ where: { bookingId } });
    if (!preGuess) res.status(400).json({ message: "Guess not found" });
    if (Date.now().getTime() > new Date(Booking.checkoutDate).getTime())
      return res
        .status(400)
        .json({ message: "Deal is over, guess cannot be created." });
    const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const regexPhone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    const isEmail = regexEmail.test(String(email).toLowerCase());
    const isPhone = regexPhone.test(String(phone).toLowerCase());
    if (email && !isEmail)
      return res.status(400).json({ message: "This is not an email." });
    if (phone && !isPhone)
      return res.status(400).json({ message: "This is not a phone number." });
    if (prefix && prefix === "Mr" && gender !== "MALE")
      return res
        .status(400)
        .json({ message: "Gender and prefix are not matched." });
    if (prefix && (prefix === "Mrs" || prefix === "Ms") && gender !== "FEMALE")
      return res
        .status(400)
        .json({ message: "Gender and prefix are not matched." });
    if (birthDate)
      age = Math.floor((Date.now().getTime() - birthDate.getTime()) / 365.25);
    await PreCheckinGuess.create({
      prefix,
      firstName,
      lastName,
      govId,
      govIdType,
      birthDate,
      age,
      gender,
      email,
      phone,
      country,
      state,
      postcode,
      passportImg,
      bookingId,
    });
    res.status(201).json({ message: "Guess is created" });
  } catch (err) {
    next(err);
  }
};
exports.updatePreGuessById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { bookingId } = req.user;
    const {
      prefix,
      firstName,
      lastName,
      govId,
      govIdType,
      birthDate,
      gender,
      email,
      phone,
      country,
      state,
      postcode,
      passportImg,
    } = req.body;
    const guess = await PreCheckinGuess.findOne({ where: [id, bookingId] });
    if (!guess) return res.status(400).json({ message: "Guess not found" });
    if (bookingId !== guess.bookingId)
      return res
        .status(400)
        .json({ message: "You cannot update guess from different booking" });
    if (preGuess.checkInStatus === "REQUESTTOCHECKIN")
      return res.status(400).json({
        message:
          "Guess has already been request to check in and cannot be updated",
      });
    const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const regexPhone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    const isEmail = regexEmail.test(String(email).toLowerCase());
    const isPhone = regexPhone.test(String(phone).toLowerCase());
    if (email && !isEmail)
      return res.status(400).json({ message: "This is not an email." });
    if (phone && !isPhone)
      return res.status(400).json({ message: "This is not a phone number." });
    if (prefix && prefix === "Mr" && gender !== "MALE")
      return res
        .status(400)
        .json({ message: "Gender and prefix are not matched." });
    if (prefix && (prefix === "Mrs" || prefix === "Ms") && gender !== "FEMALE")
      return res
        .status(400)
        .json({ message: "Gender and prefix are not matched." });
    if (birthDate)
      const age = Math.floor(
        (Date.now().getTime() - birthDate.getTime()) / 365.25
      );

    guess.prefix = prefix ? prefix : guess.prefix;
    guess.firstName = firstName ? firstName : guess.firstName;
    guess.lastName = lastName ? lastName : guess.lastName;
    guess.govId = govId ? govId : guess.govId;
    guess.govIdType = govIdType ? govIdType : guess.govIdType;
    guess.birthDate = birthDate ? birthDate : guess.birthDate;
    guess.age = age ? age : guess.age;
    guess.gender = gender ? gender : guess.gender;
    guess.email = email ? email : guess.email;
    guess.phone = phone ? phone : guess.phone;
    guess.country = country ? country : guess.country;
    guess.state = state ? state : guess.state;
    guess.postcode = postcode ? postcode : guess.postcode;
    guess.passportImg = passportImg ? passportImg : guess.passportImg;

    if (
      (!guess.prefix ||
        !guess.firstName ||
        !guess.lastName ||
        !guess.govId ||
        !guess.govIdType ||
        !guess.birthDate ||
        !guess.age ||
        !guess.gender ||
        !guess.email ||
        !guess.phone ||
        !guess.country ||
        !guess.state ||
        !guess.postcode ||
        !guess.passportImg) &&
      guess.checkinStatus === "REQUESTTOCHECKIN"
    )
      return res.status(400).json({
        message: "Information is incomplete. Cannot send check in request",
      });
    await guess.save();
    res.status(200).json({
      message: `Guess with id ${id} is updated successfully`,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteGuessById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { bookingId } = req.user;
    const guess = await CheckinGuess.findOne({ where: [id, bookingId] });
    if (!guess) return res.status(400).json({ message: "User not found." });
    await guess.destroy();
    res.status(204).json({ message: "Guess has been deleted" });
  } catch (err) {
    next(err);
  }
};

exports.updatePreGuessByIdForAdmin = async (req, res, next) => {
  try {
    const { bookingId, id } = req.params;
    const guess = await PreCheckinGuess.findOne({ where: [id, bookingId] });
    if (guess.checkinStatus === "REQUESTTOCHECKIN") {
      guess.checkinStatus === "PENDING";
      guess.save();
      return res
        .status(200)
        .json({ message: "Checkin status has updated to PENDING" });
    }
    if (guess.checkinStatus === "PENDING") {
      guess.checkinStatus === "REQUESTTOCHECKIN";
      guess.save();
      return res
        .status(200)
        .json({ message: "Checkin status has updated to PENDING" });
    }
  } catch (err) {
    next(err);
  }
};
