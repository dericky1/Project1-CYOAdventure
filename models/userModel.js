const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema ({
    Name: String,
    Level: Number,
    HP: Number,
});