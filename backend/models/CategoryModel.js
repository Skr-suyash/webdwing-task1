const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  title: String,
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }]
});

const categoryModel = mongoose.model('Category', categorySchema);

module.exports = categoryModel;