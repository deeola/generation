const router = require("express").Router();
const auth = require("../middleware/auth");
const Search = require("../models/showcase.model");

const Showcase = require("../models/showcase.model");

router.route("/").get(async (req, res) => {
  try {
    const showcases = await Showcase.find({})
    res.json(showcases);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//Comment

// router.put('/comment',auth,(req,res)=>{
  
//   const comment = {
//       text:req.body.text,
//       postedBy:req.user._id
//   }
//   Showcase.findByIdAndUpdate(req.body.postId,{
//       $push:{comments:comment}
//   },{
//       new:true
//   })
//   .populate("comments.postedBy","_id name")
//   .populate("postedBy","_id name")
//   .exec((err,result)=>{
//       if(err){
//           return res.status(422).json({error:err})
//       }else{
//           res.json(result)
//       }
//   })
// })



module.exports = router;
