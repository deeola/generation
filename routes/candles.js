// const express = require("express");
// const router = express.Router();
// const mongoose = require("mongoose");
// const auth = require("../middleware/auth");
// const Showcase = require("../models/showcase.model");

// router.put("/", auth, (req, res) => {
//   Showcase.findByIdAndUpdate(
//     req.body.postId,
//     {
//       $push: { likes: req.user._id },
//     },
//     { new: true }
//   ).exec((err, result) => {
//     if (err) {
//       return res.status(422).json({ error: err });
//     } else {
//       res.json(result);
//     }
//   });
// });

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const Showcase = require("../models/showcase.model");
//Comment
router.route("/:id").put(auth, async (req, res) => {
  
  
  // Build showcase object

  // Build showcase object
 
  try {
    let showcase = await Showcase.findById(req.params.id);
    if (!showcase) return res.status(404).json({ msg: "showcase not found" });

    // Make sure user owns showcase

 

    showcase = await Showcase.findByIdAndUpdate(
      req.params.id,

      { 
        $push: {  candles: req.user.id } },
      { new: true }
    );

    res.json(showcase);
  } catch (err) {
    // console.error(err.message);
    res.status(500).send("Server error");
  }


});
module.exports = router;




