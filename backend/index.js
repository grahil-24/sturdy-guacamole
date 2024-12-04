const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json())
//appropriate cors for the proper functioning of httponly cookies used to store the refreshtoken
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());
dotenv.config();

app.use('/auth', authRoutes);

app.listen(3001, () => {
    console.log("server running on port 3001");
});



