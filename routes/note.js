const router = require("express").Router();
const auth = require("../middleware/auth");

//@route GET api/shopfiles
//@desc Get all users shopfiles
//@access private
const Note = require("../models/note.model");

router.route("/:id").put(auth, async (req, res) => {
    const comment =  {
      text 
    } = req.body;
  
    try {
      const newNote = new Note({
        message,
        author,
  
        user: req.user.id,
      });
  
      const note = await newNote.save();
  
      res.json(note);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  });
  
module.exports = router;
