const { Op, fn, col } = require('sequelize');
const { Voucher } = require('../models');

const MONTHLY_BUDGET_PER_DEPT = 500000; // ₹5,00,000

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

function endOfMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
}

// @desc Employee dashboard summary
// @route GET /api/dashboard/employee
async function employeeDashboard(req, res) {
  const employeeId = req.user.id;

  const [total, draft, pending, approved, rejected, totalAmount] = await Promise.all([
    Voucher.count({ where: { employeeId } }),
    Voucher.count({ where: { employeeId, status: 'draft' } }),
    Voucher.count({ where: { employeeId, status: 'pending_approval' } }),
    Voucher.count({ where: { employeeId, status: 'approved' } }),
    Voucher.count({ where: { employeeId, status: 'rejected' } }),
    Voucher.sum('amount', { where: { employeeId, status: 'approved' } }),
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalVouchers: total,
      draftVouchers: draft,
      pendingApproval: pending,
      approvedVouchers: approved,
      rejectedVouchers: rejected,
      totalAmountClaimed: totalAmount || 0,
    },
  });
}

// @desc Director dashboard summary
// @route GET /api/dashboard/director
async function directorDashboard(req, res) {
  const today = startOfToday();

  const [pendingCount, approvedToday, rejectedToday, pendingAmount, recentActivity] = await Promise.all([
    Voucher.count({ where: { status: 'pending_approval' } }),
    Voucher.count({ where: { status: 'approved', approvalDate: { [Op.gte]: today } } }),
    Voucher.count({ where: { status: 'rejected', approvalDate: { [Op.gte]: today } } }),
    Voucher.sum('amount', { where: { status: 'pending_approval' } }),
    Voucher.findAll({ order: [['updatedAt', 'DESC']], limit: 10 }),
  ]);

  res.status(200).json({
    success: true,
    data: {
      pendingApprovalCount: pendingCount,
      approvedToday,
      rejectedToday,
      totalPendingAmount: pendingAmount || 0,
      recentActivity,
    },
  });
}

// @desc Accounts dashboard summary
// @route GET /api/dashboard/accounts
async function accountsDashboard(req, res) {
  const [total, pending, approved, rejected, approvedAmount, recentApproved, pendingDisbursement] = await Promise.all([
    Voucher.count(),
    Voucher.count({ where: { status: 'pending_approval' } }),
    Voucher.count({ where: { status: 'approved' } }),
    Voucher.count({ where: { status: 'rejected' } }),
    Voucher.sum('amount', { where: { status: 'approved' } }),
    Voucher.findAll({ where: { status: 'approved' }, order: [['approvalDate', 'DESC']], limit: 10 }),
    // Approved but not yet disbursed — needs Accounts action
    Voucher.findAll({
      where: { status: 'approved', reimbursedAt: null },
      order: [['approvalDate', 'ASC']],
      limit: 15,
    }),
  ]);

  const pendingDisbursementAmount = pendingDisbursement.reduce((s, v) => s + Number(v.amount || 0), 0);

  res.status(200).json({
    success: true,
    data: {
      totalVouchers: total,
      pendingApproval: pending,
      approvedVouchers: approved,
      rejectedVouchers: rejected,
      totalApprovedExpenseAmount: approvedAmount || 0,
      recentApprovedVouchers: recentApproved,
      pendingDisbursementVouchers: pendingDisbursement,
      pendingDisbursementAmount,
    },
  });
}

// @desc Department monthly budget utilization
// @route GET /api/dashboard/budget
async function departmentBudget(req, res) {
  const monthStart = startOfMonth();
  const monthEnd = endOfMonth();

  // Sum approved + pending amounts per department this month
  const rows = await Voucher.findAll({
    attributes: [
      'departmentName',
      [fn('SUM', col('amount')), 'spent'],
      [fn('COUNT', col('id')), 'voucherCount'],
    ],
    where: {
      status: { [Op.in]: ['approved', 'pending_approval'] },
      submittedAt: { [Op.between]: [monthStart, monthEnd] },
    },
    group: ['departmentName'],
    raw: true,
  });

  // Also get per-employee dept budget if user is an employee
  let employeeDept = null;
  if (req.user.role === 'employee') {
    employeeDept = req.user.department;
  }

  const departments = rows.map((r) => ({
    name: r.departmentName,
    spent: Number(r.spent || 0),
    budget: MONTHLY_BUDGET_PER_DEPT,
    utilizationPct: Math.min(100, Math.round((Number(r.spent || 0) / MONTHLY_BUDGET_PER_DEPT) * 100)),
    voucherCount: Number(r.voucherCount || 0),
    isOverBudget: Number(r.spent || 0) > MONTHLY_BUDGET_PER_DEPT,
  }));

  res.status(200).json({
    success: true,
    data: { departments, monthlyBudgetPerDept: MONTHLY_BUDGET_PER_DEPT, employeeDept },
  });
}

// @desc Export all vouchers as downloadable CSV (Accounts role)
// @route GET /api/dashboard/export-csv
async function exportCsv(req, res) {
  const vouchers = await Voucher.findAll({
    order: [['createdAt', 'DESC']],
    raw: true,
  });

  const header = [
    'Voucher Number',
    'Voucher Date',
    'Employee Name',
    'Employee Code',
    'Department',
    'Category',
    'Expense Title',
    'Expense Date',
    'Voucher Type',
    'Amount (INR)',
    'Status',
    'Submitted At',
    'Approval Date',
    'Reimbursed At',
    'Reimbursement Ref',
    'Rejection Reason',
  ].join(',');

  function esc(val) {
    if (val === null || val === undefined) return '';
    const str = String(val).replace(/"/g, '""');
    return str.includes(',') || str.includes('\n') || str.includes('"') ? `"${str}"` : str;
  }

  const lines = vouchers.map((v) =>
    [
      esc(v.voucher_number || v.voucherNumber),
      esc(v.voucher_date || v.voucherDate),
      esc(v.employee_name || v.employeeName),
      esc(v.employee_code || v.employeeCode),
      esc(v.department_name || v.departmentName),
      esc(v.expense_category || v.expenseCategory),
      esc(v.expense_title || v.expenseTitle),
      esc(v.expense_date || v.expenseDate),
      esc(v.voucher_type || v.voucherType),
      esc(v.amount),
      esc(v.status),
      esc(v.submitted_at || v.submittedAt),
      esc(v.approval_date || v.approvalDate),
      esc(v.reimbursed_at || v.reimbursedAt),
      esc(v.reimbursement_ref || v.reimbursementRef),
      esc(v.rejection_reason || v.rejectionReason),
    ].join(',')
  );

  const csv = [header, ...lines].join('\n');
  const filename = `PSPL_Vouchers_${new Date().toISOString().slice(0, 10)}.csv`;

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.status(200).send('\uFEFF' + csv); // BOM for proper Excel UTF-8 rendering
}

module.exports = { employeeDashboard, directorDashboard, accountsDashboard, departmentBudget, exportCsv };
