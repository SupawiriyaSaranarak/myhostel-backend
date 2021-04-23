const { Booking, BookingItem, Accomodation, sequelize } = require("../models");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

exports.getAllBooking = async (req, res, next) => {
  try {
    // if (req.user.userStatus !== "SUPERADMIN") {
    // const booking = await Booking.findAll({
    //   include: {
    //     model: BookingItem,
    //     include: Accomodation,
    //   },

    //   attributes: [
    //     "id",
    //     "checkinDate",
    //     "checkoutDate",
    //     "paymentMethod",
    //     "paymentStatus",
    //     "bookingStatus",
    //     "userId",
    //     "clientEmail",
    //     "createdAt",
    //   ],
    //   order: [["createdAt", "desc"]],
    // });
    // res.status(200).json({ booking });
    // }
    const booking = await Booking.findAll({
      include: {
        model: BookingItem,
        include: Accomodation,
      },
      order: [["createdAt", "desc"]],
    });
    res.status(200).json({ booking });
  } catch (err) {
    next(err);
  }
};
exports.getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);
    // if (req.user.userStatus !== "SUPERADMIN") {
    //   const booking = await Booking.findOne({
    //     where: { id },
    //     include: {
    //       model: BookingItem,
    //       include: Accomodation,
    //     },
    //     attributes: [
    //       "id",
    //       "checkinDate",
    //       "checkoutDate",
    //       "paymentMethod",
    //       "paymentStatus",
    //       "bookingStatus",
    //       "userId",
    //       "clientEmail",
    //       "createdAt",
    //     ],
    //     order: [["createdAt", "desc"]],
    //   });
    //   if (!booking)
    //     return res.status(400).json({ message: "Booking not found." });
    //   return res.status(200).json({ booking });
    // }
    const booking = await Booking.findAll({
      where: { id },
      include: {
        model: BookingItem,
        include: Accomodation,
      },
    });
    if (!booking)
      return res.status(400).json({ message: "Booking not found." });
    res.status(200).json({ booking });
  } catch (err) {
    next(err);
  }
};
exports.createBooking = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    // const { id } = req.user;
    // id deme
    const id = 1;
    const {
      clientEmail,
      checkinDate,
      checkoutDate,
      price,
      paymentAmount,
      paymentMethod,
      paymentStatus,
      paymentImg,
      discount,
      accomodationId,
    } = req.body;
    console.log(checkinDate, checkoutDate, accomodationId);
    const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isEmail = regexEmail.test(String(clientEmail).toLowerCase());
    if (!clientEmail)
      return res.status(400).json({ message: "Client's email is require." });
    if (!isEmail)
      return res.status(400).json({ message: "This is not an email." });
    if (
      price &&
      paymentAmount &&
      discount &&
      price * (1 - discount) !== paymentAmount
    )
      return res.status(400).json({
        message:
          "Wrong calculation for PRICE, PAYMENT AMOUNT and DISCOUNT. You can add atleast PAYMENT AMOUNT, the rest value will be delivered",
      });
    if (
      (!paymentAmount || !paymentMethod || !paymentImg) &&
      paymentStatus === "PAID"
    )
      return res.status(400).json({ message: "Payment process not complete" });
    console.log("111");

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

    const accomodations = await Accomodation.findAll({
      where: { id: accomodationId },
    });
    console.log(accomodations);

    const pricePerDay = accomodations.reduce(
      (accumulater, currentValue) => (accumulater += +currentValue.price),
      0
    );

    const totalPrice = pricePerDay * dayRange;
    const bookingPrice = price ? price : totalPrice;
    const bookingDiscount = discount
      ? discount
      : (bookingPrice - paymentAmount) / bookingPrice;
    console.log(bookingDiscount);

    for (let date of dateArrayForCheckin) {
      const previousBookingItems = await BookingItem.findAll({
        where: { dateUse: date },
      });
      const bookedAccomodation = previousBookingItems.map(
        (item) => item.accomodationId
      );
      for (let booked of bookedAccomodation) {
        console.log(booked);
        if (accomodationId.includes(String(booked))) {
          console.log("test");
          return res.status(400).json({
            message:
              "Accomodations have been previously booked. Please select new",
          });
        }
      }
    }

    const booking = await Booking.create(
      {
        clientEmail,
        checkinDate,
        checkoutDate,
        price: String(bookingPrice),
        paymentAmount,
        paymentMethod,
        paymentStatus,
        paymentImg,
        discount: String(bookingDiscount),
        userId: id,
      },
      { transaction }
    );
    const bookingItems = [];
    for (let date of dateArrayForCheckin) {
      for (let acc of accomodations) {
        const x = {
          dateUse: date,
          accomodationId: acc.id,
          bookingId: booking.id,
        };
        bookingItems.push(x);
      }
    }

    await BookingItem.bulkCreate(bookingItems, {
      transaction,
    });
    await transaction.commit();
    res.status(200).json({
      message: `Booking has been created at Booking ID ${booking.id}. Please make sure that your booking has to be confirm to send verify code to your client.`,
    });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

