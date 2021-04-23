const express = require("express");
const router = express.Router();
const accomodationController = require("../controllers/accomodationController");
const roomController = require("../controllers/roomController");
const facilityController = require("../controllers/facilityController");
const userController = require("../controllers/userController");
const facilitySyncController = require("../controllers/facilitySyncController");
const bookingController = require("../controllers/bookingController");

router.get(
  "/user/all",
  userController.protectSuperadmin,
  userController.getAllUser
);
router.get(
  "/user",
  userController.protectSuperadmin,
  userController.getUsersByKeywords
);
router.get("/", userController.protectSuperadmin, userController.getMe);
router.post(
  "/assignadmin/:id",
  userController.protectSuperadmin,
  userController.updateStatusUserByIdForAdmin
);
router.put(
  "/assignadmin/:id",
  userController.protectSuperadmin,
  userController.updateStatusUserByIdForAdmin
);
router.put(
  "/editpassword",
  userController.protectSuperadmin,
  userController.editPassword
);
router.put(
  "/",
  userController.protectSuperadmin,
  userController.updateUserByIdForUser
);

router.delete(
  "/user/:id",
  userController.protectSuperadmin,
  userController.deleteUserByAdmin
);

router.get(
  "/accomodations",
  userController.protectSuperadmin,
  accomodationController.getAllAccomodation
);
router.get(
  "/accomodations/validinoutdate",
  userController.protectSuperadmin,
  accomodationController.getValidAccomodationByInOutDate
);
router.get(
  "/accomodations/:id",
  userController.protectSuperadmin,
  accomodationController.getAccomodationById
);
router.post(
  "/accomodations/",
  userController.protectSuperadmin,
  accomodationController.createAccomodation
);
router.put(
  "/accomodations/:id",
  userController.protectSuperadmin,
  accomodationController.updateAccomodationById
);
router.delete(
  "/accomodations/:id",
  userController.protectSuperadmin,
  accomodationController.deleteAccomodationById
);

router.get(
  "/rooms",
  userController.protectSuperadmin,
  roomController.getAllRooms
);
router.get(
  "/rooms/:id",
  userController.protectSuperadmin,
  roomController.getRoomById
);
router.post(
  "/rooms/",
  userController.protectSuperadmin,
  roomController.createRoom
);
router.put(
  "/rooms/:id",
  userController.protectSuperadmin,
  roomController.updateRoomById
);
router.delete(
  "/rooms/:id",
  userController.protectSuperadmin,
  roomController.deleteRoomById
);

router.get(
  "/facilities",
  userController.protectSuperadmin,
  facilityController.getAllFacilities
);
router.get(
  "/facilities/:id",
  userController.protectSuperadmin,
  facilityController.getFacilityById
);
router.post(
  "/facilities/",
  userController.protectSuperadmin,
  facilityController.createFacility
);
router.put(
  "/facilities/:id",
  userController.protectSuperadmin,
  facilityController.updateFacilityById
);
router.delete(
  "/facilities/:id",
  userController.protectSuperadmin,
  facilityController.deleteFacilityById
);

// router.get(
//   "/assignfacilities/",
//   userController.protectSuperadmin,
//   facilitySyncController.getAllFacilitySync
// );
router.get(
  "/assignfacilities/:id",
  userController.protectSuperadmin,
  facilitySyncController.getFacilitySyncById
);
router.post(
  "/assignfacilities/",
  userController.protectSuperadmin,
  facilitySyncController.createFacilitySync
);
router.put(
  "/assignfacilities/:id",
  userController.protectSuperadmin,
  facilitySyncController.updateFacilitySyncById
);
router.delete(
  "/assignfacilities/:id",
  userController.protectSuperadmin,
  facilitySyncController.deleteFacilitySyncById
);

router.get(
  "/booking/",
  userController.protectSuperadmin,
  bookingController.getAllBooking
);
router.get(
  "/booking/:id",
  userController.protectSuperadmin,
  bookingController.getBookingById
);
router.post(
  "/booking/",
  userController.protectSuperadmin,
  bookingController.createBooking
);
router.post(
  "/batchbooking/",
  userController.protectSuperadmin,
  bookingController.createBatchBooking
);
router.put(
  "/booking/:id",
  userController.protectSuperadmin,
  bookingController.updateBookingById
);
router.delete(
  "/booking/:id",
  userController.protectSuperadmin,
  bookingController.deleteBookingById
);
module.exports = router;
