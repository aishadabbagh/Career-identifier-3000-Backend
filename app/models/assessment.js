const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const AssessmentSchema = new Schema({
  title: {
    type: String,
    default: "", 
    required: true
  },
 // its referred from user.js (types and ObjectId) 
 questions:[{
   type : Schema.Types.ObjectId,
   ref: 'Question'
 }]
 
 });

const Assessment = mongoose.model("Assessment", AssessmentSchema);
module.exports =Assessment;