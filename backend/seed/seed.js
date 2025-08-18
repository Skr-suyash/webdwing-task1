const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/UserModel');
const Question = require('../models/QuestionModel');
const Category = require('../models/CategoryModel');

const MONGO_URI = process.env.MONGO_URI;

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected for seeding the data");

    const rawData = fs.readFileSync('./seed/data.json', 'utf8');
    const jsonData = JSON.parse(rawData);

    // delete all prev
    await Question.deleteMany({});
    await Category.deleteMany({});

    // set deault difficulty easy for q
    for (const categoryData of jsonData.data) {
      const questionsToInsert = categoryData.ques.map(q => ({
        title: q.title,
        url: q.p1_link || q.p2_link || q.yt_link || '',
        difficulty: q.difficulty || 'Easy'
      }));

      const inserted = await Question.insertMany(questionsToInsert);

      const category = new Category({
        title: categoryData.title,
        questions: inserted.map(q => q._id)
      });

      await category.save();
    }

    console.log("Data seeded successfully");
    process.exit();
  } catch (err) {
    console.error("Error seeding data", err);
    process.exit(1);
  }
}

seed();
