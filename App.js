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
const superadminRoute = require("./routes/superadminRoute");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.post("/login", userController.login);
app.post("/register", userController.register);
// app.use("/user", userRoute);

app.use("/superadmin", superadminRoute);

app.get("/accomodations", accomodationController.getAllAccomodation);
app.get("/rooms", roomController.getAllRooms);
app.get("/facilities", facilityController.getAllFacilities);
app.get("/booking", bookingController.getAllBooking);
app.get("/booking/:id", bookingController.getBookingById);
app.post("/booking", bookingController.createBooking);

// app.use("/admin", adminRoute);
// app.use("/superadmin", superadminRoute);

app.use((req, res, next) => {
  res.status(400).json({ message: "Path not found." });
});

app.use(errorMiddleware);
// sequelize.sync({ force: false }).then(() => console.log("DB Sync"));

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server running on port ${port}`));
