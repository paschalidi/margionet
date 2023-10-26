import mongoose from "mongoose";

interface UserAttrs {
  oauthId: string;
  email: string | null;
  provider: string;
}

export interface UserDoc extends mongoose.Document {
  oauthId: string;
  email: string | null;
  provider: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc
}

const userSchema = new mongoose.Schema({
    oauthId: {
      type: String,
      required: true
    },
    email: {
      type: String,
    },
    provider: {
      type: String,
      required: true
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
      }
    }
  })


// we are getting a custom function build in to the model
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs)
}

export const User = mongoose.model<UserDoc, UserModel>('User', userSchema)
