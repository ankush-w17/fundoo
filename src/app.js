const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/user.routes');
const noteRoutes = require('./routes/note.routes');
const labelRoutes = require('./routes/label.routes');

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/users', userRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/labels', labelRoutes);


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;