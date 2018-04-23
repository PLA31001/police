const mongoose = require('mongoose');
const userSchema = require('../schemas/user');

const UsersModel = mongoose.model('user', userSchema);

module.exports = UsersModel;