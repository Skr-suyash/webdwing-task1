const express = require('express');
const questionModel = require('../models/QuestionModel');
const categoryModel = require('../models/CategoryModel');

const router = express.Router();

router.get('/questions', async (req, res) => {
    const { search, difficulty, page = 1, limit = 10, sortBy } = req.query;

    // object to hold search filters
    let filter = {}, sort = {};

    // for searching
    if (search) {
        filter.title = { $regex: search, $options: 'i' };
    }
    // for difficulty filtering
    if (difficulty) {
        filter.difficulty = difficulty;
    }
    // for sorting by title if sortBy given
    if (sortBy) {
        sort = { 'title': 1 };
    }

    try {
        
        // to remove previous pagination results
        const skip = (page - 1) * limit;
        const questions = await questionModel.find(filter)
            .skip(skip)
            .limit(Number(limit))
            .sort(sort);

        // no of documents filtered
        const total =  await questionModel.countDocuments(filter);

        res.json({
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / limit),
            data: questions
        });
    } catch (err) {
        console.log("Error fetching questions:", err); 
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/categories', async (req, res) => {
    try {
        // Find all categories and update thei question fields with the actual question id obtained from questions
        const categories = await categoryModel.find().populate('questions');
        res.json(categories);
    } catch (err) {
        console.log("Error fetching categories:", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;