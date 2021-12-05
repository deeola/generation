const router = require("express").Router();

//@route GET api/shopfiles
//@desc Get all users shopfiles
//@access private
const Subscribe = require("../models/subscribe.model");

router.route("/").post(async (req, res) => {
  const {
    email
  } = req.body;

  try {
    const newSubscribe = new Subscribe({
      email,
    });

    const subscribe = await newSubscribe.save();

    res.json(subscribe);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});




//@route POST api/auth
//@desc Auth User and get Token
//@access public
// router.route("/").post(auth, async (req, res) => {
//   const {
//     firstname,
//     lastname,
//     dateOfBirth,
//     dateofDeath,
//     profileMessage,
//     longMessage,
//     imageLink,
//   } = req.body;

//   try {
//     const newShowcase = new Showcase({
//       firstname,
//       lastname,
//       dateOfBirth,
//       dateofDeath,
//       profileMessage,
//       longMessage,
//       imageLink,

//       user: req.user.id,
//     });

//     const showcase = await newShowcase.save();

//     res.json(showcase);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });


module.exports = router;