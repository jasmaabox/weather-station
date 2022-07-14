class MockHeaders {
  constructor() {
    this.pairs = [];
  }

  get(key) {
    const filteredValues = this.pairs
      .filter(([k, _]) => k === key)
      .map(([_, v]) => v);
    if (filteredValues.length > 1) {
      return filteredValues;
    } else {
      return filteredValues[0];
    }
  }

  set(key, value) {
    const idx = this.pairs.findIndex(([k, _]) => k === key);
    if (idx < 0) {
      this.append(key, value);
    } else {
      this.pairs[idx] = [this.pairs[idx][0], value];
    }
  }

  append(key, value) {
    this.pairs.push([key, value]);
  }

  [Symbol.iterator]() {
    return this.pairs.iterator();
  }
}

export class MockRequest {
  constructor(input, init) {
    this.input = input;
    this.headers = new MockHeaders();
    if (init && init.headers) {
      for (const [k, v] of Object.entries(init.headers)) {
        this.headers.append(k, v);
      }
    }
  }
}

export class MockResponse {
  constructor(body, init) {
    this.body = body;
    this.headers = new MockHeaders();
    if (init && init.headers) {
      for (const [k, v] of Object.entries(init.headers)) {
        this.headers.append(k, v);
      }
    }
  }
}