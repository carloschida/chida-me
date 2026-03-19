---
title: "Introduction to Effect.ts with Pokémon (2/n)"
pubDate: "2026-03-18T18:30:00.000-06:00"
description: "Effects are programs"
author: "Carlos Chida"
category: "Software"
tags: ["effect", "typescript", "error"]
image: "/blog/state-machine.webp"
---

Welcome back to the second part of the series Introduction to Effect.ts with
Pokémon. If you didn't catch the previous part, you can find it
[here](/blog/intro-to-effect-1).

## What is an Effect?

An Effect is to be understood in many ways. We'll make several analogies along this series to fully understand how to treat them.

Having said that, our first definition for an Effect is _an inert piece of computation (or thunk)_ that describes its output (or success),
the ways it can fail, and the dependencies it has to run. This means that an Effect is nothing until it is run.

There's a concept in regular TS which already fits that definition: a function. Functions are just just a declaration of code that are actually nothing until they are run.

In that regard, being inert, we can compare them with regular TS functions.

| Type-Safety for | Effect | TS function     |
| --------------- | ------ | --------------- |
| Input           | ✅     | ✅              |
| Output          | ✅     | ✅              |
| Errors          | ✅     | ❌ only on docs |
| Dependencies    | ✅     | ❌ only on docs |

We could go on and on about definitions and other matters, but instead I'm going
to show you a simple example: the rewrite of our SDK's `getPokemonById`
function.

## Rewriting `getPokemonById`

Recap our `data.ts` file:

```ts twoslash
// @filename: data.ts
export type Pokemon = {
  id: number;
  name: string;
  evolutionId: number | null;
};

export const DATA: Array<Pokemon> = [
  /* ... */
];
```

And now our `sdk.ts` file:

```ts twoslash
// @filename: data.ts
export type Pokemon = {
  id: number;
  name: string;
  evolutionId: number | null;
};

export const DATA: Array<Pokemon> = [
  /* ... */
];
// ---cut---
// @filename: sdk.ts
import { DATA, type Pokemon } from "./data";

export function getPokemonById(id: number): Pokemon {
  // Simulate a network error
  if (Math.random() < 0.3) throw new Error("API is down");

  const pokemon = DATA.find((pokemon) => pokemon.id === id);
  if (pokemon === undefined) throw new Error("Pokemon not found");

  return pokemon;
}
```

Finally, and without further ado, our new `sdk-effect.ts` file:

```ts twoslash
// @filename: data.ts
export type Pokemon = {
  id: number;
  name: string;
  evolutionId: number | null;
};

export const DATA: Array<Pokemon> = [
  /* ... */
];
// ---cut---
// @filename: sdk-effect.ts
import { Data, Effect } from "effect";
import { DATA, type Pokemon } from "./data";

export class ApiDownError extends Data.TaggedError("ApiDownError")<{}> {}
export class PokemonNotFoundError extends Data.TaggedError(
  "PokemonNotFoundError",
)<{}> {}

export const eGetPokemonById = (id: number) =>
  Effect.gen(function* () {
    if (Math.random() < 0.3) return yield* Effect.fail(new ApiDownError());

    const pokemon = DATA.find((p) => p.id === id);

    if (pokemon === undefined) {
      return yield* Effect.fail(new PokemonNotFoundError());
    }

    return pokemon;
  });
```

As you can see, both functions are very similar in their implementations. But
there are two pesky differences:

- `Data.TaggedError`
- `Effect.gen(function* () {})`

Let's unpack them.

### Class `Data.TaggedError`

Errors in Effect are represented by the `Data.TaggedError` rather than by the `Error` class and its subclasses.

Imagine that we have a simple error:

```ts twoslash
class SimpleError extends Error {
  explanation = "This happens randomly";
  code?: string | undefined;

  constructor(message: string, code?: string | undefined) {
    super(message);
    this.code = code;
  }
}

const e = new SimpleError("Something went wrong", "E_001");
console.log(e.code); // E_001
console.log(e.explanation); // This happens randomly
```

