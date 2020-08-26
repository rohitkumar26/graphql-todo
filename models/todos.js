const mongoose = require('mongoose');
const todoschema = new mongoose.Schema({
    todo: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})
const Todo = mongoose.model('todo', todoschema, 'todos');

module.exports = Todo;