'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const { restart } = require('nodemon');
const router = express.Router();
const { authenticateUser } = require('./auth-user');
const { Courses, Users } = require('./models');

const middleware = express();
middleware.use(express.json());

function asyncHandler(cb){
    return async (req, res, next)=>{
      try {
        await cb(req,res, next);
      } catch(err){
        next(err);
      }
    };
}

// Get Users
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
        const user = req.currentUser;
        res.json({
            name: user.firstName,
            username: user.emailAddress,
            id: user.id
        })
        res.status(200).end();
}));

// Add Users
router.post('/users', asyncHandler(async (req, res) => {
        let errors = [];
        let user = req.body;
        try {
            if(!user.firstName) {
                errors.push('Please provide first name')
            }
    
            if(!user.lastName) {
                errors.push('Please provide last name')
            }
    
            if(!user.emailAddress) {
                errors.push('Please provide email address');
            }
    
            if(!user.password) {
                errors.push('Please provide password')
            }

            if (errors.length > 0) {
                res.status(400).json({ errors });
            } else {
                let firstName = req.body.firstName;
                let lastName = req.body.lastName;
                let emailAddress = req.body.emailAddress;
                let password = req.body.password;
                const newUser = await Users.create({
                    firstName: firstName,
                    lastName: lastName,
                    emailAddress: emailAddress,
                    password: password
                });
                res.status(201);
                res.setHeader('location', newUser.id).end();
            } 
        } catch (error) {
            if(error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                const errors = error.errors.map(err => err.message);
                res.status(400).json({ errors });
            } else {
                throw error;
            }
        }
}));

// Get All Courses
router.get('/courses', asyncHandler( async (req, res) => {
        const allCourses = await Courses.findAll({
            include: [{
                model: Users,
            }]
        });
        res.json(allCourses);
        res.status(200).end();
}));

// Get A Course
router.get('/courses/:id', asyncHandler( async (req, res) => {
        const course = await Courses.findByPk(req.params.id,
            {
                include: [{
                    model: Users,
                }]
            });
        if(course) {
            res.json(course);
            res.status(200).end();
        } else {
            res.status(404).json({message: 'Course Not Found'});
        }
}));

// Add A New Course
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
        const user = req.currentUser;
        let title = req.body.title;
        let description = req.body.description;
        let estimatedTime = req.body.estimatedTime;
        let materialsNeeded = req.body.materialsNeeded;
        let userId = req.body.userId;
    
        try {
            const newCourse = await Courses.create({
                title: title,
                description: description,
                estimatedTime: estimatedTime,
                materialsNeeded: materialsNeeded,
                userId: userId
            });
            res.status(201);
            res.setHeader('location', newCourse.id).end();
        } catch (error) {
            if(error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                const errors = error.errors.map(err => err.message);
                res.status(400).json({ errors });
            } else {
                throw error;
            }
        }
}));

// Update A Course
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
        const user = req.currentUser;
        const courseToEdit = await Courses.findByPk(req.params.id);
            if(courseToEdit) {
                courseToEdit.title = req.body.title;
                courseToEdit.description = req.body.description;
                courseToEdit.estimatedTime = req.body.estimatedTime;
                courseToEdit.materialsNeeded = req.body.materialsNeeded;
                courseToEdit.userId = req.body.userId;
            
                try {
                     //update course
                    await courseToEdit.update({
                        title: courseToEdit.title,
                        description: courseToEdit.description,
                        estimatedTime: courseToEdit.estimatedTime,
                        materialsNeeded: courseToEdit.materialsNeeded,
                        userId: courseToEdit.userId
                    });
                    await courseToEdit.save();
                    res.status(204).end();
                } catch (error) {
                    if(error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                        const errors = error.errors.map(err => err.message);
                        res.status(400).json({ errors });
                    } else {
                        throw error;
                    }
                }
            }   
    }));

// Delete A Course
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
        const user = req.currentUser;
        const courseToDelete = await Courses.findByPk(req.params.id);
        if(req.params.id) {
            await courseToDelete.destroy();
            res.status(204).end();
        } else {
            res.status(404).json({message: 'Course Not Found'});
        }
}));

module.exports = router;