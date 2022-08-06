require('dotenv').config();
const express = require('express');
const connectDB = require('./utils/dbConfig');
const todoRoutes = require('./routes/todoRoutes');
const userRoutes = require('./routes/userRoutes');

const PORT = process.env.PORT

connectDB();
const app = express();
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`)
})

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to Mongo CRUD app'
    });
});
app.use('/api', todoRoutes, userRoutes);
