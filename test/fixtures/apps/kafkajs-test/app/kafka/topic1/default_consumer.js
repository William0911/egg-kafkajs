'use strict';

const Subscription = require('egg').Subscription;

class MessageConsumer extends Subscription {
  async subscribe(message) {
    // 处理消息业务逻辑
    console.log('Default: Please consume this message', message);
  }
}
module.exports = MessageConsumer;