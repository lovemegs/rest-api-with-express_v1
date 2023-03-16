'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const { User, Course } = require('./models');
const { authenticateUser } = require('./middleware/auth-user');

const router = express.Router();


function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (err) {
            next(err);
        }
    }
}

// GET the current authenticated user
router.get('/users', authenticateUser, asyncHandler(async(req, res) => {
    const user = await User.findByPk(req.currentUser.id, {
        attributes: {
            exclude: ['password', 'createdAt', 'updatedAt']
        }
    });
    res.json(user);
    res.status(200).end();
}));

// Create a new user
router.post('/users', asyncHandler(async(req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).location('/').end();   
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({errors});
        } else {
            throw error;
        }
    }
}));


// GET all courses
router.get('/courses', asyncHandler(async(req, res) => {
    const courses = await Course.findAll({
        include: [
            {
                model: User,
                attributes: {
                    exclude: ['password', 'createdAt', 'updatedAt']
                }
            }
        ],
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    });
    res.json(courses);
    res.status(200).end();
}));

// GET a single course 
router.get('/courses/:id', asyncHandler(async(req, res) => {
    const course = await Course.findByPk(req.params.id, {
        include: [
            {
                model: User,
                attributes: {
                    exclude: ['password', 'createdAt', 'updatedAt']
                }
            }
        ],
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    });
    res.json(course);
    res.status(200).end();
}));

// Create a new course
router.post('/courses', authenticateUser, asyncHandler(async(req, res) => {
    try {
        const course = await Course.create({
            title: req.body.title,
            description: req.body.description,
            userId: req.currentUser.id
        });
        res.status(201).location(`/courses/${course.id}`).end();
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({errors});
        } else {
            throw error;
        }
    }
}));

// Update the corresponding course
router.put('/courses/:id', authenticateUser, asyncHandler(async(req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (course) {
            if (course.userId === req.currentUser.id) {
                await course.update(req.body);
                res.status(204).end();
            } else {
                res.status(403).end();
            }
        } 
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({errors});
        } else {
            throw error;
        }
    }
}));

// Delete a course
router.delete('/courses/:id', authenticateUser, asyncHandler(async(req, res, next) => {
    const course = await Course.findByPk(req.params.id);
    if (course) {
        if (course.userId === req.currentUser.id) {
            await Course.destroy({
                where: {
                    id: req.params.id
                }
            });
            res.status(204).end();
        } else {
            res.status(403).end();
        }
    } else {
        next();
    }
}));


module.exports = router;