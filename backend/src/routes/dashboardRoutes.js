const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.get('/employee', authorize('employee'), dashboardController.employeeDashboard);
router.get('/director', authorize('director'), dashboardController.directorDashboard);
router.get('/accounts', authorize('accounts'), dashboardController.accountsDashboard);

// Department budget utilization — available to all authenticated roles
router.get('/budget', dashboardController.departmentBudget);

// CSV export — accounts only
router.get('/export-csv', authorize('accounts'), dashboardController.exportCsv);

module.exports = router;
