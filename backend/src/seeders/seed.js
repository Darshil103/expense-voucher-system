// Seeds the database with one user per role and a couple of sample vouchers.
// Usage: npm run seed
const { sequelize, User, Voucher } = require('../models');
const logger = require('../utils/logger');

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const users = [
      { name: 'Aditi Sharma', email: 'employee@pspl.com', password: 'Password@123', role: 'employee', department: 'Engineering', employeeId: 'EMP001' },
      { name: 'Rohan Deshmukh', email: 'director@pspl.com', password: 'Password@123', role: 'director', department: 'Management' },
      { name: 'Meera Iyer', email: 'accounts@pspl.com', password: 'Password@123', role: 'accounts', department: 'Finance' },
    ];

    const created = {};
    for (const u of users) {
      const [user] = await User.findOrCreate({ where: { email: u.email }, defaults: u });
      created[u.role] = user;
      logger.info(`Ensured user: ${u.email} / Password@123`);
    }

    const existingVoucherCount = await Voucher.count();
    if (existingVoucherCount === 0) {
      await Voucher.bulkCreate([
        {
          voucherNumber: 'EV-2026-000001',
          voucherDate: new Date(),
          expenseDate: new Date(),
          departmentName: 'Engineering',
          expenseTitle: 'Client site travel',
          expenseCategory: 'Travel',
          expenseDescription: 'Cab fare for client visit',
          amount: 1250.0,
          employeeId: created.employee.id,
          employeeName: created.employee.name,
          employeeCode: created.employee.employeeId,
          status: 'draft',
        },
      ]);
      logger.info('Seeded sample voucher.');
    }

    logger.info('Seeding complete.');
    process.exit(0);
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
})();
