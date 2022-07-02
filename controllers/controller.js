const TodoModel = require('../models/model');


//Post Method
const createTodo = ('/todo/', async (req, res) => {
    const data = new TodoModel({
        title: req.body.title,
        description: req.body.description
    });
    try {
        const newTodo = await data.save();
        res.status(201).json(newTodo);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
})

//Get all Method
const getAllTodo = ('/todo/', async (req, res) => {
    try {
        const data = await TodoModel.find();
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
})

//Get by ID Method
const getTodoByID = ('/todo/:id', async (req, res) => {
    try {
        const data = await TodoModel.findById(req.params.id);
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: "Document not found"});
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
})

//Update by ID Method
const updateTodo = ('/update-todo/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await TodoModel.findByIdAndUpdate(
            id, updatedData, options
        )
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "Document not found"});
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
})

//Delete by ID Method
const deleteTodo = ('/delete-todo/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await TodoModel.findByIdAndDelete(id);
        if (data) {
            res.status(200).json({
                message: `${data.title} task has been deleted from your todo list...`}
            )
        } else {
            res.status(404).json({ message: "Document not found"});
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
})



module.exports = {
    createTodo,
    getAllTodo,
    getTodoByID,
    updateTodo,
    deleteTodo
}