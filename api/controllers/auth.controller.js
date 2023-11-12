import { errorHandler } from '../lib/error.js';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

export async function signup(req, res, next) {
  try {
    const user = await User.create(req.body);

    res.status(201).json({ message: 'User sucessfully created.', user });
  } catch (error) {
    // next(errorHandler(500, 'Something went wrong')); // custom error handler
    next(error);
  }
}

export async function signin(req, res, next) {
  const { email, password } = req.body;

  try {
    // check for a valid user by looking for the valid email
    const validUser = await User.findOne({ email: email });

    if (!validUser) {
      return next(errorHandler(404, 'User not found'));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validPassword) {
      return next(errorHandler(401, 'Invalid credentials'));
    }

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    // Block password from being returned from the request for the client side
    const { password: hashedPassword, ...rest } = validUser._doc;

    // Add expiry date to the session
    const expiryDate = new Date(Date.now() + 3600000); // 1 hour
    res
      .cookie('access_token', token, { httpOnly: true, expires: expiryDate })
      .status(200)
      .json(rest);
  } catch (error) {
    // next(errorHandler(300, 'something went wrong'));  //custom error example
    next(error);
  }
}

export async function signUpWithGoogle(req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

      // Block password from being returned from the request for the client side
      const { password: hashedPassword, ...rest } = user._doc;

      // Add expiry date to the session
      const expiryDate = new Date(Date.now() + 3600000); // 1 hour
      res
        .cookie('access_token', token, { httpOnly: true, expires: expiryDate })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8); // generates 16 characters

      const newUser = await User.create({
        username:
          req.body.name.split(' ').join('').toLowerCase() +
          Math.floor(Math.random() * 10000).toString(),
        email: req.body.email,
        password: generatedPassword,
        profilePicture: req.body.photo,
      });

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      
      // Block password from being returned from the request for the client side
      const { password: hashedPasswordNewUser, ...rest } = newUser._doc;

      // Add expiry date to the session
      const expiryDate = new Date(Date.now() + 3600000); // 1 hour
      res
        .cookie('access_token', token, { httpOnly: true, expires: expiryDate })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
}

export function signOut(req, res) {
  res
    .clearCookie('access_token')
    .status(200)
    .json({ message: 'Signout success' });
}
