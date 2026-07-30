const express = require('express');
const voucherController = require('../controllers/voucherController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const validate = require('../middleware/validate');
const {
  createVoucherRules,
  updateVoucherRules,
  rejectVoucherRules,
  idParamRule,
  listQueryRules,
} = require('../validators/voucherValidators');

const router = express.Router();

router.use(authenticate);

// Employee routes
router.post(
  '/',
  authorize('employee'),
  upload.single('employeeSignature'),
  createVoucherRules,
  validate,
  voucherController.createVoucher
);
router.get('/mine', authorize('employee'), listQueryRules, validate, voucherController.getMyVouchers);
router.put(
  '/:id',
  authorize('employee'),
  upload.single('employeeSignature'),
  idParamRule,
  updateVoucherRules,
  validate,
  voucherController.updateVoucher
);
router.delete('/:id', authorize('employee'), idParamRule, validate, voucherController.deleteVoucher);
router.post('/:id/submit', authorize('employee'), idParamRule, validate, voucherController.submitVoucher);

// Director & Accounts shared listing
router.get('/', authorize('director', 'accounts'), listQueryRules, validate, voucherController.getAllVouchers);
router.get('/pending', authorize('director'), listQueryRules, validate, voucherController.getPendingApprovals);

// Director approval actions
router.post(
  '/:id/approve',
  authorize('director'),
  upload.single('directorSignature'),
  idParamRule,
  validate,
  voucherController.approveVoucher
);
router.post(
  '/:id/reject',
  authorize('director'),
  idParamRule,
  rejectVoucherRules,
  validate,
  voucherController.rejectVoucher
);

// Accounts reimbursement settlement action
router.post('/:id/reimburse', authorize('accounts'), idParamRule, validate, voucherController.markReimbursed);

// Shared detail view (role-scoped inside controller) — keep last so it doesn't shadow /mine, /pending
router.get('/:id', idParamRule, validate, voucherController.getVoucherById);

module.exports = router;
