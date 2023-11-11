import User from '../models/user.model.js';

export async function signup(req, res) {
  try {
    const user = await User.create(req.body);

    res.status(201).json({ message: 'User sucessfully created.', user });
  } catch (error) {
    res.status(500).json(error.message);
  }
}
