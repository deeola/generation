const router = require("express").Router();
const auth = require("../middleware/auth");


//@route GET api/shopfiles
//@desc Get all users shopfiles
//@access private
const Showcase = require("../models/showcase.model");

router.route("/").get(auth, async (req, res) => {
  try {
    const showcases = await Showcase.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json(showcases);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route POST api/auth
//@desc Auth User and get Token
//@access public
router.route("/").post(auth, async (req, res) => {
  const {
    firstname,
    lastname,
    dateOfBirth,
    dateofDeath,
    profileMessage,
    longMessage,
    imageLink,
  } = req.body;

  try {
    const newShowcase = new Showcase({
      firstname,
      lastname,
      dateOfBirth,
      dateofDeath,
      profileMessage,
      longMessage,
      imageLink,

      user: req.user.id,
    });

    const showcase = await newShowcase.save();

    res.json(showcase);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route POST api/auth
//@desc Auth User and get Token
//@access public
router.route("/").post((req, res) => {
  res.send("add shopfile");
});

//@route Put api/showcase/:id
//@desc Update Showcase
//@access private
router.route("/:id").put(auth, async (req, res) => {
  const {
    firstname,
    lastname,
    dateOfBirth,
    dateofDeath,
    profileMessage,
    longMessage,
    imageLink,
  } = req.body;

  // Build showcase object

  // Build showcase object
  const showcaseFields = {};
  if (firstname) showcaseFields.firstname = firstname;
  if (lastname) showcaseFields.lastname = lastname;
  if (dateOfBirth) showcaseFields.dateOfBirth = dateOfBirth;
  if (dateofDeath) showcaseFields.dateofDeath = dateofDeath;
  if (profileMessage) showcaseFields.profileMessage = profileMessage;
  if (longMessage) showcaseFields.longMessage = longMessage;
  if (imageLink) showcaseFields.imageLink = imageLink;

  try {
    let showcase = await Showcase.findById(req.params.id);

    if (!showcase) return res.status(404).json({ msg: "showcase not found" });

    // Make sure user owns showcase
    if (showcase.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "Not authorized" });

    showcase = await Showcase.findByIdAndUpdate(
      req.params.id,
      { $set: showcaseFields },
      { new: true }
    );

    res.json(showcase);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//@route DELETE api/shopfiles/:id
//@desc DELETE shopfile
//@access private
router.route("/:id").delete(auth, async (req, res) => {
  try {
    const showcase = await Showcase.findById(req.params.id);

    if (!showcase) return res.status(404).json({ msg: "Showcase not found" });

    // Make sure user owns contact
    if (showcase.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "Not authorized" });

    await Showcase.findByIdAndRemove(req.params.id);

    res.json({ msg: "Showcase removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});



module.exports = router;
