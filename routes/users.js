const router = require("express").Router();
let User = require("../models/user.model");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


router.route("/").get((req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

//POST

router.route("/").post(async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const password2 = req.body.password2;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }


    //write code here
     user = new User({
      username,
      email,
      password,
      password2,
    });

    const salt = await bcrypt.genSalt(10);

			user.password = await bcrypt.hash(password, salt);
      user.password2 = await bcrypt.hash(password2, salt);
      

			await user.save();

    user
      .save('user saved')

      const payload = {
				user: {
					id: user.id
				}
			};

			jwt.sign(
				payload,
				'jwtSecret',
				{ expiresIn: 360000 },
				(err, token) => {
					if (err) throw err;
					res.json({ token });
				}
			);
     
      //catch error next
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }

});

module.exports = router;


// .then(() => res.json("User added!"))
// .catch((err) => res.status(400).json("Error: " + err));