In Effect you would write it like this:

```ts twoslash
import { Data } from "effect";

class SimpleError extends Data.TaggedError("SimpleError")<{
  code: string;
}> {
  explanation = "This happens randomly";
}

const e = new SimpleError({ code: "E_001" });
console.log(e.code); // E_001
console.log(e.explanation); // This happens randomly
console.log(e._tag); // CustomError
```

> When an object is **tagged** in Effect, this means that it has a property called `_tag` which is a string that identifies the type of the object.
> This allows a simple string comparison to determine the type of the object instead of the costly `instanceof` operator.
>
> ```ts twoslash
> import { Data } from "effect";
>
> class SimpleError extends Data.TaggedError("SimpleError")<{}> {}
>
> const e = new SimpleError();
>
> // ⚠️ Valid but inefficient
> if (e instanceof SimpleError) {
> }
>
> // ✅ Killer!
> if (e._tag === "SimpleError") {
> }
> ```

### Wrapper `Effect.gen`

`Effect.gen` is the magic wrapper crafted by the white-bearded TypeScript sorcerers that created and maintain the Effect library.

This wrapper takes a generator function. If you don't know what a generator is, worry not! For almost all purposes in Effect, consider it just syntax.

This syntax, though, has some differences in the body of their corresponding functions:

| TypeScript                | Effect.gen                                     |
| ------------------------- | ---------------------------------------------- |
| `throw new CustomError()` | `return yield* Effect.fail(new CustomError())` |
| `await asyncFunction()`   | `yield* anEffect`                              |
| `return`                  | `return`                                       |

What we gain by wrapping our function with `Effect.gen` is that the result is an `Effect.Effect` instead of a simple result. More on that follows.

### Difference in signatures

What did we actually gain by rewriting our `getPokemonById` function?

To answer that question, check out the signatures that each of our functions have:

```ts twoslash
// @filename: data.ts
export type Pokemon = {
  id: number;
  name: string;
  evolutionId: number | null;
};

export const DATA: Array<Pokemon> = [
  /* ... */
];

// @filename: sdk.ts
import { DATA, type Pokemon } from "./data";

export function getPokemonById(id: number): Pokemon {
  // Simulate a network error
  if (Math.random() < 0.3) throw new Error("API is down");

  const pokemon = DATA.find((pokemon) => pokemon.id === id);
  if (pokemon === undefined) throw new Error("Pokemon not found");

  return pokemon;
}

// @filename: sdk-effect.ts
import { Data, Effect } from "effect";
import { DATA, type Pokemon } from "./data";

export class ApiDownError extends Data.TaggedError("ApiDownError")<{}> {}
export class PokemonNotFoundError extends Data.TaggedError(
  "PokemonNotFoundError",
)<{}> {}

export const eGetPokemonById = (id: number) =>
  Effect.gen(function* () {
    if (Math.random() < 0.3) return yield* Effect.fail(new ApiDownError());

    const pokemon = DATA.find((p) => p.id === id);

    if (pokemon === undefined) {
      return yield* Effect.fail(new PokemonNotFoundError());
    }

    return pokemon;
  });
// ---cut---

// @filename: pokedex.ts
import { getPokemonById } from "./sdk";
import { eGetPokemonById } from "./sdk-effect";

getPokemonById(1);
// ^?

eGetPokemonById(1);
// ^?
```

On the one hand, we have a function that takes a `number` returns a `Pokemon` object. Nonetheless, we don't know how or even whether it can fail. Yes, you can document the errors that it throws, but as we've seen in the previous post, this is cumbersome and error-prone.

On the other hand, we have a function that takes a `number` and returns an `Effect.Effect<Pokemon, ApiDownError | PokemonNotFoundError, never>`.

The types should be read as `Effect.Effect<Success, Failure, Requirements>`.

- If `Success` is `void`, it meant that the effect succeeds without returning anything.
- If `Failure` is `never`, that means that the function never fails.
- If `Requirements` is `never`, that means that the function doesn't have any dependencies.

