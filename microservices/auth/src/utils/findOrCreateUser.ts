// Function to find or create a user
import { User } from "../models/user";
import { Profile as FbProfile, } from "passport-facebook";
import { Profile as GoogleProfile, } from "passport-google-oauth20";

export enum OAuthProvider {
  Facebook = 'facebook',
  Google = 'google',
  MagicLink = 'MagicLink',
}

type AcceptedProfiles = FbProfile | GoogleProfile | { id: string, emails: { value: string }[] };

export const findOrCreateUser = async (profile: AcceptedProfiles, provider: OAuthProvider) => {
  const user = await User.findOne({ oauthId: profile.id, provider });

  if (user) {
    console.log("existing user has been serialized", user.oauthId, user.id, profile.emails && profile.emails[0]?.value)
    return user;
  }

  const newUser = await User
    .build({
      oauthId: profile.id,
      email: profile.emails ? profile.emails[0]?.value : null,
      provider,
    })
    .save();

  console.log("newUser has been added to the DB", newUser.oauthId, newUser.id)
  return newUser;
};
