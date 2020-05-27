const mongoose = require('mongoose')

const subject = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    id:
    {
        type:String,
        required: true
    },
    feedbacks:{
        type: [String]
    },
    classes:{
        type: [String]
    }
});

const teacherSchema = new mongoose.Schema({
    role:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    password: {
        type:String,
        required: true
    },
    department:{
        type: String,
        required: true
    },
    id:{
        type:String,
        required: true
    },
    email:{
        type:String
    },
    subjects:{
            type: [subject]
    }
});

module.exports = mongoose.model('Teacher',teacherSchema);