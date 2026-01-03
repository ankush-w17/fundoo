const redis = require('redis');
const config = require('./config');

const redisClient = redis.createClient({
  socket: {
    host: config.redis.host,
    port: config.redis.port
  },
  password: config.redis.password || undefined
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('Redis Client Connected');
});

redisClient.on('ready', () => {
  console.log('Redis Client Ready');
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
  }
};

module.exports = { redisClient, connectRedis };