Dependencies are their own world, and for the time being we'll ignore them. But we'll tackle them later in this series.

But now that we have a function that returns an `Effect.Effect`, how do we actually use it?

## How to use an Effect?

Let's remember how we were fetching the base Pokémon from our database when we wanted to get its evolution:

```ts twoslash
// @filename: data.ts

export type Pokemon = {
  id: number;
  name: string;
  evolutionId: number | null;
};

export const DATA: Array<Pokemon> = [
  /* ... */
];

// @filename: sdk.ts

import { DATA, type Pokemon } from "./data";

export function getPokemonById(id: number): Pokemon {
  // Simulate a network error
  if (Math.random() < 0.3) throw new Error("API is down");

  const pokemon = DATA.find((pokemon) => pokemon.id === id);
  if (pokemon === undefined) throw new Error("Pokemon not found");

  return pokemon;
}
// ---cut-before---
// @filename: pokedex.ts

import { type Pokemon } from "./data";
import { getPokemonById } from "./sdk";

export function getEvolution(basePokemonId: number): Pokemon | undefined {
  let pokemon: Pokemon | null | undefined;

  try {
    pokemon = getPokemonById(basePokemonId);
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.message === "API is down") {
        throw new Error(
          "Could not reach the database to get the base Pokemon",
          { cause: err },
        );
      } else if (err.message === "Pokemon not found") {
        pokemon = null;
      }

      // Because you never know if the SDK will change its behaviour
      throw new Error("Unknow error", { cause: err });
    }
  }

  if (pokemon === null || pokemon === undefined) {
    throw new Error("Base Pokémon not found in the database");
  }

  /* ... */
  // ---cut-start---
  return pokemon;
  // ---cut-end---
}
```

If we try something as simple as subtituting `getPokemonById` for `eGetPokemonById`, this won't work because the first function returns a `Pokemon` whereas the second returns an Effect in which the `Pokemon` may be contained.

First, notice that an Effect needs to be run as it is an inert piece of computation.
But how do we run an Effect?

### Running an Effect

A function is run by invoking it. In JS/TS this means adding `()` at the end of the function and writing its parameters inside the brakets.

