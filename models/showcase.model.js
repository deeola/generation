const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ShowcaseSchema = new Schema(
  {
    user:{
      type: Schema.Types.ObjectId,
      ref: 'users'
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: String
    },
    dateofDeath: {
      type: String,
     
    },
    profileMessage: {
      type: String,
    },
    longMessage : {
      type: String
    },
    
    imageLink : {
      type: String
    },
    date: {
      type: Date,
      default: Date.now
    },
    comments:[{
        message:String,
        author : String
    }],

    
  },
  {
    timestamps: true,
  }
);

const Showcase = mongoose.model("showcase", ShowcaseSchema);


module.exports = Showcase;
