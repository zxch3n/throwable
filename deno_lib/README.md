# Throwable

> A type-safe way to handle Error in TypeScript

<details>
<summary>Why </summary>

By default, we use try, catch, throw to handle error in JS/TS. But it's not type-safe -- we cannot tell what error a function may throw. It makes `throw` risky -- any unhandled error will make the program crash, which probably is not something we want. 

All we need is a way to semantically tell us there might be a error that should be handled. 

- `T | undefined` lacks of detail info
- `T | Error` is not convenient to work with

Haskell's `Either` type might be a solution to this scenario. This project rename it to `Throwable` for better readability. 

We can use `Throwable<TReturn, TError>` to mark a return type of a function to declare it will return `TError` if error occurred, otherwise `TReturn`;

```ts
function div(a: number, b: number): Throwable<number, 'divZero' | 'divNaN'> {
  if (b === 0) {
    return Err('divZero');
  }

  if (Number.isNaN(b)) {
    return Err('divNaN');
  }

  return Ok(a / b);
}

function aDivBDivB(a: number, b: number): Throwable<number, 'divZero'> {
  return div(a, b).ifOk(c => div(c, b));
}


```
</details>

## Usage

Install
```
yarn add @typ3/throwable
```

Basic usage
```ts
import {Ok, Err, Throwable} from '@typ3/throwable'
// in deno
import {Ok, Err, Throwable} from 'https://deno.land/x/throwable@v0'

function parse(input: string): Throwable<string[], 'invalid'> {
  const ans = []
  if (!input.startsWith('{')) {
    // Rather than `throw new Error()`
    return Err('invalid');
  }

  ...

  return Ok(ans);
}

```


Throwable interface

```ts
interface Throwable<TReturn, TError> {
  /**
   * return the concrete error if it is an error
   */
  get error(): TError | undefined
  /**
   * return the value if it is not an error
   */
  get value(): TReturn | undefined
  get isOk(): boolean;
  get isError(): boolean;
  /**
   * if `this.value` is not error, then return `func(this.value)`
   * otherwise return `this.error`
   */
  pipe<T>(func: (value: TReturn) => T): Throwable<T, TError>;
  /**
   * if this.value is valid, return this.value, otherwise return sub
   */
  or<T>(sub: T): TReturn | T;
  /**
   * if this.value is valid return it, otherwise throw the error
   */
  unwrap(): TReturn;
}

function Ok<TReturn, TError=any>(v: TReturn): Throwable<TReturn, TError>;
function Err<TError, TReturn=any>(v: TError): Throwable<TReturn, TError>;
```

### `Use Case`


```ts
type MThrowable = Throwable<T, 'notExists' | {type: 'parseError', msg: string} >;

function readJsonFile<T>(path: string): Promise<MThrowable>{
  ...
}

async function readName(path: string): Promise<MThrowable>{
  return (await readJsonFile(path)).pipe(x => x.name);
}

function getValidNames(paths: string[]): Promise<string[]> {
  return Promise.all(paths.map(readName)).filter(x => x.isOk());
}
```






