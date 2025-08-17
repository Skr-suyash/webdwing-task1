const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    bookmarks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }],
    completed: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }],
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;