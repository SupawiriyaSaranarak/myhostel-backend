const { CheckinGuess } = require("../models");

exports.getAllGuesses = async (req, res, next) => {
  try {
    const guesses = await CheckinGuess.findAll({
      order: [["createdAt", "desc"]],
    });
    res.status(200).json({ guesses });
  } catch (err) {
    next(err);
  }
};
exports.getGuessByKeyword = async (req, res, next) => {
  try {
    const {
      email,
      firstName,
      lastName,
      phone,
      govId,
      govIdType,
      createdAt,
      gender,
      age,
      country,
      bookingId,
      checkInStatus,
    } = req.query;
    const guesses = await CheckinGuess.findAll({
      where: {
        email: {
          [Op.like]: `%${email}%`,
        },
        firstName: {
          [Op.like]: `%${firstName}%`,
        },
        lastName: {
          [Op.like]: `%${lastName}%`,
        },
        phone: {
          [Op.like]: `%${phone}%`,
        },
        createdAt: {
          [Op.like]: `%${createdAt}%`,
        },
        govId,
        govIdType,
        gender,
        age,
        country,
        bookingId,
        checkInStatus,
      },
      order: [["createdAt", "desc"]],
      attributes: [
        "id",
        "prefix",
        "firstName",
        "lastName",
        "govId",
        "govIdType",
        "birthDate",
        "age",
        "gender",
        "email",
        "phone",
        "country",
        "state",
        "passportImg",
        "bookingId",
        "createdAt",
        "updatedAt",
        "checkInStatus",
      ],
    });
    res.status(200).json({ guesses });
  } catch (err) {
    next(err);
  }
};
exports.createGuess = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { bookingId } = req.body;
    const preCheckinGuesses = await PreCheckinGuess.findAll({
      where: { bookingId },
    });
    if (!preCheckinGuesses)
      return res.status(400).json({ message: "Guess not found." });
    if (preCheckinGuesses.checkinStatus === "PENDING")
      return res
        .status(400)
        .json({ message: "Guess does not confirm to checkin." });
    preCheckinGuesses.checkinStatus === "CHECKEDIN";
    const checkinGuesses = await CheckinGuess.bulkCreate(preCheckinGuesses, {
      transaction,
    });
    preCheckinGuesses.destroy({ transaction });
    await transaction.commit();
    res.status(201).json({ message: "Checkin complete" });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};
exports.updateGuessByBookingId = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { bookingId } = req.body;
    const checkinGuesses = await CheckinGuess.findAll({
      where: { bookingId },
    });
    if (!checkinGuesses)
      return res.status(400).json({ message: "Guess not found." });
    checkinGuesses.checkinStatus === "PENDING";
    const preCheckinGuesses = await PreCheckinGuess.bulkCreate(checkinGuesses, {
      transaction,
    });
    checkinGuesses.save({ transaction });
    await transaction.commit();
    res.status(201).json({ message: "Checkin status is changed to PENDING " });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

exports.deleteGuessById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const guess = await CheckinGuess.findOne({ where: { id } });
    if (!guess) return res.status(400).json({ message: "Guess not found." });
    await guess.destroy();
    res.status(204).json({ message: "Guess has been deleted" });
  } catch (err) {
    next(err);
  }
};
