const { Op } = require('sequelize');
const config = require('../config/config');

const likeOp = config.db.dialect === 'sqlite' ? Op.like : Op.iLike;

// Builds a Sequelize `where` clause from common list query params used across
// the Employee / Director / Accounts voucher listing endpoints.
function buildVoucherWhere(query, scope = {}) {
  const where = { ...scope };

  if (query.voucherNumber) {
    where.voucherNumber = { [likeOp]: `%${query.voucherNumber}%` };
  }
  if (query.employeeName) {
    where.employeeName = { [likeOp]: `%${query.employeeName}%` };
  }
  if (query.department) {
    where.departmentName = { [likeOp]: `%${query.department}%` };
  }
  if (query.category) {
    where.expenseCategory = { [likeOp]: `%${query.category}%` };
  }
  if (query.status) {
    where.status = query.status;
  }
  if (query.startDate || query.endDate) {
    where.expenseDate = {};
    if (query.startDate) where.expenseDate[Op.gte] = query.startDate;
    if (query.endDate) where.expenseDate[Op.lte] = query.endDate;
  }
  if (query.minAmount || query.maxAmount) {
    where.amount = {};
    if (query.minAmount) where.amount[Op.gte] = query.minAmount;
    if (query.maxAmount) where.amount[Op.lte] = query.maxAmount;
  }

  return where;
}

function buildPagination(query) {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100);
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

const SORTABLE_FIELDS = [
  'createdAt',
  'voucherDate',
  'expenseDate',
  'amount',
  'status',
  'voucherNumber',
  'employeeName',
];

function buildOrder(query) {
  const sortBy = SORTABLE_FIELDS.includes(query.sortBy) ? query.sortBy : 'createdAt';
  const sortOrder = query.sortOrder && query.sortOrder.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
  return [[sortBy, sortOrder]];
}

module.exports = { buildVoucherWhere, buildPagination, buildOrder };
