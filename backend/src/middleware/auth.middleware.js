const {
  getAuth,
} = require(
  "@clerk/express"
);

/**
 * Require an authenticated Clerk user.
 *
 * clerkMiddleware() must run before
 * this middleware in app.js.
 */
const requireAuthentication = (
  req,
  res,
  next
) => {
  const auth =
    getAuth(req);

  if (!auth?.userId) {
    return res.status(401).json({
      success: false,
      message:
        "Authentication required.",
    });
  }

  // Store authenticated Clerk user ID
  // in a simple property for controllers.
  req.userId =
    auth.userId;

  next();
};

module.exports = {
  requireAuthentication,
};