exports.updateBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      clientEmail,
      paymentMethod,
      paymentImg,
      paymentStatus,
      bookingStatus,
    } = req.body;
    const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isEmail = regexEmail.test(String(clientEmail).toLowerCase());
    if (clientEmail && !isEmail)
      return res.status(400).json({ message: "This is not an email." });
    const booking = await Booking.findOne({ where: { id } });
    if (req.user.id !== booking.userId || req.user.userStatus !== "SUPERADMIN")
      return res.status(400).json({
        message: "You are unauthorized to update other booking.",
      });
    if (booking.bookingStatus === "CONFIRM")
      return res.status(400).json({
        message:
          "Booking has already been confirmed and booking cannot be updated",
      });
    if (booking.bookingStatus === "CANCEL")
      return res.status(400).json({
        message: "Booking has already been canceled and cannot be updated",
      });
    booking.clientEmail = clientEmail ? clientEmail : booking.clientEmail;
    booking.paymentMethod = paymentMethod
      ? paymentMethod
      : booking.paymentMethod;
    booking.paymentImg = paymentImg ? paymentImg : booking.paymentImg;
    booking.paymentStatus = paymentStatus
      ? paymentStatus
      : booking.paymentStatus;
    booking.bookingStatus = bookingStatus
      ? bookingStatus
      : booking.bookingStatus;
    if (
      (!booking.paymentImg ||
        !booking.paymentMethod ||
        !booking.paymentAmount) &&
      booking.paymentStatus === "PAID"
    )
      return res.status(400).json({ message: "Payment process not complete" });
    if (booking.bookingStatus === "PENDING") {
      await booking.save();
      return res.status(200).json({
        message: `Booking has been updated at Booking ID ${booking.id}. Please make sure that your booking has to be confirm to send verify code to your client.`,
      });
    }
    if (
      booking.paymentStatus === "PENDING" &&
      booking.bookingStatus === "CONFIRM"
    )
      return res.status(400).json({
        message: `Payment status has to be "PAID" before confirm booking.`,
      });
    const valifyCode = String(Math.floor(Math.random() * 1000000));
    const hashedValifyCode = await bcrypt.hash(
      valifyCode,
      +process.env.BCRYPT_SALT
    );
    booking.verifyCode = hashedValifyCode;
    //youtube link - Node js Send Email using nodemailer and gmail
    let testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: booking.clientEmail,
      subject: `Verify code from ${process.env.MYHOSTEL_NAME}`,
      text: `On behalf of our entire staff, we would like to welcome you to our property.
  We are honored that you have chosen to stay with us and look forward to providing you with a memorable experience.
  We have provide you a verify code for checking in at the front of our hostel. Please insert this verify code in the "Verify Code" box in checking in process, Thank you!
  Booking ID: ${id}
  Verify Code: ${valifyCode} `,
    };
    const info = await transporter.sendMail(mailOptions);

    console.log("Message sent: %s", info.messageId);

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    //youtube link - Node js Send Email using nodemailer and gmail

    await booking.save();

    res.status(200).json({
      message: `Booking has been confirmed and verify code has been sent to client.`,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateAndSendNewVerifyCode = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findOne({ where: { id } });
    if (booking.bookingStatus !== "CONFIRM")
      return res.status(400).json({
        message:
          "New verify Code cannot be sent, Please confirm booking and try it again",
      });
    if (booking.bookingStatus === "CANCEL")
      return res.status(400).json({
        message: "Booking has already been canceled",
      });

    const valifyCode = String(Math.floor(Math.random() * 1000000));
    const hashedValifyCode = await bcrypt.hash(
      valifyCode,
      +process.env.BCRYPT_SALT
    );
    booking.verifyCode = hashedValifyCode;
    //youtube link - Node js Send Email using nodemailer and gmail
    let testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: booking.clientEmail,
      subject: `Verify code from ${process.env.MYHOSTEL_NAME}`,
      text: `On behalf of our entire staff, we would like to welcome you to our property.
  We are honored that you have chosen to stay with us and look forward to providing you with a memorable experience.
  We have provide you a verify code for checking in at the front of our hostel. Please insert this verify code in the "Verify Code" box in checking in process, Thank you!
  Booking ID: ${id}
  Verify Code: ${valifyCode} `,
    };
    const info = await transporter.sendMail(mailOptions);

    console.log("Message sent: %s", info.messageId);

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    //youtube link - Node js Send Email using nodemailer and gmail

    await booking.save();

    res.status(200).json({
      message: `New verify code has been sent to client.`,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findOne({ where: { id } });
    if (!booking)
      return res.status(400).json({ message: `Booking not found.` });
    await booking.destroy();
    res.status(204).json({ message: `Booking has been deleted.` });
  } catch (err) {
    next(err);
  }
};

exports.createBatchBooking = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.user;
    const {
      clientEmail,
      checkinDate,
      checkoutDate,
      price,
      paymentAmount,
      paymentMethod,
      paymentStatus,
      paymentImg,
      discount,
      accomodationId,
    } = req.body;
    const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isEmail = regexEmail.test(String(clientEmail).toLowerCase());
    if (!clientEmail)
      return res.status(400).json({ message: "Client's email is require." });
    if (!isEmail)
      return res.status(400).json({ message: "This is not an email." });
    if (
      price &&
      paymentAmount &&
      discount &&
      price * (1 - discount) !== paymentAmount
    )
      return res.status(400).json({
        message:
          "Wrong calculation for PRICE, PAYMENT AMOUNT and DISCOUNT. You can add atleast PAYMENT AMOUNT, the rest value will be delivered",
      });
    if (
      (!paymentAmount || !paymentMethod || !paymentImg) &&
      paymentStatus === "PAID"
    )
      return res.status(400).json({ message: "Payment process not complete" });

    const checkindate = new Date(checkinDate);
    const checkinTime = checkindate.getTime();
    const checkoutdate = new Date(checkoutDate);
    const checkoutTime = checkoutdate.getTime();
    const dayRange = (checkoutTime - checkinTime) / 86400000;

    const dayUse = dayRange - 1;

    const dateArrayForCheckin = [checkindate];
    for (let i = 1; i <= dayUse; i++) {
      const x = new Date(
        dateArrayForCheckin[dateArrayForCheckin.length - 1].getTime() + 86400000
      );
      dateArrayForCheckin.push(x);
    }

    const x = accomodationId.map((item) => item.dateUse);
    const reserveDate = [...new Set(x)];

    if (reserveDate.length !== dateArrayForCheckin.length)
      return res.status(400).json({
        message:
          "Reserving date is not correspoding to checkedin-checkedout date.",
      });

    for (let acc of accomodationId) {
      const previousBookingItems = await BookingItem.findAll({
        where: { dateUse: acc.dateUse },
      });
      const bookedAccomodation = previousBookingItems.map(
        (item) => item.accomodationId
      );

      for (let booked of bookedAccomodation) {
        if (booked == acc.accomodationId)
          return res.status(400).json({
            message:
              "Accomodations have been previously booked. Please select new",
          });
      }
    }

    let totalPrice = 0;

    for (let acc of accomodationId) {
      const accomodations = await Accomodation.findOne({
        where: { id: acc.accomodationId },
      });

      totalPrice += +accomodations.price;
    }

    const bookingPrice = price ? price : totalPrice;
    const bookingDiscount = discount
      ? discount
      : (bookingPrice - paymentAmount) / bookingPrice;
    console.log(bookingDiscount);

    const booking = await Booking.create(
      {
        clientEmail,
        checkinDate,
        checkoutDate,
        price: String(bookingPrice),
        paymentAmount,
        paymentMethod,
        paymentStatus,
        paymentImg,
        discount: String(bookingDiscount),
        userId: id,
      },
      { transaction }
    );

    const bookingItems = accomodationId.map((item) => {
      console.log(item);
      return { ...item, bookingId: booking.id };
    });

    await BookingItem.bulkCreate(bookingItems, {
      transaction,
    });
    await transaction.commit();
    res.status(200).json({
      message: `Booking has been created at Booking ID ${booking.id}. Please make sure that your booking has to be confirm to send verify code to your client.`,
    });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};
