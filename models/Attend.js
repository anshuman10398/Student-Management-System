const mongoose = require('mongoose');


const Pre = new mongoose.Schema({date:Date});
const AttendSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
      type: String,
      required: true
  },
  all: [{date:String}],
  present: [{date:String}],
  date: {
    type: Date,
    default: Date.now
  }
});

const Attend = mongoose.model('Attend', AttendSchema);

module.exports = Attend;