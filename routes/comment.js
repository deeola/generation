const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const Showcase = require("../models/showcase.model");
//Comment
router.route("/:id").put(auth, async (req, res) => {
  const comment = {
    message: req.body.message,
    author: req.body.author,
  };

  const { comments } = req.body;
  console.log("comments", comments);

  // Build showcase object

  // Build showcase object
  const showcaseFields = {};

  if (comments) showcaseFields.comments = comments;

  try {
    let showcase = await Showcase.findById(req.params.id);
    if (!showcase) return res.status(404).json({ msg: "showcase not found" });

    // Make sure user owns showcase

    showcase = await Showcase.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: comment } },
      { new: true }
    );

    res.json(showcase);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }

  console.log("comments", showcaseFields);
});
module.exports = router;
