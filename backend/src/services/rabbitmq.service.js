const amqp = require('amqplib');
const rabbitMQConfig = require('../config/rabbitmq.config');
const emailService = require('./email.service');

class RabbitMQService {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    try {
      this.connection = await amqp.connect(rabbitMQConfig.url);
      this.channel = await this.connection.createChannel();
      
      // Assert queue exists
      await this.channel.assertQueue(rabbitMQConfig.queues.email, {
        durable: true // Queue survives broker restart
      });
      
      console.log('RabbitMQ Connected');
    } catch (error) {
      console.error('RabbitMQ Connection Error:', error);
    }
  }

  async sendToQueue(queueName, data) {
    try {
      if (!this.channel) {
        await this.connect();
      }
      
      this.channel.sendToQueue(
        queueName,
        Buffer.from(JSON.stringify(data)),
        { persistent: true } // Message survives broker restart
      );
      
      return true;
    } catch (error) {
      console.error('Error sending message to queue:', error);
      return false;
    }
  }

  async consumeEmailQueue() {
    try {
      if (!this.channel) {
        await this.connect();
      }

      console.log('Worker waiting for messages in queue:', rabbitMQConfig.queues.email);

      this.channel.consume(rabbitMQConfig.queues.email, async (msg) => {
        if (msg !== null) {
          const content = JSON.parse(msg.content.toString());
          console.log('Processing email task:', content.toEmail);

          try {
            await emailService.sendCollaboratorInvitation(
              content.toEmail,
              content.fromUser,
              content.noteTitle,
              content.noteId
            );
            
            // Acknowledge message only after successful processing
            this.channel.ack(msg);
            console.log('Email sent and task acknowledged.');
          } catch (error) {
            console.error('Error processing email task:', error);
            // Optionally: Nack with requeue=false if it's a permanent error
            // this.channel.nack(msg, false, false);
          }
        }
      });
    } catch (error) {
      console.error('Error consuming queue:', error);
    }
  }
}

module.exports = new RabbitMQService();
