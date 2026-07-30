const { body, param, query } = require('express-validator');

const createVoucherRules = [
  body('departmentName').trim().notEmpty().withMessage('Department is mandatory'),
  body('expenseTitle').trim().notEmpty().withMessage('Expense Title is mandatory'),
  body('expenseDate').isISO8601().withMessage('Expense Date is mandatory and must be a valid date'),
  body('expenseCategory').trim().notEmpty().withMessage('Expense Category is mandatory'),
  body('amount')
    .isFloat({ gt: 0 })
    .withMessage('Amount is mandatory and must be greater than zero'),
  body('expenseDescription').optional().trim(),
];

const updateVoucherRules = createVoucherRules.map((rule) => rule.optional());

const rejectVoucherRules = [
  body('rejectionReason').trim().notEmpty().withMessage('Rejection reason is mandatory'),
];

const idParamRule = [param('id').isUUID().withMessage('Invalid voucher id')];

const listQueryRules = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('minAmount').optional().isFloat({ min: 0 }),
  query('maxAmount').optional().isFloat({ min: 0 }),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
];

module.exports = {
  createVoucherRules,
  updateVoucherRules,
  rejectVoucherRules,
  idParamRule,
  listQueryRules,
};
