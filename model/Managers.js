const mongoose = require('mongoose');
const managerSchema = require('../schemas/manager');

const ManagersModel = mongoose.model('manager', managerSchema);

module.exports = ManagersModel;