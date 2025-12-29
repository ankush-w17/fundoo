const app = require('./src/app');
const connectDB = require('./src/config/database');
const { connectRedis } = require('./src/config/redis.config');
const rabbitmqService = require('./src/services/rabbitmq.service');
const config = require('./src/config/config');


connectDB();
connectRedis();
rabbitmqService.connect().then(() => {
  rabbitmqService.consumeEmailQueue();
});


const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running in ${config.env} mode on port ${PORT}`);
});