const mongoose = require('mongoose');

const subject = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    id:{
        type: String,
        required:true
    },
    instructor:{
            type: String,
            required: true
    },
    midsem:{
        type: Number,
        default: null
    },
    assignment:{
        type: Number,
        default: null
    },
    endsem:{
        type:  Number,
        default: null
    },
    attendance: {
        present:{
            type: [String]
        },
        absent:{
            type: [String]
        } ,
        total:{
            type: [String]
        }
    }
});

const studentSchema = new mongoose.Schema({
    role:{
        type: String,
        required: true
    },
    name:{
            type: String,
            required:true
    },
    password: {
        type:String,
        required: true
    },
    dob:{
        type: String,
        required: true
    },
    email:{
        type: String
    },
    id:{
            type: String,
            required: true
    },
    branch:{
                type: String,
                required: true
    },
    semester:{
                type: String,
                required: true
    },
    subjects:{
                type: [subject]
    }
});

module.exports = mongoose.model('Student',studentSchema);