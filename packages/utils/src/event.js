const event = {

  on(key, listener) {
    if (!this._events) {
      this._events = {};
    }
    if (!this._events[key]) {
      this._events[key] = [];
    }

    if (
      !this._events[key].indexOf(listener) !== -1 &&
      typeof listener === 'function'
    ) {
      this._events[key].push(listener);
    }
    return this;
  },

  once(key, listener) {
    let self = this;
    this.on(key, function recursiveFunction(...params) {
      listener.apply(self, params);
      self.off(key, recursiveFunction);
    });
  },

  emit(key) {
    let args = Array.prototype.slice.call(arguments, 1) || [];
    if (!this._events || !this._events[key]) {
      return;
    }
    let listeners = this._events[key];
    let i = 0;
    let l = listeners.length;
    for (i; i < l; i++) {
      listeners[i].apply(this, args);
    }

    return this;
  },

  off(key, listener) {
    if (!key && !listener) {
      this._events = {};
    }
    if (key && !listener) {
      delete this._events[key];
    }
    if (key && listener) {
      let listeners = this._events[key];
      let index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    }
    return this;
  },

};


event.mixTo = function (receiver) {
  receiver = typeof (receiver) === 'function' ? receiver.prototype : receiver;
  for (let p in event) {
      if (event.hasOwnProperty(p)) {
        Object.defineProperty(receiver, p, {
            value: event[p]
        });
      }
  }
};

export default event;
