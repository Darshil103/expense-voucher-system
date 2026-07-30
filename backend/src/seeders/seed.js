// Seeds the database with rich sample data to populate charts and lists.
// Usage: npm run seed
const { sequelize, User, Voucher } = require('../models');
const logger = require('../utils/logger');

(async () => {
  try {
    await sequelize.authenticate();
    
    // Clear existing data to ensure a clean slate
    await sequelize.sync({ force: true });
    logger.info('Database synced & existing tables cleared.');

    // Create primary accounts
    const usersData = [
      { name: 'Aditi Sharma', email: 'employee@pspl.com', password: 'Password@123', role: 'employee', department: 'Engineering', employeeId: 'EMP001' },
      { name: 'Rahul Sen', email: 'sales.emp@pspl.com', password: 'Password@123', role: 'employee', department: 'Sales', employeeId: 'EMP002' },
      { name: 'Priya Nair', email: 'marketing.emp@pspl.com', password: 'Password@123', role: 'employee', department: 'Marketing', employeeId: 'EMP003' },
      { name: 'Karan Malhotra', email: 'hr.emp@pspl.com', password: 'Password@123', role: 'employee', department: 'HR', employeeId: 'EMP004' },
      { name: 'Rohan Deshmukh', email: 'director@pspl.com', password: 'Password@123', role: 'director', department: 'Management' },
      { name: 'Meera Iyer', email: 'accounts@pspl.com', password: 'Password@123', role: 'accounts', department: 'Finance' },
    ];

    const users = {};
    for (const u of usersData) {
      const user = await User.create(u);
      users[u.email] = user;
      logger.info(`Created user: ${u.email} (${u.role})`);
    }

    const vouchers = [
      // PENDING APPROVAL (For Director Pie Chart & Queue)
      {
        voucherNumber: 'EV-2026-000001',
        voucherDate: '2026-07-28',
        expenseDate: '2026-07-25',
        departmentName: 'Engineering',
        expenseTitle: 'AWS Cloud Hosting Fees',
        expenseCategory: 'Software',
        expenseDescription: 'AWS monthly infrastructure billing for production and staging servers.',
        amount: 85000.0,
        employeeId: users['employee@pspl.com'].id,
        employeeName: users['employee@pspl.com'].name,
        employeeCode: users['employee@pspl.com'].employeeId,
        status: 'pending_approval',
        voucherType: 'reimbursement',
        submittedAt: new Date('2026-07-28T09:00:00Z'),
        lineItems: [
          { description: 'EC2 & RDS Instance billing', amount: 65000 },
          { description: 'S3 storage & CloudFront CDN', amount: 20000 }
        ]
      },
      {
        voucherNumber: 'EV-2026-000002',
        voucherDate: '2026-07-29',
        expenseDate: '2026-07-26',
        departmentName: 'Sales',
        expenseTitle: 'Annual Client Meetup Travel',
        expenseCategory: 'Travel',
        expenseDescription: 'Flights and hotel booking for Pune enterprise client expansion meet.',
        amount: 42000.0,
        employeeId: users['sales.emp@pspl.com'].id,
        employeeName: users['sales.emp@pspl.com'].name,
        employeeCode: users['sales.emp@pspl.com'].employeeId,
        status: 'pending_approval',
        voucherType: 'reimbursement',
        submittedAt: new Date('2026-07-29T10:30:00Z'),
        lineItems: [
          { description: 'Mumbai-Pune Flight tickets round trip', amount: 15000 },
          { description: 'Hotel stay (2 nights)', amount: 20000 },
          { description: 'Local Cab transfers', amount: 7000 }
        ]
      },
      {
        voucherNumber: 'EV-2026-000003',
        voucherDate: '2026-07-29',
        expenseDate: '2026-08-15',
        departmentName: 'Marketing',
        expenseTitle: 'Q3 Product Launch Advance',
        expenseCategory: 'Travel',
        expenseDescription: 'Advance request for team travel and setup for the Delhi product launch event.',
        amount: 120000.0,
        employeeId: users['marketing.emp@pspl.com'].id,
        employeeName: users['marketing.emp@pspl.com'].name,
        employeeCode: users['marketing.emp@pspl.com'].employeeId,
        status: 'pending_approval',
        voucherType: 'advance',
        submittedAt: new Date('2026-07-29T14:00:00Z'),
        lineItems: [
          { description: 'Advance event setup deposit', amount: 80000 },
          { description: 'Travel & Accommodation allowance', amount: 40000 }
        ]
      },
      {
        voucherNumber: 'EV-2026-000004',
        voucherDate: '2026-07-30',
        expenseDate: '2026-07-28',
        departmentName: 'HR',
        expenseTitle: 'Team Dinner & Engagement',
        expenseCategory: 'Meals',
        amount: 18500.0,
        employeeId: users['hr.emp@pspl.com'].id,
        employeeName: users['hr.emp@pspl.com'].name,
        employeeCode: users['hr.emp@pspl.com'].employeeId,
        status: 'pending_approval',
        voucherType: 'reimbursement',
        submittedAt: new Date('2026-07-30T11:00:00Z'),
        lineItems: [
          { description: 'Dinner buffet for 15 employees', amount: 18500 }
        ]
      },

      // APPROVED / UNPAID (For Accounts Pending Disbursement Panel)
      {
        voucherNumber: 'EV-2026-000005',
        voucherDate: '2026-07-24',
        expenseDate: '2026-07-20',
        departmentName: 'Engineering',
        expenseTitle: 'GitHub Enterprise Subscription',
        expenseCategory: 'Software',
        amount: 28000.0,
        employeeId: users['employee@pspl.com'].id,
        employeeName: users['employee@pspl.com'].name,
        employeeCode: users['employee@pspl.com'].employeeId,
        status: 'approved',
        voucherType: 'reimbursement',
        submittedAt: new Date('2026-07-24T10:00:00Z'),
        approvedBy: users['director@pspl.com'].id,
        approvalDate: new Date('2026-07-25T11:00:00Z'),
        directorSignature: 'signed-rohan-deshmukh.png',
        lineItems: [
          { description: 'GitHub Enterprise annual seat licenses', amount: 28000 }
        ]
      },
      {
        voucherNumber: 'EV-2026-000006',
        voucherDate: '2026-07-25',
        expenseDate: '2026-07-22',
        departmentName: 'Sales',
        expenseTitle: 'Client Dinner - Oberoi',
        expenseCategory: 'Meals',
        amount: 14500.0,
        employeeId: users['sales.emp@pspl.com'].id,
        employeeName: users['sales.emp@pspl.com'].name,
        employeeCode: users['sales.emp@pspl.com'].employeeId,
        status: 'approved',
        voucherType: 'reimbursement',
        submittedAt: new Date('2026-07-25T09:00:00Z'),
        approvedBy: users['director@pspl.com'].id,
        approvalDate: new Date('2026-07-26T12:00:00Z'),
        directorSignature: 'signed-rohan-deshmukh.png',
        lineItems: [
          { description: 'Dinner with client senior management', amount: 14500 }
        ]
      },
      {
        voucherNumber: 'EV-2026-000007',
        voucherDate: '2026-07-26',
        expenseDate: '2026-07-24',
        departmentName: 'Marketing',
        expenseTitle: 'Google Ads Campaign',
        expenseCategory: 'Software',
        amount: 320000.0,
        employeeId: users['marketing.emp@pspl.com'].id,
        employeeName: users['marketing.emp@pspl.com'].name,
        employeeCode: users['marketing.emp@pspl.com'].employeeId,
        status: 'approved',
        voucherType: 'reimbursement',
        submittedAt: new Date('2026-07-26T15:00:00Z'),
        approvedBy: users['director@pspl.com'].id,
        approvalDate: new Date('2026-07-27T10:00:00Z'),
        directorSignature: 'signed-rohan-deshmukh.png',
        lineItems: [
          { description: 'Google Ads billing for Q3 marketing launch', amount: 320000 }
        ]
      },

      // REIMBURSED / SETTLED (For Accounts Bar Chart and Historic Reports)
      {
        voucherNumber: 'EV-2026-000008',
        voucherDate: '2026-07-10',
        expenseDate: '2026-07-08',
        departmentName: 'Engineering',
        expenseTitle: 'Figma Design Seat Licences',
        expenseCategory: 'Software',
        amount: 15000.0,
        employeeId: users['employee@pspl.com'].id,
        employeeName: users['employee@pspl.com'].name,
        employeeCode: users['employee@pspl.com'].employeeId,
        status: 'approved',
        voucherType: 'reimbursement',
        submittedAt: new Date('2026-07-10T10:00:00Z'),
        approvedBy: users['director@pspl.com'].id,
        approvalDate: new Date('2026-07-11T14:00:00Z'),
        directorSignature: 'signed-rohan-deshmukh.png',
        reimbursedAt: new Date('2026-07-15T09:00:00Z'),
        reimbursementRef: 'NEFT-UTR-128392109',
        lineItems: [
          { description: '5 UX Designer Figma Professional licenses', amount: 15000 }
        ]
      },
      {
        voucherNumber: 'EV-2026-000009',
        voucherDate: '2026-07-12',
        expenseDate: '2026-07-10',
        departmentName: 'Sales',
        expenseTitle: 'Bangalore Client Pitch Flight',
        expenseCategory: 'Travel',
        amount: 38000.0,
        employeeId: users['sales.emp@pspl.com'].id,
        employeeName: users['sales.emp@pspl.com'].name,
        employeeCode: users['sales.emp@pspl.com'].employeeId,
        status: 'approved',
        voucherType: 'reimbursement',
        submittedAt: new Date('2026-07-12T11:00:00Z'),
        approvedBy: users['director@pspl.com'].id,
        approvalDate: new Date('2026-07-13T10:00:00Z'),
        directorSignature: 'signed-rohan-deshmukh.png',
        reimbursedAt: new Date('2026-07-16T10:00:00Z'),
        reimbursementRef: 'NEFT-UTR-992384102',
        lineItems: [
          { description: 'Flight tickets Bangalore return', amount: 26000 },
          { description: 'Hotel stay & meals', amount: 12000 }
        ]
      },
      {
        voucherNumber: 'EV-2026-000010',
        voucherDate: '2026-07-14',
        expenseDate: '2026-07-12',
        departmentName: 'HR',
        expenseTitle: 'Office Supplies - Stationary & Files',
        expenseCategory: 'Office Supplies',
        amount: 8500.0,
        employeeId: users['hr.emp@pspl.com'].id,
        employeeName: users['hr.emp@pspl.com'].name,
        employeeCode: users['hr.emp@pspl.com'].employeeId,
        status: 'approved',
        voucherType: 'reimbursement',
        submittedAt: new Date('2026-07-14T09:00:00Z'),
        approvedBy: users['director@pspl.com'].id,
        approvalDate: new Date('2026-07-15T11:00:00Z'),
        directorSignature: 'signed-rohan-deshmukh.png',
        reimbursedAt: new Date('2026-07-18T14:30:00Z'),
        reimbursementRef: 'NEFT-UTR-882348911',
        lineItems: [
          { description: 'Printer paper reams, file organizers, notebook set', amount: 8500 }
        ]
      },

      // REJECTED (To demonstrate rejected records)
      {
        voucherNumber: 'EV-2026-000011',
        voucherDate: '2026-07-15',
        expenseDate: '2026-07-14',
        departmentName: 'Engineering',
        expenseTitle: 'Personal Mechanical Keyboard',
        expenseCategory: 'Office Supplies',
        amount: 12000.0,
        employeeId: users['employee@pspl.com'].id,
        employeeName: users['employee@pspl.com'].name,
        employeeCode: users['employee@pspl.com'].employeeId,
        status: 'rejected',
        voucherType: 'reimbursement',
        submittedAt: new Date('2026-07-15T16:00:00Z'),
        approvedBy: users['director@pspl.com'].id,
        approvalDate: new Date('2026-07-16T11:00:00Z'),
        rejectionReason: 'Personal accessories / hardware upgrades are not eligible for direct reimbursement. Please request through IT inventory.',
        lineItems: [
          { description: 'Keychron K2 Mechanical Keyboard', amount: 12000 }
        ]
      },

      // DRAFT (For Employee Edit/Delete capabilities)
      {
        voucherNumber: 'EV-2026-000012',
        voucherDate: '2026-07-30',
        expenseDate: '2026-07-29',
        departmentName: 'Engineering',
        expenseTitle: 'Local Client Visit Travel',
        expenseCategory: 'Travel',
        amount: 2450.0,
        employeeId: users['employee@pspl.com'].id,
        employeeName: users['employee@pspl.com'].name,
        employeeCode: users['employee@pspl.com'].employeeId,
        status: 'draft',
        voucherType: 'reimbursement',
        lineItems: [
          { description: 'Uber rides to Client Office and back', amount: 2450 }
        ]
      }
    ];

    await Voucher.bulkCreate(vouchers);
    logger.info(`Seeded ${vouchers.length} vouchers with various states.`);

    logger.info('Database rich seeding complete successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('Failed to seed database:', error);
    process.exit(1);
  }
})();
