const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Database
mongoose.connect('', {useNewParser: true})
    .then(() => console.log('Connected to databate...'))
    .catch(err => console.err(err));

// Listen

app.listen(3000, () => {console.log('server is listening on port 3000...')})

// Routes

