const config = require('./config');

module.exports = {
  url: config.rabbitmq.url || 'amqp://localhost',
  queues: {
    email: 'fundoo_email_queue'
  }
};
