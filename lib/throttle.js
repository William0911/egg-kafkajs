'use strict';

const assert = require('assert');
const queue = require('async/queue');

class Throttle {
  constructor(worker, options) {
    assert(worker, '[egg-kafkajs] no worker specify');
    this.worker = worker;
    this.highWaterMark = options.highWaterMark || 100;

    if (options.errorHandler) {
      assert(options.errorHandler instanceof Function, '[egg-kafkajs] errorHandler should be a function');
      this.errorHandler = options.errorHandler;
    }
    this.queue = queue(this.workerWrapper(), options.concurrency || 1)
    if (options.drain) {
      assert(options.drain instanceof Function, '[egg-kafkajs] drain should be a function');
      this.queue.drain = options.drain;
    }
  }

  workerWrapper() {
    const self = this;
    return async function (message, next) {
      try {
        await self.worker(message);
      } catch (e) {
        self.errorHandler ? self.errorHandler(e) : console.error(e)
      }
      next();
    }
  }

  push(message) {
    this.queue.push(message);
  }

  size() {
    return this.queue.length();
  }

  isBusy() {
    return this.size() >= this.highWaterMark;
  }

  isAvailable() {
    return this.size() <= this.highWaterMark/2;
  }

}

module.exports = Throttle;
