const Task = require('../models/task.js');

const createTask = async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      user_id: req.user._id
    });

    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
};

const readAllTasks = async (req, res) => {
  const match = { };
  const options = { };

  if (req.query.completed) {
    match.completed = req.query.completed === 'true';
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':');
    options.sort = { };
    options.sort[parts[0]] = parts[1].toLowerCase() === 'desc' ? -1 : 1;
  }

  options.limit = parseInt(req.query.limit);
  options.skip = parseInt(req.query.skip);


  try {
    await req.user.populate({ path: 'tasks', match, options }).execPopulate();
    res.status(200).send(req.user.tasks);
  } catch (error) {
    res.status(400).send(error);
  }
};

const readTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user_id: req.user._id
    });

    // if you need the user object instead of just the id
    // await task.populate('user_id').execPopulate();

    if (!task) {
      return res.status(404).send();
    }

    res.status(200).send(task);
  } catch (error) {

    res.status(400).send(error);
  }
};

const updateTask = async (req, res) => {
  const updateFields = Object.keys(req.body);
  const allowedFields = ['description', 'completed'];
  const validFields = updateFields.every((field) => allowedFields.includes(field));

  if (!validFields) {
    return res.status(400).send({error:'Invalid fields!'});
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user_id: req.user._id
    });

    if (!task) {
      return res.status(404).send();
    }

    updateFields.forEach((field) => task[field] = req.body[field]);

    await task.save();

    res.status(200).send(task);
  } catch (error) {
    res.status(400).send(task);
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user._id
    });

    if (!task) {
      return res.status(404).send();
    }

    res.status(200).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  createTask,
  readAllTasks,
  readTask,
  updateTask,
  deleteTask
};
