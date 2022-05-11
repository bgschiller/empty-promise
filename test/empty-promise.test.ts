import emptyPromise from '../src';

describe('emptyPromise', () => {
  it('resolve', done => {
    const wait = emptyPromise();
    wait.then(val => {
      expect(val).toEqual('some value');
      done();
    });
    process.nextTick(() => {
      wait.resolve('some value');
    });
  });

  it('reject', done => {
    const wait = emptyPromise();

    wait.catch(err => {
      expect(err.message).toBe('some error');
      done();
    });

    process.nextTick(() => {
      wait.reject(new Error('some error'));
    });
  });

  it('resolve returns original promise', done => {
    const wait = emptyPromise();

    const result = wait.resolve('some value');

    expect(result).toBeInstanceOf(Promise);
    expect(result).toBe(wait);

    done();
  });

  it('reject returns original promise', done => {
    const wait = emptyPromise();

    const result = wait.reject('some error');

    expect(result).toBeInstanceOf(Promise);
    expect(result).toBe(wait);

    result.catch(() => {
      /* ignore */
    });
    done();
  });

  it('receive resolved value after awaiting resolve', done => {
    (async () => {
      const wait = emptyPromise();
      const result = await wait.resolve('some value');

      expect(result).toBe('some value');
      done();
    })();
  });

  it('done returns false if promise not resolved', done => {
    const wait = emptyPromise();
    expect(wait.done()).toBe(false);
    wait.resolve().then(() => done());
  });

  it('done returns true after promise resolved', done => {
    (async () => {
      const wait = emptyPromise();
      await wait.resolve('some value');

      expect(wait.done()).toBe(true);
      done();
    })();
  });

  it('done returns true after promise rejected', done => {
    (async () => {
      const wait = emptyPromise();
      await wait.reject('some error').catch(() => {
        /* ignore */
      });

      expect(wait.done()).toBe(true);
      done();
    })();
  });
});
