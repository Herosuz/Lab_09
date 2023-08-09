const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const schema = new Schema({
  id: ObjectId,
  temperature: { type: Number, required: true },
  humid: { type: Number, required: true },
  time: { type: Date, required: true },
});

module.exports = mongoose.model('farm', schema);