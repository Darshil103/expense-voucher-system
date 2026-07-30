const path = require('path');
const fs = require('fs');
const { Voucher, User } = require('../models');
const AppError = require('../utils/AppError');
const generateVoucherNumber = require('../utils/generateVoucherNumber');
const { buildVoucherWhere, buildPagination, buildOrder } = require('../utils/queryBuilder');

const EMPLOYEE_EDITABLE_STATUSES = ['draft'];

function relativeFilePath(file) {
  if (!file) return undefined;
  return `/uploads/signatures/${file.filename}`;
}

// @desc Create a new voucher (always starts as Draft)
// @route POST /api/vouchers
async function createVoucher(req, res) {
  const voucherNumber = await generateVoucherNumber();

  let parsedLineItems = null;
  if (req.body.lineItems) {
    try {
      parsedLineItems = typeof req.body.lineItems === 'string' ? JSON.parse(req.body.lineItems) : req.body.lineItems;
    } catch (e) {
      parsedLineItems = null;
    }
  }

  const voucher = await Voucher.create({
    voucherNumber,
    voucherDate: new Date(),
    expenseDate: req.body.expenseDate,
    departmentName: req.body.departmentName,
    expenseTitle: req.body.expenseTitle,
    expenseCategory: req.body.expenseCategory,
    expenseDescription: req.body.expenseDescription,
    amount: req.body.amount,
    voucherType: req.body.voucherType || 'reimbursement',
    lineItems: parsedLineItems,
    employeeId: req.user.id,
    employeeName: req.user.name,
    employeeCode: req.user.employeeId,
    employeeSignature: relativeFilePath(req.file),
    status: 'draft',
  });

  res.status(201).json({ success: true, message: 'Voucher saved as draft', data: { voucher } });
}

// @desc Update a voucher (only while in Draft, only by its owner)
// @route PUT /api/vouchers/:id
async function updateVoucher(req, res) {
  const voucher = await Voucher.findByPk(req.params.id);
  if (!voucher) throw new AppError('Voucher not found', 404);
  if (voucher.employeeId !== req.user.id) throw new AppError('You can only edit your own vouchers', 403);
  if (!EMPLOYEE_EDITABLE_STATUSES.includes(voucher.status)) {
    throw new AppError('Only Draft vouchers can be edited', 400);
  }

  const fields = ['expenseDate', 'departmentName', 'expenseTitle', 'expenseCategory', 'expenseDescription', 'amount', 'voucherType'];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) voucher[f] = req.body[f];
  });
  if (req.body.lineItems !== undefined) {
    try {
      voucher.lineItems = typeof req.body.lineItems === 'string' ? JSON.parse(req.body.lineItems) : req.body.lineItems;
    } catch (e) {
      voucher.lineItems = req.body.lineItems;
    }
  }
  if (req.file) voucher.employeeSignature = relativeFilePath(req.file);

  await voucher.save();
  res.status(200).json({ success: true, message: 'Voucher updated', data: { voucher } });
}

// @desc Delete a voucher (only while in Draft, only by its owner)
// @route DELETE /api/vouchers/:id
async function deleteVoucher(req, res) {
  const voucher = await Voucher.findByPk(req.params.id);
  if (!voucher) throw new AppError('Voucher not found', 404);
  if (voucher.employeeId !== req.user.id) throw new AppError('You can only delete your own vouchers', 403);
  if (!EMPLOYEE_EDITABLE_STATUSES.includes(voucher.status)) {
    throw new AppError('Only Draft vouchers can be deleted', 400);
  }

  await voucher.destroy();
  res.status(200).json({ success: true, message: 'Voucher deleted' });
}

// @desc Submit a Draft voucher for Director approval
// @route POST /api/vouchers/:id/submit
async function submitVoucher(req, res) {
  const voucher = await Voucher.findByPk(req.params.id);
  if (!voucher) throw new AppError('Voucher not found', 404);
  if (voucher.employeeId !== req.user.id) throw new AppError('You can only submit your own vouchers', 403);
  if (voucher.status !== 'draft') throw new AppError('Only Draft vouchers can be submitted', 400);
  if (!voucher.employeeSignature) {
    throw new AppError('Employee signature is mandatory before submission', 400);
  }

  voucher.status = 'pending_approval';
  voucher.submittedAt = new Date();
  await voucher.save();

  res.status(200).json({ success: true, message: 'Voucher submitted for approval', data: { voucher } });
}

