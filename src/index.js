require('./db/mongoose.js');

const express = require('express');
const userRouter = require('./routers/user.js');
const taskRouter = require('./routers/task.js');

const app = express();
const port = process.env.PORT || 3000;

// Maintenance Mode
// app.use((req, res, next) => {
//   res.status(503).send('Site is undergoing some maintenance.'); 
// });

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => { console.log('Server is running on ' + port); });
