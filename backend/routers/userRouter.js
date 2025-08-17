const express = require('express');
const questionModel = require('../models/QuestionModel');
const categoryModel = require('../models/CategoryModel');
const userModel = require('../models/UserModel');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.get('/:user/bookmarks', verifyToken, async (req, res) => {
    const userId = req.params.user;

    // check if the accessing user is the same as the requested user
    if (req.user.id !== userId) {
        return res.status(403).json({ error: 'Forbidden: You are not authorized to view these bookmarks.' });
    }

    try {
        // find user and fetch the correcponding bookmarks based on id and populate it with q
        const user = await userModel.findById(userId).populate('bookmarks');
        if (!user) {
            return res.status(404).json({ error: 'user not found!' });
        }
        return res.json(user.bookmarks);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/:user/bookmarks', verifyToken, async (req, res) => {
    const userId = req.params.user;
    const { questionId } = req.body;

    if (userId != req.user.id) {
        return res.status(403).json({ error: 'Forbidden: You are not allowed to do this' });
    }

    try {
        // find user and check if the question exists
        const user = await userModel.findById(userId);
        const question = await questionModel.findById(questionId);
        if (!question) {
            return res.status(404).json({ error: 'Question not found!' });
        }
        await user.updateOne({ $addToSet: { bookmarks: questionId } });
        res.status(200).send('Question bookmarked successfully');
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/questions', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found!' });
        }

        const questions = await categoryModel.find().populate('questions');
        const completedSet = new Set(user.completed.map(id => id.toString()));

        const result = questions.map(category => ({
            ...category.toObject(),
            questions: category.questions.map(q => ({
            ...q.toObject(),
            completed: completedSet.has(q._id.toString())
            }))
        }));

        res.json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/:user/completed', verifyToken, async (req, res) => {
    const userId = req.params.user;
    const { questionId } = req.body;
    
    if (userId != req.user.id) {
        return res.status(403).json({ error: 'Forbidden: You are not allowed to do this' });
    }
    try {
        const user = await userModel.findById(userId);
        const question = await questionModel.findById(questionId);
        if (!question) {
            return res.status(404).json({ error: 'Question not found!' });
        }

        let message = '';
        if (user.completed.includes(questionId)) {
            user.completed = user.completed.filter((id) => id.toString() !== questionId.toString());
            message = 'Removed from completed'
        }
        else {
            user.completed.push(questionId);
            message = 'Marked as completed';
        }

        await user.save();
        await user.populate('completed');
        res.status(200).json({ message: message, completed: user.completed });   
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;