// @desc Get vouchers created by the logged-in employee
// @route GET /api/vouchers/mine
async function getMyVouchers(req, res) {
  const where = buildVoucherWhere(req.query, { employeeId: req.user.id });
  const { page, limit, offset } = buildPagination(req.query);
  const order = buildOrder(req.query);

  const { rows, count } = await Voucher.findAndCountAll({ where, order, limit, offset });

  res.status(200).json({
    success: true,
    data: { vouchers: rows, pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) } },
  });
}

// @desc Get all vouchers (Director / Accounts) with search, filter, sort, pagination
// @route GET /api/vouchers
async function getAllVouchers(req, res) {
  const where = buildVoucherWhere(req.query);
  const { page, limit, offset } = buildPagination(req.query);
  const order = buildOrder(req.query);

  const { rows, count } = await Voucher.findAndCountAll({ where, order, limit, offset });

  res.status(200).json({
    success: true,
    data: { vouchers: rows, pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) } },
  });
}

// @desc Get pending-approval vouchers (Director)
// @route GET /api/vouchers/pending
async function getPendingApprovals(req, res) {
  const where = buildVoucherWhere({ ...req.query, status: 'pending_approval' });
  const { page, limit, offset } = buildPagination(req.query);
  const order = buildOrder(req.query);

  const { rows, count } = await Voucher.findAndCountAll({ where, order, limit, offset });

  res.status(200).json({
    success: true,
    data: { vouchers: rows, pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) } },
  });
}

// @desc Get a single voucher by id (role-scoped)
// @route GET /api/vouchers/:id
async function getVoucherById(req, res) {
  const voucher = await Voucher.findByPk(req.params.id);
  if (!voucher) throw new AppError('Voucher not found', 404);

  if (req.user.role === 'employee' && voucher.employeeId !== req.user.id) {
    throw new AppError('You can only view your own vouchers', 403);
  }

  res.status(200).json({ success: true, data: { voucher } });
}

// @desc Approve a pending voucher (Director)
// @route POST /api/vouchers/:id/approve
async function approveVoucher(req, res) {
  const voucher = await Voucher.findByPk(req.params.id);
  if (!voucher) throw new AppError('Voucher not found', 404);
  if (voucher.status !== 'pending_approval') {
    throw new AppError('Only vouchers pending approval can be approved', 400);
  }
  if (!req.file && !voucher.directorSignature) {
    throw new AppError('Director signature is mandatory before approval', 400);
  }

  voucher.status = 'approved';
  voucher.approvedBy = req.user.id;
  voucher.approvalDate = new Date();
  if (req.file) voucher.directorSignature = relativeFilePath(req.file);
  await voucher.save();

  res.status(200).json({ success: true, message: 'Voucher approved', data: { voucher } });
}

// @desc Reject a pending voucher with a mandatory reason (Director)
// @route POST /api/vouchers/:id/reject
async function rejectVoucher(req, res) {
  const voucher = await Voucher.findByPk(req.params.id);
  if (!voucher) throw new AppError('Voucher not found', 404);
  if (voucher.status !== 'pending_approval') {
    throw new AppError('Only vouchers pending approval can be rejected', 400);
  }

  voucher.status = 'rejected';
  voucher.approvedBy = req.user.id;
  voucher.rejectionReason = req.body.rejectionReason;
  voucher.approvalDate = new Date();
  await voucher.save();

  res.status(200).json({ success: true, message: 'Voucher rejected', data: { voucher } });
}

// @desc Mark an approved voucher as reimbursed/settled (Accounts)
// @route POST /api/vouchers/:id/reimburse
async function markReimbursed(req, res) {
  const voucher = await Voucher.findByPk(req.params.id);
  if (!voucher) throw new AppError('Voucher not found', 404);
  if (voucher.status !== 'approved') {
    throw new AppError('Only approved vouchers can be marked as reimbursed', 400);
  }

  voucher.reimbursedAt = new Date();
  voucher.reimbursementRef = req.body.reimbursementRef || `PAY-PSPL-${Date.now()}`;
  await voucher.save();

  res.status(200).json({ success: true, message: 'Voucher payment marked as settled/reimbursed', data: { voucher } });
}

module.exports = {
  createVoucher,
  updateVoucher,
  deleteVoucher,
  submitVoucher,
  getMyVouchers,
  getAllVouchers,
  getPendingApprovals,
  getVoucherById,
  approveVoucher,
  rejectVoucher,
  markReimbursed,
};
