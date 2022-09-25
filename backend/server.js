const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
dotenv.config();
app.use(cors(), express.json());
const PORT = process.env.PORT || 8000;

// custom option swagger
exports.options = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Library API',
      version: '1.0.0',
      description: 'A simple Express Library API',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Bearer [Token]',
        },
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'],
};

// connect mongodb
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
  })
  .then(() => console.log('database connected successfully'))
  .catch((err) => console.log('error connecting to mongodb', err));

//routes
// readdirSync('./routes').map((r) => app.use('/', require('./routes/' + r)));

//Import routes
const userRouter = require('./routes/user.route');

// Setup all routes
app.use('/', userRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}..`);
});
