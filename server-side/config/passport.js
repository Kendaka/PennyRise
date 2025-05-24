// This file configures the Google OAuth strategy for Passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const userService = require('../services/userService');

// Serialize and deserialize user instances to and from the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user instance from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Configure the Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:5000/api/users/auth/google/callback', //
  scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  console.log('Google profile:', profile); 
  // Use the userService to register or update the user based on the Google profile
  try {
    const user = await userService.registerOrUpdateGoogleUser(profile); // Register or update the user in the database
    done(null, user);
  } catch (error) {
    done(error, null);
  }
}));