const { User, sequelize } = require("../models");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

exports.protectCheckin = async (req, res, next) => {
  try {
    let token = null;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    )
      token = req.headers.authorization.split(" ")[1];

    if (!token)
      return res.status(400).json({ message: `You are unauthorized.` });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const booking = await User.findOne({ where: { id: payload.bookingId } });
    console.log(booking);
    if (!booking)
      return res.status(400).json({ message: `Booking not found.` });
    req.user = { bookingId: booking.id };
    next();
  } catch (err) {
    next(err);
  }
};

exports.protectAdmin = async (req, res, next) => {
  try {
    let token = null;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    )
      token = req.headers.authorization.split(" ")[1];

    if (!token)
      return res.status(400).json({ message: `You are unauthorized.` });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ where: { id: payload.id } });
    console.log(user);
    if (!user) return res.status(400).json({ message: `User not found.` });
    if (user.userStatus !== "ADMIN" && user.userStatus !== "SUPERADMIN")
      return res.status(400).json({ message: `You are unauthorized.` });
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

//

// exports.protectSuperadmin = async (req, res, next) => {
//   try {
//     let token = null;

//     if (
//       req.headers.authorization &&
//       req.headers.authorization.startsWith("Bearer")
//     )
//       token = req.headers.authorization.split(" ")[1];

//     if (!token)
//       return res.status(400).json({ message: `You are unauthorized.` });
//     const payload = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findOne({ where: { id: payload.id } });

//     if (!user) return res.status(400).json({ message: `User not found.` });
//     if (user.userStatus !== "SUPERADMIN")
//       return res.status(400).json({ message: `You are unauthorized.` });
//     req.user = user;
//     next();
//   } catch (err) {
//     next(err);
//   }
// };
exports.register = async (req, res, next) => {
  console.log(req.body);
  try {
    const { email, password, confirmPassword, firstName, lastName, phone } =
      req.body;
    if (password !== confirmPassword)
      return res.status(400).json({ message: "Password is not match" });
    const regexEmail =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const regexPassword = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;
    const regexPhone =
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    const isEmail = regexEmail.test(String(email).toLowerCase());
    const isPassword = regexPassword.test(String(password));
    console.log(isPassword);
    const isPhone = regexPhone.test(String(phone).toLowerCase());
    if (!isEmail)
      return res.status(400).json({ message: "This is not an email." });
    if (!isPassword)
      return res.status(400).json({
        message:
          "Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter.",
      });
    if (!firstName || !firstName.trim())
      return res.status(400).json({ message: "First name is required." });
    if (!lastName || !lastName.trim())
      return res.status(400).json({ message: "Last name is required." });
    if (!isPhone)
      return res.status(400).json({ message: "This is not a phone number." });
    const hashedPassword = await bcrypt.hash(
      password,
      +process.env.BCRYPT_SALT
    );
    const prevUser = await User.findAll({ where: { email } });
    if (prevUser.length)
      return res
        .status(400)
        .json({ message: "This email has been registered." });
    const prevUser1 = await User.findAll({ where: { firstName, lastName } });
    if (prevUser1.length)
      return res
        .status(400)
        .json({ message: "This name has been registered." });

    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
    });

    const payload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      userStatus: user.userStatus,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: +process.env.JWT_EXPIRES_IN,
    });

    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res
        .status(400)
        .json({ message: `Username or Password is incorrect.` });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ message: `Username or Password is incorrect.` });
    console.log(user);
    const payload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      userStatus: user.userStatus,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: +process.env.JWT_EXPIRES_IN,
    });
    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};
exports.getAllUser = async (req, res, next) => {
  try {
    const users = await User.findAll({ order: [["createdAt", "desc"]] });
    res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
};
exports.getUsersByKeywords = async (req, res, next) => {
  try {
    const { email, firstName, lastName, phone } = req.query;
    console.log(`%${email}%`);
    const users = await User.findAll({
      where: {
        [Op.or]: [
          {
            email: {
              [Op.like]: `%${email}%`,
            },
          },
          {
            firstName: {
              [Op.like]: `%${firstName}%`,
            },
          },
          {
            lastName: {
              [Op.like]: `%${lastName}%`,
            },
          },
          {
            phone: {
              [Op.like]: `%${phone}%`,
            },
          },
        ],
      },
      order: [["createdAt", "desc"]],
      attributes: [
        "id",
        "email",
        "firstName",
        "lastName",
        "phone",
        "userStatus",
        "description",
        "createdAt",
      ],
    });
    res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
};
exports.getMe = (req, res, next) => {
  try {
    const {
      id,
      email,
      firstName,
      lastName,
      phone,
      userStatus,
      description,
      createdAt,
    } = req.user;
    res.status(200).json({
      id,
      email,
      firstName,
      lastName,
      phone,
      userStatus,
      description,
      createdAt,
    });
  } catch (err) {
    next(err);
  }
};
exports.updateStatusUserByIdForAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userStatus } = req.body;
    const user = await User.findOne({ where: { id } });
    if (!user) return res.status(400).json({ message: "User not found." });
    await User.update({ userStatus }, { where: { id } });
    res.status(200).json({
      message: `Update status of this user to ${userStatus} successfully`,
    });
  } catch (err) {
    next(err);
  }
};
exports.updateUserByIdForUser = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { email, firstName, lastName, phone } = req.body;
    const user = await User.findOne({ where: { id } });

    if (!user) return res.status(400).json({ message: "User not found." });
    await User.update({ email, firstName, lastName, phone }, { where: { id } });
    const newUser = await User.findOne({ where: { id } });
    const payload = {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      userStatus: newUser.userStatus,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: +process.env.JWT_EXPIRES_IN,
    });
    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};
exports.editPassword = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { newPassword, confirmNewPassword } = req.body;
    if (newPassword !== confirmNewPassword)
      return res.status(400).json({ message: "Password is not match" });

    const regexPassword = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;
    const isPassword = regexPassword.test(String(newPassword));
    if (!isPassword)
      return res.status(400).json({
        message:
          "Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter.",
      });
    console.log(newPassword);
    const hashedPassword = await bcrypt.hash(
      newPassword,
      +process.env.BCRYPT_SALT
    );
    console.log(hashedPassword);
    const user = await User.findOne({ where: { id } });
    if (!user) return res.status(400).json({ message: "User not found." });
    await User.update({ password: hashedPassword }, { where: { id } });
    res.status(200).json({ message: `Password is updated.` });
  } catch (err) {
    next(err);
  }
};
exports.deleteUserByAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ where: { id } });
    if (!user) return res.status(400).json({ message: "User not found." });
    if (user.userStatus === "SUPERADMIN" || user.userStatus === "ADMIN")
      return res.status(400).json({ message: "Cannot delete admin." });
    await user.destroy();
    res.status(204).json({ message: "User has been deleted" });
  } catch (err) {
    next(err);
  }
};
exports.checkinForGuess = async (req, res, next) => {
  try {
    const { bookingId, verifyCode } = req.body;
    const booking = await Booking.findOne({ where: { id: bookingId } });
    if (!booking)
      return res
        .status(400)
        .json({ message: `Booking or verify code is incorrect.` });
    const isMatch = await bcrypt.compare(verifyCode, booking.verifyCode);
    if (!isMatch)
      return res
        .status(400)
        .json({ message: `Booking or verify code is incorrect.` });
    console.log(booking);
    const payload = {
      bookingId,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: +process.env.JWT_EXPIRES_IN_FOR_CHECKIN,
    });
    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};
