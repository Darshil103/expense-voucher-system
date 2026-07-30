const { Voucher } = require('../models');
const { Op } = require('sequelize');

// Generates a sequential, human-readable voucher number scoped to the current year
// Format: EV-YYYY-000001
async function generateVoucherNumber() {
  const year = new Date().getFullYear();
  const prefix = `EV-${year}-`;

  const lastVoucher = await Voucher.findOne({
    where: { voucherNumber: { [Op.like]: `${prefix}%` } },
    order: [['createdAt', 'DESC']],
  });

  let nextSeq = 1;
  if (lastVoucher) {
    const lastSeq = parseInt(lastVoucher.voucherNumber.split('-').pop(), 10);
    nextSeq = lastSeq + 1;
  }

  return `${prefix}${String(nextSeq).padStart(6, '0')}`;
}

module.exports = generateVoucherNumber;
