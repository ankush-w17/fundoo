const app = require('./src/app');
const connectDB = require('./src/config/database');
const config = require('./src/config/config');


connectDB();


const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running in ${config.env} mode on port ${PORT}`);
});