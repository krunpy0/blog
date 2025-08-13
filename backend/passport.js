const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const prisma = require("./prisma");
require("dotenv").config();

const cookieExtractor = (req) => {
  if (req && req.cookies) {
    return req.cookies.token;
  }
  return null;
};
const opts = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    cookieExtractor,
    ExtractJwt.fromAuthHeaderAsBearerToken(),
  ]),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await prisma.user.findFirst({
        where: { id: jwt_payload.id },
      });
      if (!user) {
        return done(null, false);
      }
      return done(null, {
        id: user.id,
        username: user.username,
        creator: user.creator,
      });
    } catch (err) {
      return done(err, false);
    }
  })
);

module.exports = passport;
