import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  users: Number,
  categories: Number,
  articles: Number,
  createdAt: Date,
});

const StatModel = mongoose.model('Stat', schema);

export default StatModel;
