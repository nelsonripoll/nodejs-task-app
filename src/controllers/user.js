const User = require('../models/user.js');
const sharp = require('sharp');

const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({user, token});
  } catch (error) {
    res.status(400).send(error);
  }
};

const readUser = async (req, res) => {
  res.status(200).send(req.user);
};

const updateUser = async (req, res) => {
  const updateFields = Object.keys(req.body);
  const allowedFields = ['name', 'email', 'password', 'age'];
  const validFields = updateFields.every((field) => allowedFields.includes(field));

  if (!validFields) {
    return res.status(400).send({error:'Invalid fields!'});
  }

  try {
    updateFields.forEach((field) => req.user[field] = req.body[field]);
    await req.user.save();
    res.status(200).send(req.user);
  } catch (error) {
    res.status(400).send(user);
  }
};

const deleteUser = async (req, res) => {
  try {
    await req.user.remove();
    res.status(200).send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set('Content-Type', 'image/png');
    res.send(user.avatar);
  } catch (error) {
    res.status(400).send(error);
  }
};

const uploadAvatar = async (req, res) => {
  const buffer = await sharp(req.file.buffer)
                       .png()
                       .resize({width: 250, height: 250})
                       .toBuffer();

  req.user.avatar = buffer;
  await req.user.save();
  res.status(200).send();
};

const deleteAvatar = async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.status(200).send();
};

const loginUser = async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.status(200).send({ user, token });
  } catch (error) {
    res.status(400).send({ error: 'Login Invalid' });
  }
};

const logoutUser = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
    await req.user.save();
    res.status(200).send();
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = {
  createUser,
  readUser,
  updateUser,
  deleteUser,
  getAvatar,
  uploadAvatar,
  deleteAvatar,
  loginUser,
  logoutUser
};
