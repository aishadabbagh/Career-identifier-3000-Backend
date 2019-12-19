//moongoose is responsibe for the schema
const mongoose = require ("mongoose");
const Schema = mongoose.Schema;

//embeded
const answerSchema = new Schema({
    content: String
  })
  

const questionSchema = new Schema({
    // title:{ type: String, default: ''},
    content: String,
    //embeded with answers
    answers: [answerSchema]
    
},{
  usePushEach: true
});

const Question = mongoose.model('Question', questionSchema);
const Answer = mongoose.model('Answer', answerSchema);
module.exports = { Question, Answer};  
