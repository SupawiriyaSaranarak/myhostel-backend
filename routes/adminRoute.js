const express = require("express");
const router = express.Router();
const accomodationController = require("../controllers/accomodationController");
const roomController = require("../controllers/roomController");
const facilityController = require("../controllers/facilityController");
const userController = require("../controllers/userController");
const facilitySyncController = require("../controllers/facilitySyncController");
const bookingController = require("../controllers/bookingController");

router.get("/user/all", userController.protectAdmin, userController.getAllUser);
router.get(
  "/user",
  userController.protectAdmin,
  userController.getUsersByKeywords
);
router.get("/", userController.protectAdmin, userController.getMe);
router.post(
  "/assignadmin/:id",
  userController.protectAdmin,
  userController.updateStatusUserByIdForAdmin
);
router.put(
  "/assignadmin/:id",
  userController.protectAdmin,
  userController.updateStatusUserByIdForAdmin
);
router.put(
  "/editpassword",
  userController.protectAdmin,
  userController.editPassword
);
router.put(
  "/",
  userController.protectAdmin,
  userController.updateUserByIdForUser
);

router.delete(
  "/user/:id",
  userController.protectAdmin,
  userController.deleteUserByAdmin
);

router.get(
  "/accomodations",
  userController.protectAdmin,
  accomodationController.getAllAccomodation
);
router.get(
  "/accomodations/validinoutdate",
  userController.protectAdmin,
  accomodationController.getValidAccomodationByInOutDate
);
router.get(
  "/accomodations/:id",
  userController.protectAdmin,
  accomodationController.getAccomodationById
);
router.post(
  "/accomodations/",
  userController.protectAdmin,
  accomodationController.createAccomodation
);
router.put(
  "/accomodations/:id",
  userController.protectAdmin,
  accomodationController.updateAccomodationById
);
router.delete(
  "/accomodations/:id",
  userController.protectAdmin,
  accomodationController.deleteAccomodationById
);

router.get("/rooms", userController.protectAdmin, roomController.getAllRooms);
router.get(
  "/rooms/:id",
  userController.protectAdmin,
  roomController.getRoomById
);
router.post("/rooms/", userController.protectAdmin, roomController.createRoom);
router.put(
  "/rooms/:id",
  userController.protectAdmin,
  roomController.updateRoomById
);
router.delete(
  "/rooms/:id",
  userController.protectAdmin,
  roomController.deleteRoomById
);

router.get(
  "/facilities",
  userController.protectAdmin,
  facilityController.getAllFacilities
);
router.get(
  "/facilities/:id",
  userController.protectAdmin,
  facilityController.getFacilityById
);
router.post(
  "/facilities/",
  userController.protectAdmin,
  facilityController.createFacility
);
router.put(
  "/facilities/:id",
  userController.protectAdmin,
  facilityController.updateFacilityById
);
router.delete(
  "/facilities/:id",
  userController.protectAdmin,
  facilityController.deleteFacilityById
);

// router.get(
//   "/assignfacilities/",
//   userController.protectAdmin,
//   facilitySyncController.getAllFacilitySync
// );
router.get(
  "/assignfacilities/:id",
  userController.protectAdmin,
  facilitySyncController.getFacilitySyncById
);
router.post(
  "/assignfacilities/",
  userController.protectAdmin,
  facilitySyncController.createFacilitySync
);
router.put(
  "/assignfacilities/:id",
  userController.protectAdmin,
  facilitySyncController.updateFacilitySyncById
);
router.delete(
  "/assignfacilities/:id",
  userController.protectAdmin,
  facilitySyncController.deleteFacilitySyncById
);

router.get(
  "/booking/",
  userController.protectAdmin,
  bookingController.getAllBooking
);
router.get(
  "/booking/:id",
  userController.protectAdmin,
  bookingController.getBookingById
);
router.post(
  "/booking/",
  userController.protectAdmin,
  bookingController.createBooking
);
router.post(
  "/batchbooking/",
  userController.protectAdmin,
  bookingController.createBatchBooking
);
router.put(
  "/booking/:id",
  userController.protectAdmin,
  bookingController.updateBookingById
);
router.delete(
  "/booking/:id",
  userController.protectAdmin,
  bookingController.deleteBookingById
);
module.exports = router;
