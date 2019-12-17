// require necessary npm packages
const express = require("express");

//requir mongoose model for assessment
const Question = require('../models/question').Question;
const Answer = require('../models/question').Answer
//Initiate a router (mini app that only handles routes)
const router = express.Router();

/** 
 * Action:         INDEX
 * Method:         get
 * URI:            /api/questions
 * Description:    show all answers 
*/

router.get('/api/answers', (req, res) => {
	Answer.find({}, (error, answers) => {
		if (!error) {
			res.status(200).json(answers);
		} else {
			res.status(500).json(error)
		}
	})
})



/** 
 * Action:         CREATE
 * Method:         POST
 * URI:            /api/:questionId/answers
 * Description: Create new answers
*/

router.post('/api/:questionId/answers', (req, res) => {
	// set the variables of inputs 
    // console.log("im here")
    // questionID :      5df7f25801b13613a561da60
	const questiontId = req.params.questionId;
	const newAnswer = new Answer({ content: req.body.content });
	console.log(newAnswer);
	newAnswer.save((error, newAnswer) => {
		if (!error) {
			Question.findById(questiontId, (error, foundQuestion) => {
				if (!error) {
					console.log("question.answerzzzz", foundQuestion.answers)
					foundQuestion.answers.push(newAnswer);
					// Question.findOne({answers}).populate('answers')
				    foundQuestion.save((error, updateQuestion) => {
						if (!error) {
							res.status(201).json(updateQuestion);
						} else {
							res.status(500).json(error);
						}
					})
				} else {
					res.status(500).json({ error: error })
				}
			})
		} else {
			res.status(500).json({ error: error });
		}
	})
});




/** 
 * Action:         SHOW
 * Method:         get
 * URI:            /api/question/:questionId/answer
 * Description:    show answers by questionID 
*/
//5df7769abe4b1a7984f34253/questions/5df7b2f5d4417810509f870
router.get('/api/question/:questionId/answer', (req, res) => {
	// console.log(req.params);
	Question.findById(req.params.questionId)
		.exec((error, question) => {
			console.log(question);
			if (!error) {
				res.status(200).json(question.answers);
			} else {
				res.status(500).json(error)
			}
		})
})



/** 
 * Action:         UPDATE
 * Method:      PATCH
 * URI:            /api/assessment/:assessmentsId/questions
 * Description:    update question by ID
*/

//assessmentId: 5df7769abe4b1a7984f34253
//questionId: 5df7f25801b13613a561da60
//answerId:   5df889fdf21b113ca34bf981
router.patch('/api/answer/:questionId/:answerId', (req, res) => {
    const answerId = req.params.answerId;
    const questionId = req.params.questionId;
	//find question id
	Question.findById(questionId)
	 .then((foundQuestion) => {
         //find answer
        const foundAnswer =  foundQuestion.answers.id(answerId)
        foundAnswer.content = req.body.content;
        console.log(foundQuestion.content)
        foundQuestion.save((error, savedQuestion) => {
        res.status(204).end()
      })
     
	}).then(()=>{
        res.status(200).send('done')
    })
    .catch((error) => {
        res.status(500).json({ error: error })
    });
})



/** 
 * Action:         DESTROY
 * Method:         DELETE
 * URI:            /api/:questionId/answer/:answerId
 * Description:    Delete an answer by ID
*/
//5df7f25801b13613a561da60 (question)
//5df889dad344313c91916db7 (assessment)
router.delete('/api/:questionId/answer/:answerId', (req, res) => {
const questionId = req.params.questionId;
const answerId  = req.params.answerId;
// console.log(typeof(req.params.questionId));
// console.log("-----------:", req.params.questionId == "5df7f25801b13613a561da60")
// console.log("jhghghghghg",Question.findById(req.params.questionId));
Question.findById(questionId)
.then(q=>{
// console.log("say it loud",q.answers)
const x = q.answers.filter(answer=>answer._id==answerId)
q.answers.splice(x,1)
// console.log("after the shield", q.answers)
q.save()
})
.then(()=>{
    res.status(204).end()
})
.catch(error=>console.log(error))

})

//Export th router so we can use it in the server.js file
module.exports = router; 