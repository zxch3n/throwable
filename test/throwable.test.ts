import { Err, isThrowable, Ok, Throwable } from '../src';

describe('Throwable', () => {
  it('basic', () => {
    expect(Ok(10).pipe((x) => Err('error')).error).toBe('error');
    expect(Ok(10).pipe(() => Err('error')).isError).toBeTruthy();
    expect(Ok(10).or(100)).toBe(10);
    expect(isThrowable(Ok(10))).toBeTruthy();
    expect(isThrowable(Err(10))).toBeTruthy();
    expect(isThrowable(123)).toBeFalsy();
    expect(isThrowable(new Error())).toBeFalsy();
  });

  it('pipe', () => {
    expect(
      Ok(10)
        .pipe((x) => x + 10)
        .unwrap(),
    ).toBe(20);
    expect(
      Err(10)
        .pipe((x) => x + 10)
        .or(0),
    ).toBe(0);
  });

  it('unwrap', () => {
    expect(Ok(10).unwrap()).toBe(10);
    expect(() => Err('err').unwrap()).toThrow('err');
  });

  it('with undefined', () => {
    let t: Throwable = Ok();
    expect(t.isOk).toBeTruthy();
    t = Err();
    expect(t.isOk).toBeFalsy();
  });
});
