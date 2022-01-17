export class Throwable<TReturn = undefined, TError = undefined> {
  private _ok: boolean = true;
  private _err?: TError;
  private _val?: TReturn;
  private constructor(ok: boolean, err?: TError, val?: TReturn) {
    this._ok = ok;
    this._err = err;
    this._val = val;
  }

  static Ok<TReturn = undefined, TError = any>(
    v?: TReturn,
  ): Throwable<TReturn, TError> {
    return new Throwable<TReturn, TError>(true, undefined, v);
  }

  static Err<TError = undefined, TReturn = any>(
    err?: TError,
  ): Throwable<TReturn, TError> {
    return new Throwable<TReturn, TError>(false, err);
  }

  /**
   * return the concrete error if it is an error
   */
  get error(): TError | undefined {
    return this._err;
  }
  /**
   * return the value if it is not an error
   */
  get value(): TReturn | undefined {
    return this._val;
  }

  get isOk(): boolean {
    return this._ok;
  }

  get isError(): boolean {
    return !this._ok;
  }

  /**
   * if `this.value` is not error, then return `func(this.value)`
   * otherwise return `this.error`
   */
  pipe<T>(
    func: (value: TReturn) => T | Throwable<T, TError>,
  ): Throwable<T, TError> {
    if (this.isOk) {
      const ret = func(this.value!);
      if (ret instanceof Throwable) {
        return ret;
      }
      return Ok(ret);
    } else {
      return this as any;
    }
  }

  /**
   * if this.value is valid, return this.value, otherwise return sub
   */
  or<T>(sub: T): TReturn | T {
    if (this.isOk) {
      return this.value!;
    } else {
      return sub;
    }
  }

  /**
   * if this.value is valid return it, otherwise throw the error
   */
  unwrap(): TReturn {
    if (this.isOk) {
      return this.value!;
    } else {
      throw this._err;
    }
  }
}

export const Ok = Throwable.Ok;
export const Err = Throwable.Err;
export function isThrowable(v: unknown): v is Throwable<any, any> {
  return v instanceof Throwable;
}
