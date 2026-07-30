const express = require('express');
const authRoutes = require('./authRoutes');
const voucherRoutes = require('./voucherRoutes');
const dashboardRoutes = require('./dashboardRoutes');

const router = express.Router();

router.get('/health', (req, res) => res.status(200).json({ success: true, message: 'API is healthy' }));
router.use('/auth', authRoutes);
router.use('/vouchers', voucherRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
