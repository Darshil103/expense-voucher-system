const sequelize = require('../config/database');
const User = require('./User');
const Voucher = require('./Voucher');

// Associations
User.hasMany(Voucher, { foreignKey: 'employeeId', as: 'vouchers' });
Voucher.belongsTo(User, { foreignKey: 'employeeId', as: 'employee' });

User.hasMany(Voucher, { foreignKey: 'approvedBy', as: 'approvedVouchers' });
Voucher.belongsTo(User, { foreignKey: 'approvedBy', as: 'approver' });

module.exports = { sequelize, User, Voucher };
