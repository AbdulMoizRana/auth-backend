const express = require("express");
const {
  createAlbum,
  getAlbumOfUser,
} = require("../controllers/albumController");

const router = express.Router({ mergeParams: true });

router.route("/createAlbum").post(createAlbum);
router.route("/getAllbumOfUser").get(getAlbumOfUser);
module.exports = router;
