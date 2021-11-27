const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require('path');
const bodyParser = require('body-parser')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;


require("dotenv").config();

const app = express();
app.use(fileUpload());
const port = process.env.PORT || 5500;
app.use(bodyParser.urlencoded({ extended: true}));

// Use JSON parser for all non-webhook routes

// app.use(express.static(process.env.STATIC_DIR))


app.use((req, res, next) => {
  if (req.originalUrl === '/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// Stripe requires the raw body to construct the event
app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    // On error, log and return the error message
    console.log(`❌ Error message: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Successfully constructed event
  console.log('✅ Success:', event.id);

  // Return a response to acknowledge receipt of the event
  res.json({received: true});
});

app.post('/create-payment-intent', async (req, res) => {
 
  const paymentIntent = await stripe.paymentIntents.create({
    amount:1999,
    currency:'eur',
    payment_method_types:['card']
  })
  res.json({clientSecret: paymentIntent.client_secret})
} )







app.use(express.static(path.join(__dirname, 'uploads')))

app.use(cors());
app.use(express.json({}));


const uri = process.env.ATLAS_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

//require
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const showcaseRouter = require("./routes/showcase");
const searchshowcaseRouter = require("./routes/search");
const noteRouter = require("./routes/note");
const commentRouter = require("./routes/comment");
//use
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/showcase", showcaseRouter);
app.use("/search", searchshowcaseRouter);
app.use("/addnote", noteRouter);
app.use("/comment",commentRouter);


app.get('/',(req, res) => {
res.sendFile(path.join(__dirname, 'uploads', ))
})





//upload endpoint
app.post("/upload", (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "no file uploaded" });
  }

  const file = req.files.file;



  file.mv(`${__dirname}/client/public/uploads/${file.name}`, (err) => {

  
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }

    res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });

   
  });
});


app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});