An Effect is run by passing it to an Effect runner. Although [there are various](https://effect.website/docs/getting-started/running-effects/), the one may use here is the `Effect.sync` function.

```ts twoslash
// @filename: data.ts

export type Pokemon = {
  id: number;
  name: string;
  evolutionId: number | null;
};

export const DATA: Array<Pokemon> = [
  /* ... */
];

// @filename: sdk-effect.ts
import { Data, Effect } from "effect";
import { DATA, type Pokemon } from "./data";

export class ApiDownError extends Data.TaggedError("ApiDownError")<{}> {}
export class PokemonNotFoundError extends Data.TaggedError(
  "PokemonNotFoundError",
)<{}> {}

export const eGetPokemonById = (id: number) =>
  Effect.gen(function* () {
    if (Math.random() < 0.3) return yield* Effect.fail(new ApiDownError());

    const pokemon = DATA.find((p) => p.id === id);

    if (pokemon === undefined) {
      return yield* Effect.fail(new PokemonNotFoundError());
    }

    return pokemon;
  });
// ---cut-before---
// @filename: pokedex.ts
import { Effect } from "effect";
import { type Pokemon } from "./data";
import { eGetPokemonById } from "./sdk-effect";

export function getEvolution(basePokemonId: number): Pokemon | undefined {
  let pokemon: Pokemon | null | undefined;

  try {
    pokemon = Effect.runSync(eGetPokemonById(basePokemonId));
  } catch (err: unknown) {
    /* ... */
  }

  if (pokemon === null || pokemon === undefined) {
    throw new Error("Base Pokémon not found in the database");
  }

  /* ... */
  // ---cut-start---
  return pokemon;
  // ---cut-end---
}
```

The function `Effect.runSync` is a function that runs a synchronous Effect and returns its result or throws and error if it fails.

But as we know, you can `throw` anything in JS/TS and the `err` in the `catch` block will still have type `unknown`. Which in this case is not very useful.

Is this the way? No! The better way is two-stepped: postpone the computation of the Effect, and while we remain in this _Effectful_ world, unwrap the content of said Effect.

But what is _unwrapping_? Glad that you asked! In this context, unwrapping means that we peak at the content of an Effect and act accordingly to whether it succeeds or fails.
In other words, we are going to state what should be done when an Effect succeeds with a `Pokemon` and when it fails with an `ApiDownError` or `PokemonNotFoundError`.

### Unwrapping an Effect

We can do this by using the `Effect.match` function.

```ts twoslash
// @filename: data.ts

export type Pokemon = {
  id: number;
  name: string;
  evolutionId: number | null;
};

export const DATA: Array<Pokemon> = [
  /* ... */
];

// @filename: sdk-effect.ts
import { Data, Effect } from "effect";
import { DATA, type Pokemon } from "./data";

export class ApiDownError extends Data.TaggedError("ApiDownError")<{}> {}
export class PokemonNotFoundError extends Data.TaggedError(
  "PokemonNotFoundError",
)<{}> {}

export const eGetPokemonById = (id: number) =>
  Effect.gen(function* () {
    if (Math.random() < 0.3) return yield* Effect.fail(new ApiDownError());

    const pokemon = DATA.find((p) => p.id === id);

    if (pokemon === undefined) {
      return yield* Effect.fail(new PokemonNotFoundError());
    }

    return pokemon;
  });
// ---cut-before---
// @filename: pokedex.ts
import { Effect } from "effect";
import { type Pokemon } from "./data";
import { eGetPokemonById } from "./sdk-effect";

export function getEvolution(basePokemonId: number): Pokemon | undefined {
  let pokemon: Pokemon | null | undefined;

  Effect.runSync(
    Effect.match(eGetPokemonById(basePokemonId), {
      onSuccess: (result) => {
        //          ^?
        pokemon = result;
      },
      onFailure: (err) => {
        //        ^?
        switch (err._tag) {
          //        ^?
          case "ApiDownError":
            throw new Error(
              "Could not reach the database to get the base Pokemon",
            );
          case "PokemonNotFoundError":
            pokemon = null;
            break;
          default:
            const _exhaustiveCheck: never = err;
            throw new Error("Unknow error");
        }
      },
    }),
  );

  if (pokemon === null || pokemon === undefined) {
    throw new Error("Base Pokémon not found in the database");
  }

  /* ... */
  // ---cut-start---
  return pokemon;
  // ---cut-end---
}
```

Can you believe your own eyes? We have a type annotation in an error! 🥳
This means that we can exhaustively check all the possible ways our Effect would fail and act accordingly.

The `default` case in the switch is there to make sure that we don't forget to cover all the cases.
If tomorrow, `eGetPokemonById` starts failing with a new error, we'll be notified by the compiler since the constant `_exhaustiveCheck` will no longer have the type `never` as it does now.

We can still do a bit better, though.

The fact that we are performing assignments in the success case and error catcher was just so that we would get away with type-checking for the following lines of execution. I'd say we should stick to returning and throwing.

```ts twoslash
// @filename: data.ts

export type Pokemon = {
  id: number;
  name: string;
  evolutionId: number | null;
};

export const DATA: Array<Pokemon> = [
  /* ... */
];

// @filename: sdk-effect.ts
import { Data, Effect } from "effect";
import { DATA, type Pokemon } from "./data";

export class ApiDownError extends Data.TaggedError("ApiDownError")<{}> {}
export class PokemonNotFoundError extends Data.TaggedError(
  "PokemonNotFoundError",
)<{}> {}

export const eGetPokemonById = (id: number) =>
  Effect.gen(function* () {
    if (Math.random() < 0.3) return yield* Effect.fail(new ApiDownError());

    const pokemon = DATA.find((p) => p.id === id);

    if (pokemon === undefined) {
      return yield* Effect.fail(new PokemonNotFoundError());
    }

    return pokemon;
  });
// ---cut-before---
// @filename: pokedex.ts
import { Effect } from "effect";
import { type Pokemon } from "./data";
import { eGetPokemonById } from "./sdk-effect";

export function getEvolution(basePokemonId: number): Pokemon | undefined {
  const pokemon = Effect.runSync(
    //  ^?
    Effect.match(eGetPokemonById(basePokemonId), {
      onSuccess: (result) => result,
      onFailure: (err) => {
        switch (err._tag) {
          case "ApiDownError":
            throw new Error(
              "Could not reach the database to get the base Pokemon",
            );
          case "PokemonNotFoundError":
            throw new Error("Base Pokemon not found in the database");
          default:
            const _exhaustiveCheck: never = err;
            throw new Error("Unknow error");
        }
      },
    }),
  );

  // These are no longer necessary
  // if (pokemon === null || pokemon === undefined) {
  //   throw new Error("Base Pokémon not found in the database");
  // }

  /* ... */
  // ---cut-start---
  return pokemon as Pokemon;
  // ---cut-end---
}
```

But there's more!

### Piping Effects

If you read the code top to bottom, you're going to interpret it as 'I'm matching a result with functions for its possible states'. This is not a natural understanding of how the code runs. I'd say that we run the Effect, and **streamline** the success or failure of said Effect.

But how do we streamline results? We **pipe** them.

```ts twoslash
// @filename: data.ts

export type Pokemon = {
  id: number;
  name: string;
  evolutionId: number | null;
};

export const DATA: Array<Pokemon> = [
  /* ... */
];

// @filename: sdk-effect.ts
import { Data, Effect } from "effect";
import { DATA, type Pokemon } from "./data";

export class ApiDownError extends Data.TaggedError("ApiDownError")<{}> {}

export class PokemonNotFoundError extends Data.TaggedError(
  "PokemonNotFoundError",
)<{}> {}

export const eGetPokemonById = (id: number) =>
  Effect.gen(function* () {
    if (Math.random() < 0.3) return yield* Effect.fail(new ApiDownError());

    const pokemon = DATA.find((p) => p.id === id);

    if (pokemon === undefined) {
      return yield* Effect.fail(new PokemonNotFoundError());
    }

    return pokemon;
  });
// ---cut-before---
// @filename: pokedex.ts
import { Effect, pipe } from "effect";
//               ^^^^
import { type Pokemon } from "./data";
import { eGetPokemonById } from "./sdk-effect";

export function getEvolution(basePokemonId: number): Pokemon | undefined {
  const pokemon = Effect.runSync(
    pipe(
      // Input — Given and passed down the the first element of the pipe
      basePokemonId,

      // First element of the pipe — Takes the input and processes it
      eGetPokemonById,

      // Second element of the pipe — Takes the result of the first element
      // and 'injects' it as the first param of this following function
      Effect.match({
        onSuccess: (result) => result,
        onFailure: (err) => {
          switch (err._tag) {
            case "ApiDownError":
              throw new Error(
                "Could not reach the database to get the base Pokemon",
              );
            case "PokemonNotFoundError":
              throw new Error("Base Pokemon not found in the database");
            default:
              const _exhaustiveCheck: never = err;
              throw new Error("Unknow error");
          }
        },
      }),
    ),
  );

  /* ... */
  // ---cut-start---
  return pokemon as Pokemon;
  // ---cut-end---
}
```

> The execution of a pipe `pipe(input, f1, f2)` is to be taught of as `f2(f1(input))`.
> It inverts the order of declaration with the order of execution.
> Depending on what you're doing, you may prefer one over the other for readability.
> Pipe **notation** is particularly handy when the processing of the input is complex.

> Piping is a powerful pattern that exists in many other languages.
> For instance, in shell scripting, the `|` character is used to pipe the output of one command to the input of another, eg `ls | grep file-i-am-lookig-for.ts`.
> There's even a [proposal to include a pipe operator in JavaScript](https://github.com/tc39/proposal-pipeline-operator).

It's noteworthy that the `Effect.match` function went from taking two parameters to a single one. When in a pipe, this function goes roughly from

This is due to the nature of the [Dual APIs](https://effect.website/docs/code-style/dual/), which summarised for this example is the fact that:

1. `Effect.match` takes two arguments in the wild: `Effect.match(anEffect, matcherOptions)`
2. But when in a `pipe`, it takes the shape`Effect.match(matcherOptions)` and the first argument is the previous element of the `pipe`.

The final refactoring for this post is as follows:

```ts twoslash
// @filename: data.ts

export type Pokemon = {
  id: number;
  name: string;
  evolutionId: number | null;
};

export const DATA: Array<Pokemon> = [
  /* ... */
];

// @filename: sdk-effect.ts
import { Data, Effect } from "effect";
import { DATA, type Pokemon } from "./data";

export class ApiDownError extends Data.TaggedError("ApiDownError")<{}> {}

export class PokemonNotFoundError extends Data.TaggedError(
  "PokemonNotFoundError",
)<{}> {}

export const eGetPokemonById = (id: number) =>
  Effect.gen(function* () {
    if (Math.random() < 0.3) return yield* Effect.fail(new ApiDownError());

    const pokemon = DATA.find((p) => p.id === id);

    if (pokemon === undefined) {
      return yield* Effect.fail(new PokemonNotFoundError());
    }

    return pokemon;
  });
// ---cut-before---
// @filename: pokedex.ts
import { Effect, pipe } from "effect";
//               ^^^^
import { type Pokemon } from "./data";
import { eGetPokemonById } from "./sdk-effect";

export function getEvolution(basePokemonId: number): Pokemon | undefined {
  const pokemon = Effect.runSync(
    pipe(
      basePokemonId,

      eGetPokemonById,

      Effect.match({
        onSuccess: (result) => result,
        onFailure: (err) => {
          switch (err._tag) {
            case "ApiDownError":
              throw new Error(
                "Could not reach the database to get the base Pokemon",
              );
            case "PokemonNotFoundError":
              throw new Error("Base Pokemon not found in the database");
            default:
              const _exhaustiveCheck: never = err;
              throw new Error("Unknow error");
          }
        },
      }),
    ),
  );

  if (pokemon.evolutionId === null) throw new Error("No evolution");

  return Effect.runSync(
    pipe(
      pokemon.evolutionId,

      eGetPokemonById,

      Effect.match({
        onSuccess: (result) => result,
        onFailure: (err) => {
          switch (err._tag) {
            case "ApiDownError":
              throw new Error(
                "Could not reach the database to get the evolution Pokemon",
              );
            case "PokemonNotFoundError":
              throw new Error("Pokemon evolution not found in the database");
            default:
              const _exhaustiveCheck: never = err;
              throw new Error("Unknow error");
          }
        },
      }),
    ),
  );
}
```

On this last snippet, I would ask you to tinker on the following:

- Can you pipe a pipe?
- Can we now abstract away our error handling?

## Conclusion

Effects are similar to functions in that they are to indicate execution but require a different syntax.

We rewrote our SDK functions with the following equivalences:

|                | TypeScript                          | Effect                                                     |
| -------------- | ----------------------------------- | ---------------------------------------------------------- |
| Errors         | `ts class MyError extends Error {}` | `class MyError extends Data.TaggedError("MyError")<{}> {}` |
| Function body  | `{ /* ... */ }`                     | `Effect.gen(function* () { /* ... */ })`                   |
| Error throwing | `throw new MyError()`               | `return yield* Effect.fail(new MyError())`                 |
| Returning      | `return result`                     | `return result`                                            |

This different syntax grants us the power of knowing for sure what success and failures look like.

Effects, as they are inert, need to be run. We used `Effect.runSync` to do so.

You don't necessarily need to run an Effect right away, you may declare what should happen when you unwrap it. We did so with `Effect.match`.

We streamline results of Effects with the pipe function which results in a more readable code.

## What's next?

In the next post, we'll delve deeper on how to connect Effects with the `pipe` function and describe another way of thinking about Effects.
