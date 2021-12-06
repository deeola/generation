const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const stripe = require("stripe")(
  "sk_test_51JzqU5IgrivdaqSjU6TGUm1ObLpDRdCNA1UPtltEVpWb2j4oAEp4V84qXRGFQOkzkxcY47Sp9nw6H9EpBn8znr0900XNpjcAaF"
);
const multer = require('multer')
require("dotenv").config();
const app = express();
app.use(fileUpload());
const port = process.env.PORT || 5500;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "uploads")));

app.use(cors());
app.use(express.json({}));
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

//FILES STORAGE USING MULTER
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images"); //important this is a direct path fron our current file to storage location
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
   
  },
});


const upload = multer({storage : fileStorageEngine })

app.post("/single", upload.single("image"), (req, res) => {

  if(req.file !== undefined){
    console.log(req.file);
  }
  
  res.send("Single file upload success");
  
});


//END OF MULTER



// Use JSON parser for all non-webhook routes

// app.use(express.static(process.env.STATIC_DIR))

app.use((req, res, next) => {
  if (req.originalUrl === "/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// Stripe requires the raw body to construct the event
app.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    // On error, log and return the error message
    console.log(`❌ Error message: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Successfully constructed event
  console.log("✅ Success:", event.id);

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
});

app.post("/create-payment-intent", async (req, res) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1999,
    currency: "eur",
    payment_method_types: ["card"],
  });
  res.json({ clientSecret: paymentIntent.client_secret });
});

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
const subscribeRouter = require("./routes/subscribe");
const candleRouter = require("./routes/candles");

//use
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/showcase", showcaseRouter);
app.use("/search", searchshowcaseRouter);
app.use("/addnote", noteRouter);
app.use("/comment", commentRouter);
app.use("/subscribe", subscribeRouter);
app.use("/candle", candleRouter);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "uploads"));
});

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

//STRIPE SUBSCRIPTION

app.post("/sub", async (req, res) => {
  const { email, payment_method } = req.body;

  const customer = await stripe.customers.create({
    payment_method: payment_method,
    email: email,
    invoice_settings: {
      default_payment_method: payment_method,
    },
  });

  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ plan: "price_1K0r8WIgrivdaqSjLUvPQCFF" }],
    expand: ["latest_invoice.payment_intent"],
  });

  const status = subscription["latest_invoice"]["payment_intent"]["status"];
  const client_secret =
    subscription["latest_invoice"]["payment_intent"]["client_secret"];

  res.json({ client_secret: client_secret, status: status });
});

// serve static assests in prod

if(process.env.NODE_ENV === 'production'){
  //set static folder

  app.use(express.static('client/build'))

  app.get('*',(req, res) =>res.sendFile(path.resolve(__dir, 'client', 'build', 'index.html')) )
}

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
