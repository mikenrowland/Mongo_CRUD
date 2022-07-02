const mongoose = require('mongoose');

// DB schema for Todo tasks
const TodoSchema = new mongoose.Schema({
        title: {
            required: true,
            type: String
        },
        description: {
            required: true,
            type: String
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Todo', TodoSchema)