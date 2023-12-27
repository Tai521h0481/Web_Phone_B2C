const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    password: { type: String },
    email: { type: String, required: true },
    role: { type: String, enum: ['admin', 'salesperson'], default: 'salesperson' },
    avatar: {type: String, default: "https://vignette.wikia.nocookie.net/marvelcinematicuniverse/images/7/73/SMH_Mentor_6.png"},
    isActive: { type: Boolean, default: false },
    isLocked: { type: Boolean, default: false },
    status: {type: String, enum: ['online', 'offline'], default: 'offline'},
    creationDate: { type: Date, default: Date.now },
    timeWorked: {type: Number, default: 0},
    lastTimeOnline: {type: Date, default: Date.now},
});

module.exports = mongoose.model('User', userSchema);