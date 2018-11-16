'use strict';

const Controller = require('egg').Controller;
const uuid = require('uuid/v4');

class HomeController extends Controller {
  async index() {
    // 区分不同业务的key
    const key = 'key1';
    let m_time = Date.now();
    const options = {
      env: 'development',
      requestId: this.config.keys + ':' + key + '@' + uuid(),
      sysCode: process.env.sysCode || 'usercenter',
      requestType: key,
      requestFlag: '0',
      timestamp: m_time.toString(),
      param: {},
      partition: 0,
      attributes: 0,
      payload: Buffer.from(JSON.stringify({
        title: 'test',
        content: 'just a panic',
      })),
    };
    const data = {};
    for (const field of this.config.kafkajs.avroSchema.fields) {
      data[field.name] = options[field.name] || null;
    }
    const buffer = this.ctx.helper.binaryEncode(data);
    const msg = [this.ctx.kafka.Message('topic1', key, buffer)];
    try {
      const result = await this.ctx.kafka.send(msg);
    } catch (err) {
      console.log(err, '0000000000000000')
    }

    this.ctx.status = 200;
  }

  async queue() {
    for (let i = 0; i < 1000; i++) {
      let m_time = Date.now();
      const uid = uuid();
      const key = 'key-' + uid;
      const options = {
        env: 'development',
        requestId: this.config.keys + ':' + key,
        sysCode: process.env.sysCode || 'usercenter',
        requestType: key,
        requestFlag: '0',
        timestamp: m_time.toString(),
        param: {},
        partition: 0,
        attributes: 0,
        payload: Buffer.from(JSON.stringify({
          title: 'test-' + uid,
          content: 'just a panic',
        })),
      };
      const data = {};
      for (const field of this.config.kafkajs.avroSchema.fields) {
        data[field.name] = options[field.name] || null;
      }
      const buffer = this.ctx.helper.binaryEncode(data);
      const msg = [this.ctx.kafka.Message('topic1', key, buffer)];
      try {
        const result = await this.ctx.kafka.send(msg);
      } catch (err) {
        console.log(err, '0000000000000000')
      }
    }
    this.ctx.status = 200;
  }
}

module.exports = HomeController;