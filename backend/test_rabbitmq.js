const amqp = require('amqplib');
require('dotenv').config();

const url = process.env.RABBITMQ_URL || 'amqp://localhost';
const queue = 'test_queue';

async function testRabbitMQ() {
  console.log(`Attempting to connect to RabbitMQ at ${url}...`);
  try {
    const connection = await amqp.connect(url);
    console.log('Connected to RabbitMQ!');

    const channel = await connection.createChannel();
    console.log('Channel created.');

    await channel.assertQueue(queue, { durable: false });
    console.log(`Queue "${queue}" asserted.`);

    const msg = 'Hello RabbitMQ';
    channel.sendToQueue(queue, Buffer.from(msg));
    console.log(`Sent: ${msg}`);

    console.log('Waiting for message...');
    await channel.consume(queue, (message) => {
      if (message !== null) {
        console.log(`Received: ${message.content.toString()}`);
        channel.ack(message);
        console.log('Message acknowledged.');
        
        // Cleanup and exit
        setTimeout(async () => {
             await channel.close();
             await connection.close();
             console.log('Connection closed. Test passed.');
             process.exit(0);
        }, 500);
      }
    });

  } catch (error) {
    console.error('RabbitMQ Test Failed:', error);
    process.exit(1);
  }
}

testRabbitMQ();
