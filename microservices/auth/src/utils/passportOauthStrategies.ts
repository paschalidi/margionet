import passport from "passport";
import { User } from "../models/user";
import { Profile as GoogleProfile, Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Profile as FbProfile, Strategy as FacebookStrategy } from "passport-facebook";
import MagicLoginStrategy from "passport-magic-login"
import { findOrCreateUser, OAuthProvider } from "./findOrCreateUser";
import sgMail from "@sendgrid/mail"
import { generateShortHash } from "./generateShortHash";

passport.serializeUser((userId, done) => {
  done(null, userId)
});

passport.deserializeUser(async (userId: string, done) => {
  const user = await User.findById(userId);

  if (!user) {
    return done("No user found")
  }

  if (user) {
    done(null, user);
  }
});

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID!,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    callbackURL: process.env.FACEBOOK_CLIENT_CALLBACK!,
    profileFields: ['id', 'email'],
  },
  async (accessToken, refreshToken, profile: FbProfile, done) => {
    const user = await findOrCreateUser(profile, OAuthProvider.Facebook);
    return done(null, user.id);
  }
));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CLIENT_CALLBACK!
  },
  async (accessToken, refreshToken, profile: GoogleProfile, done) => {
    const user = await findOrCreateUser(profile, OAuthProvider.Google);
    return done(null, user.id);
  }
));


export const magicLoginStrategy = new MagicLoginStrategy({
  // Used to encrypt the authentication token. Needs to be long, unique and (duh) secret.
  secret: process.env.MAGIC_LINK_SECRET!,

  // The authentication callback URL
  callbackUrl: process.env.MAGIC_LINK_CALLBACK!,

  // Called with th e generated magic link, so you can send it to the user
  // "destination" is what you POST-ed from the client
  // "href" is your confirmUrl with the confirmation token,
  // for example "/auth/magiclogin/confirm?token=<longtoken>"
  sendMagicLink: async (destination, href) => {
    console.log(`Send magic link to ${destination} with href ${href}`);
    const msg = {
      from: 'christos.paschalidis@toptal.com', // Use the email address or domain you verified above
      to: destination,
      subject: 'Clauseit – complete your login using the following link',
      templateId: "d-6df99de5bd444df0bfbffcb389a76c4f",
      dynamic_template_data: { url: href, }
    };

    try {
      await sgMail.send(msg);
    } catch (error: any) {
      console.error(error);
      if (error.response && error.response.body && error.response.body.errors) {
        console.log('SendGrid Errors:', error.response.body.errors);
      }
    }
  },

  // Once the user clicks on the magic link and verifies their login attempt,
  // you have to match their email to a user record in the database.
  // If it doesn't exist yet, they are trying to sign up, so you have to create a new one.
  // "payload" contains { "destination": "email" }
  // In standard passport fashion, call callback with the error as the first argument (if there was one)
  // and the user data as the second argument!
  verify: async ({ destination }: { destination: string }, done) => {
    const user = await findOrCreateUser(
      { id: generateShortHash(destination), emails: [{ value: destination, }] },
      OAuthProvider.MagicLink);

    done(null, user.id)
  },

  // Optional: options passed to the jwt.sign call (https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback)
  jwtOptions: {
    expiresIn: "2 days",
  }
})

passport.use(magicLoginStrategy);