import mongoose from "mongoose";

import validator from "validator";

import bcrypt from "bcryptjs";

import crypto from "crypto";

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "userName is a Required Filed"],
  },
  email: {
    type: String,
    validate: [validator.isEmail, "Please Enter A Valid Email"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "password is a Required Filed"],
    minLength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    // This will work just for create and save not findAndUpdate Etc...
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: "The passwords are not the same",
    },
    required: [true, "The confirm Password field is Required"],
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  passwordChangedAt: Date,
  resetPasswordToken: String,
  resetPasswordTokenExpired: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// In the new Versions of mongo there is not need to use next() and put as a parameter
UserSchema.pre("save", async function (/*next*/) {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;

  // next() => //! There is not need anymore
});

UserSchema.pre(/^find/, async function (/*next*/) {
  this.find({ active: { $ne: false } });
  // next() => //! There is not need anymore
});

// Schema Methods
UserSchema.methods.comparePassword = async (password, dbPassword) => {
  return await bcrypt.compare(password, dbPassword);
};

UserSchema.methods.isPasswordChanged = function (jwtTimeStamp) {
  if (!this.passwordChangedAt) return false;
  const passwordTimeStamp = +this.passwordChangedAt.getTime() / 1000; //=>in seconds
  return passwordTimeStamp > jwtTimeStamp;
};

UserSchema.methods.generatePasswordRestToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordToken = resetPasswordToken;

  this.resetPasswordTokenExpired = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", UserSchema);

export default User;
