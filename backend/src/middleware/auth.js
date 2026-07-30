const AppError = require('../utils/AppError');
const { verifyAccessToken } = require('../utils/jwt');
const { User } = require('../models');

async function authenticate(req, res, next) {
  // Support token in query param for browser-native file downloads (e.g. CSV export)
  let token;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.query._token) {
    token = req.query._token;
  } else {
    throw new AppError('Not authenticated. Please log in.', 401);
  }

  const decoded = verifyAccessToken(token);

  const user = await User.findByPk(decoded.id);
  if (!user || !user.isActive) {
    throw new AppError('User no longer exists or is deactivated.', 401);
  }

  req.user = user;
  next();
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AppError('You do not have permission to perform this action.', 403);
    }
    next();
  };
}

module.exports = { authenticate, authorize };
