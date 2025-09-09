import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import sequelize from "../config/db.js";
import initModels from "../models/initModels.js";

const { User } = initModels(sequelize);

const FRONTEND_URL = process.env.FRONTEND_URL;
const SERVER_URL = process.env.SERVER_URL;

export function setupPassport() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${SERVER_URL}/api/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          const username = profile.displayName || email?.split("@")[0];
          const providerId = profile.id;
          const avatar = profile.photos?.[0]?.value;

          let user = await User.findOne({ where: { provider: "google", providerId } });

          if (!user && email) {
            user = await User.findOne({ where: { email } });
          }

          if (!user) {
            const count = await User.count();
            user = await User.create({
              username,
              email,
              role: count === 0 ? "admin" : "creator",
              provider: "google",
              providerId,
              avatar,
              password: null,
            });
          } else {
            if (!user.provider) user.provider = "google";
            if (!user.providerId) user.providerId = providerId;
            if (!user.avatar && avatar) user.avatar = avatar;
            await user.save();
          }

          return done(null, user);
        } catch (e) {
          return done(e);
        }
      }
    )
  );

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${SERVER_URL}/api/auth/github/callback`,
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const emails = profile.emails || [];
          const email = emails[0]?.value; 
          const username = profile.username || email?.split("@")[0] || `gh_${profile.id}`;
          const providerId = profile.id;
          const avatar = profile.photos?.[0]?.value;

          let user = await User.findOne({ where: { provider: "github", providerId } });

          if (!user && email) {
            user = await User.findOne({ where: { email } });
          }

          if (!user) {
            const count = await User.count();
            user = await User.create({
              username,
              email: email || `${username}@users.noreply.github.com`, // fallback
              role: count === 0 ? "admin" : "creator",
              provider: "github",
              providerId,
              avatar,
              password: null,
            });
          } else {
            if (!user.provider) user.provider = "github";
            if (!user.providerId) user.providerId = providerId;
            if (!user.avatar && avatar) user.avatar = avatar;
            await user.save();
          }

          return done(null, user);
        } catch (e) {
          return done(e);
        }
      }
    )
  );
}
