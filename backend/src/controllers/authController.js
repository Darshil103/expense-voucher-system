const { User } = require('../models');
const AppError = require('../utils/AppError');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');

// @desc Register a new user (in production this would typically be restricted to admins)
// @route POST /api/auth/register
async function register(req, res) {
  const { name, email, password, role, department, employeeId } = req.body;

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    throw new AppError('An account with this email already exists', 409);
  }

  // Registration is strictly for Employee role. Executive roles (Director/Accounts) are pre-provisioned.
  const user = await User.create({
    name,
    email,
    password,
    role: 'employee',
    department,
    employeeId,
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    data: { user: user.toSafeObject(), accessToken, refreshToken },
  });
}

// @desc Authenticate user & get token
// @route POST /api/auth/login
async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  if (!user.isActive) {
    throw new AppError('This account has been deactivated. Contact your administrator.', 403);
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    data: { user: user.toSafeObject(), accessToken, refreshToken },
  });
}

// @desc Get currently authenticated user
// @route GET /api/auth/me
async function getMe(req, res) {
  res.status(200).json({ success: true, data: { user: req.user.toSafeObject() } });
}

// @desc Refresh access token
// @route POST /api/auth/refresh
async function refresh(req, res) {
  const { verifyRefreshToken } = require('../utils/jwt');
  const { refreshToken } = req.body;
  if (!refreshToken) throw new AppError('Refresh token is required', 400);

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (e) {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  const user = await User.findByPk(decoded.id);
  if (!user || !user.isActive) throw new AppError('User no longer exists or is deactivated', 401);

  const accessToken = generateAccessToken(user);
  res.status(200).json({ success: true, data: { accessToken } });
}

module.exports = { register, login, getMe, refresh };
