// require necessary npm packages
const express = require("express");
//requir mongoose model for assessment
const Assessment = require('../models/assessment');
//Initiate a router (mini app that only handles routes)
const router= express.Router();

router.use(express.json())

/** 
 * Action:         INDEX
 * Method:         GET
 * URI:            /api/assessments
 * Description: get All assessments
*/
router.get('/api/assessments', (req, res) =>{
    Assessment.find({})
    //return all articles as an Array
    .then((assessment) =>{
        res.status(200).json({assessment: assessment});
        
    })
    //Catch any error that might occur
    .catch((error) => {
        res.status(500).jason({ error: error});
    })
});


/** 
 * Action:         CREATE
 * Method:         POST
 * URI:            /api/assessment
 * Description: Create a new assessment
 * 
*/
router.post('/api/assessment', (req, res) => {
    //assessment ==> so it can in a  group as article as article can be named whatever i want
    Assessment.create(req.body.assessment)
    //on a successful create action respond with 201
    // HTTP status and the content of the new article.
    .then((newAssessment) => {
    res.status(201).json({Assessment: newAssessment});
    })

    //Catch any errors that might occur
    .catch((error) => {
        res.status(500).json({error: error});
    });    
});


/** 
 * Action:         SHOW
 * Method:         GET
 * URI:            /api/assessment/:assessmentsId
 * Description: get an assessment by assess Id
 * 
*/
router.get('/api/assessment/:assessmentId', (req, res) => {
    Assessment.findById(req.params.assessmentId)
    .then ((assessment) =>{
        if((assessment)){
        res.status(200).json({assessment: assessment})
        }
        else{
            res.status(404).json({
                error: {
                    name:'DocumentNotFoundError',
                    message: 'The Provided id does\'t match any documents'
                }
            })

        }
    })
    .catch((error) =>{
        res.status(500).json({error: error})  
    })
})


/** 
 * Action:         DESTROY 
 * Method:         DELETE
 * URI:            /assessment/:id
 * Description: delete assessment by id
*/
router.delete('/api/assessment/:assessmentId', (req,res) => {
    Assessment.findById(req.params.assessmentId, (error, assessment) => {
        if (!error) {
            if (assessment) {
                assessment.remove(req.body, (error, assessment) => {
                    if (!error) {
                        res.status(204).end();
                    } else {
                        res.status(500).json({ error: error })
                    }
                })
            } else {
                res.status(404).json({
                    error: {
                        name: 'DocumentNotFoundError',
                        message: 'The provided id doesn\'t match any document'
                    }
                })
            }
        } else {
            res.status(500).json({ error: error })
        }
    })
});



module.exports = router