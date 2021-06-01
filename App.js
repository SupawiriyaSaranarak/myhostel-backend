require("dotenv").config();
const { sequelize } = require("./models");
const express = require("express");
const cors = require("cors");
const app = express();
const errorMiddleware = require("./middlewares/error");
const userController = require("./controllers/userController");
const accomodationController = require("./controllers/accomodationController");
const roomController = require("./controllers/roomController");
const facilityController = require("./controllers/facilityController");
const bookingController = require("./controllers/bookingController");
// const userRoute = require("./routes/userRoute");
// const adminRoute = require('./routes/adminRoute')
const adminRoute = require("./routes/adminRoute");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file);
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}.${file.mimetype.split("/")[1]}`);
  },
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.split("/")[1] === "jpeg" ||
      file.mimetype.split("/")[1] === "png" ||
      file.mimetype.split("/")[1] === "jpg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("this file is not a photo"));
    }
  },
});

app.post("/picture-upload", upload.single("image"), async (req, res, next) => {
  cloudinary.uploader.upload(req.file.path, async (err, result) => {
    if (err) {
      console.log(err);
      return next(err);
    }

    fs.unlinkSync(req.file.path);

    res.status(200).json({
      message: "image uplaoded",
      name: req.body.name,
      imgUrl: result.secure_url,
    });
  });
});

app.post("/login", userController.login);
app.post("/register", userController.register);
// app.use("/user", userRoute);

app.use("/admin", adminRoute);

app.get("/accomodations", accomodationController.getAllAccomodation);
app.get("/rooms", roomController.getAllRooms);
app.get("/facilities", facilityController.getAllFacilities);
// app.get("/booking", bookingController.getAllBooking);
// app.get("/booking/:id", bookingController.getBookingById);
// app.post("/booking", bookingController.createBooking);
// app.put("/booking/:id", bookingController.updateBookingById);
app.get(
  "/accomodations/validinoutdate",

  accomodationController.getValidAccomodationByInOutDate
);
app.post(
  "/batchbooking/",

  bookingController.createBatchBooking
);
// app.use("/admin", adminRoute);
// app.use("/superadmin", superadminRoute);

app.use((req, res, next) => {
  res.status(400).json({ message: "Path not found." });
});

app.use(errorMiddleware);
// sequelize.sync({ force: false }).then(() => console.log("DB Sync"));

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server running on port ${port}`));
