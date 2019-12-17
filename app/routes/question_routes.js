// require necessary npm packages
const express = require("express");

//requir mongoose model for assessment
const Question = require('../models/question').Question;

const Assessment = require('../models/assessment');
//Initiate a router (mini app that only handles routes)
const router = express.Router();

/** 
 * Action:         INDEX
 * Method:         get
 * URI:            /api/questions
 * Description:    show all questions 
*/

router.get('/api/questions', (req, res) => {
	Question.find({}, (error, questions) => {
		if (!error) {
			res.status(200).json(questions);
		} else {
			res.status(500).json(error)
		}
	})
})


/** 
 * Action:          INDEX
 * Method:         get
 * URI:            /api/assessments/:assessmentId/questions
 * Description: Get all questions by assessment ID
*/

//5df5eabddffdc8059dbc13ee
router.get('/api/:assessmentId/questions', (req, res) => {
	console.log(req);
	Assessment.findById(req.params.assessmentId)
		.populate("questions")
		.exec((error, assessment) => {
			if (!error) {
				res.status(200).json(assessment.questions);
			} else {
				res.status(500).json(error)
			}
		})
});



/** 
 * Action:         CREATE
 * Method:         POST
 * URI:            /api/assessment/:assessmentsId/questions
 * Description: Create new question
*/
//ass
//5df7769abe4b1a7984f34253
//ques
//5df7f25801b13613a561da60
router.post('/api/assessment/:assessmentId/questions', (req, res) => {
	// set the variables of inputs 
	// console.log("im here")
	const assessmentId = req.params.assessmentId;
	//    console.log("params: ",assessmentId);
	const newQuestion = new Question({ content: req.body.content });
	console.log(newQuestion);
	newQuestion.save((error, question) => {
		if (!error) {
			Assessment.findById(assessmentId, (error, assessment) => {
				if (!error) {
					console.log("ashnak", assessment.questions)
					assessment.questions.push(question);
					// Assessment.findOne({question}).populate('question')
					assessment.save((error, updateAssessment) => {
						if (!error) {
							res.status(201).json(updateAssessment);
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
 * Action:         UPDATE
//  * Method:         PATCH
 * URI:            /api/assessment/:assessmentsId/questions
 * Description:    update question by ID
*/
//5df5ec0cefd56a060bf2025a
//5df63f85816b362acff9ca9a
router.patch('/api/question/:questionId', (req, res) => {
	const questionId = req.params.questionId;
	//find assessment id
	Question.findById(questionId)
	 .then((foundQuestion) => {
		//find question
		if (foundQuestion) {
			// console.log("jhfgjdfhjdfg",foundQuestion)
			const k = foundQuestion.content;
			// console.log("content of question", k)
			// console.log('req bod', req.body.content)
			foundQuestion.content = req.body.content;
			// console.log('one more time', foundQuestion.content, foundQuestion)
			foundQuestion.save((error, savedQuestion)=> {
				// console.log('saved stufff', savedQuestion)
				res.status(204).end()
			})
		}
		else{
			console.log("else")
			res.status(404).json({
                error: {
                    name: 'DocumentNotFoundError',
                    message: 'The provided id doesn\'t match any document'
                }
            })
		}
	}).then(()=>{
        res.status(200).send('done')
    })
    });

  	


/** 
 * Action:         SHOW
 * Method:         get
 * URI:            /api/assessments/:assessmentId/questions/:questionId
 * Description:    show a certain question by question ID 
*/
//5df7769abe4b1a7984f34253/questions/5df7b2f5d4417810509f870
router.get('/api/assessment/:assessmentId/questions/:questionId', (req, res) => {
	console.log(req.params);

	Question.findById(req.params.questionId )
		.exec((error, question) => {
			console.log(question);
			if (!error) {
				res.status(200).json(question);
			} else {
				res.status(500).json(error)
			}
		})
})



//PROBLEM//
/** 
 * Action:         DESTROY
 * Method:         delete
 * URI:            /api/assessments/:assessmentId/questions/:questionId
 * Description:    delete a certain question by question ID 
*/
router.delete('/api/assessment/:assessmentId/question/:questionId', (req, res) => {
	const assessmentId = req.params.assessmentId;
	const questionId = req.params.questionId;
	console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaah')

	Assessment.findById(assessmentId, (error, foundAssessment) => {
		if (!error) {
			foundAssessment.questions;
			foundAssessment.questions.id(questionId), (foundQuestion) => {
				console.log('found it', foundQuestion)
			}
		}	
		 else {
			res.status(500).json({ error: error })
		}
	})	
	//  Assessment.findById(assessmentId)
	// .then((foundAssessment) => {
	// 	// const  result = foundAssessment.questions.id(questionId);
	// 	console.log('qqqqqqqqqqqqqqqqqqqqqq')
	// 	// return result;

	// })
	// .then((foundQuestion) => {
	// 	foundQuestion.remove(req.body)
	// 	const newAssessment = Assessment.questions.filter((question) => {
	// 		return question._id !== foundQuestion ;
	// 	})
	// 	Assessment.questions =  newAssessment
	// })
	// .catch((error) => {
	// 	res.status(500).json({error: error})
	// })

});
//Export th router so we can use it in the server.js file
module.exports = router; 