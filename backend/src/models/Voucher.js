const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Voucher extends Model {}

Voucher.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    voucherNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'voucher_number',
    },
    voucherDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'voucher_date',
    },
    expenseDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'expense_date',
    },
    departmentName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'department_name',
    },
    expenseTitle: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'expense_title',
    },
    expenseCategory: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'expense_category',
    },
    expenseDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'expense_description',
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: { min: 0.01 },
    },
    employeeId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'employee_id',
    },
    employeeName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'employee_name',
    },
    employeeCode: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'employee_code',
    },
    employeeSignature: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'employee_signature',
    },
    status: {
      type: DataTypes.ENUM('draft', 'pending_approval', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'draft',
    },
    directorSignature: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'director_signature',
    },
    approvedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'approved_by',
    },
    approvalDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'approval_date',
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'rejection_reason',
    },
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'submitted_at',
    },
    voucherType: {
      type: DataTypes.ENUM('reimbursement', 'advance'),
      allowNull: false,
      defaultValue: 'reimbursement',
      field: 'voucher_type',
    },
    lineItems: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'line_items',
    },
    reimbursedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'reimbursed_at',
    },
    reimbursementRef: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'reimbursement_ref',
    },
  },
  {
    sequelize,
    modelName: 'Voucher',
    tableName: 'vouchers',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['status'] },
      { fields: ['employee_id'] },
      { fields: ['voucher_number'] },
      { fields: ['department_name'] },
      { fields: ['expense_category'] },
    ],
  }
);

module.exports = Voucher;
