const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    url: {
        type: String,
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Easy',
    }
});

const questionModel = mongoose.model('Question', questionSchema);

module.exports = questionModel;