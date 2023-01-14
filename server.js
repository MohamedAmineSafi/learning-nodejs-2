const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' }); // Before 'const app'
const app = require('./app');

process.env.NODE_ENV = 'production';

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((connection) => {
    // console.log(connection.connections);
    console.log('DB Connection Successful');
  });

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`App Running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled Rejection. Shutting Down...');

  // To shutdown gracefully
  server.close(() => {
    process.exit(1);
  });
});
