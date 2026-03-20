---
title: "Introduction to Effect.ts with Pokémon (3/n)"
pubDate: "2026-03-19T11:00:00.000-06:00"
description: "Effects are boxes. In this blog post we are going to employ an office analogy to understand better what Effects are and how to pipe them. "
author: "Carlos Chida"
category: "Software"
tags: ["effect", "typescript", "error"]
image: "/blog/futuristic-office.webp"
---

Welcome back once again, this time to the third part of the series Introduction to Effect.ts with Pokémon. In this installment, we are going to make another analogy to understand the concept of Effects that will help us to streamline processes.

## Effects are boxes

Picture an office where there are multiple people working at desks. Each desk has a label on it such as this.

> Desk name: eGetPokemonById
>
> Give me an id
>
> I'll give you the corresponding Pokémon card
>
> I may instead give you an error report card: ApiDown, PokemonNotFound

At this desk, whenever you tell the person behind, they do _something_ (in this case they may look into their archive and look for the Pokémon card, but it we shouldn't care), and at the end they give us a box.

This box is labelled:

> Pokemon card
>
> or
>
> Error report card: ApiDown, PokemonNotFound

This box may contain a green folder labelled `Pokemon` or one of the two: a red folder labelled `ApiDown` or a red folder labelled `PokemonNotFound`.

The desk and the person behind it are a function that returns a box, and this box is an Effect.

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

// @filename: index.ts
import { Effect, Data } from "effect";
import { Pokemon } from "./data";

export class ApiDownError extends Data.TaggedError("ApiDownError")<{}> {}
export class PokemonNotFoundError extends Data.TaggedError(
  "PokemonNotFoundError",
)<{}> {}

// ---cut-before---
declare function eGetPokemonById(
  pokemonId: number,
): Effect.Effect<Pokemon, ApiDownError | PokemonNotFoundError>;
```

Now imagine another desk to which you give a Pokémon card, and it tells you the id of its evolution (really silly job as you just need to read the card, but play along.)

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

// @filename: index.ts
import { Effect, Data } from "effect";
import { Pokemon } from "./data";

export class ApiDownError extends Data.TaggedError("ApiDownError")<{}> {}
export class PokemonNotFoundError extends Data.TaggedError(
  "PokemonNotFoundError",
)<{}> {}
export class NoEvolutionError extends Data.TaggedError(
  "NoEvolutionError",
)<{}> {}

declare function eGetPokemonById(
  pokemonId: number,
): Effect.Effect<Pokemon, ApiDownError | PokemonNotFoundError>;
// ---cut-before---
declare function eGetPokemonEvolutionId(
  pokemon: Pokemon,
): Effect.Effect<number, NoEvolutionError>;
```

From the previous post, our Pavlovian reflex may say just `pipe` it! Let's try it.

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

// @filename: index.ts
import { Data, Effect, pipe } from "effect";
import { Pokemon } from "./data";

export class ApiDownError extends Data.TaggedError("ApiDownError")<{}> {}
export class PokemonNotFoundError extends Data.TaggedError(
  "PokemonNotFoundError",
)<{}> {}
export class NoEvolutionError extends Data.TaggedError(
  "NoEvolutionError",
)<{}> {}
declare function eGetPokemonById(
  pokemonId: number,
): Effect.Effect<Pokemon, ApiDownError | PokemonNotFoundError>;

declare function eGetPokemonEvolutionId(
  pokemon: Pokemon,
): Effect.Effect<number, NoEvolutionError>;
// ---cut-before---
// @errors: 2345
const partialResult = pipe(
  1, // Input
  eGetPokemonById, // f1
  eGetPokemonEvolutionId, // f2
);
```

So what on Earth does that mean? As usual, complex TS errors are hard to understand. We may enhance at least the readability with some plugins, but since I wouldn't know how to install it in this blog, let's break it down here.

1. `Argument of type '(pokemonId: number) => Effect.Effect<Pokemon, ApiDownError | PokemonNotFoundError, never>'...` refers to `f1` which is in the middle of the pipe.
2. `... is not assignable to parameter of type '(a: 1) => Pokemon` is sandwich type (yes, I just baptised it so) which corresponds to a function that takes a number and returns a Pokemon:
   1. The expected type of the parameter comes from the fact that `input` is a number,
   2. And the expected return type comes from the fact that `f2` requires a `Pokemon` as parameter.
3. The rest is just telling us how `Effect.Effect<Pokemon, ...>` and `Pokemon` differ.

This must mean that `f1` is wrong, right? Well... Yes and no. If we comment out `f2` instead, the pipe does work!

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

// @filename: index.ts
import { Data, Effect, pipe } from "effect";
import { Pokemon } from "./data";

export class ApiDownError extends Data.TaggedError("ApiDownError")<{}> {}
export class PokemonNotFoundError extends Data.TaggedError(
  "PokemonNotFoundError",
)<{}> {}
export class NoEvolutionError extends Data.TaggedError(
  "NoEvolutionError",
)<{}> {}
declare function eGetPokemonById(
  pokemonId: number,
): Effect.Effect<Pokemon, ApiDownError | PokemonNotFoundError>;

declare function eGetPokemonEvolutionId(
  pokemon: Pokemon,
): Effect.Effect<number, NoEvolutionError>;
// ---cut-before---
const partialResult = pipe(
  1, // Input
  eGetPokemonById, // f1
  // eGetPokemonEvolutionId // f2
);
```

This is obvious from the fact that `eGetPokemonById` takes an integer which is the input of the pipe.

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

// @filename: index.ts
import { Data, Effect, pipe } from "effect";
import { Pokemon } from "./data";

export class ApiDownError extends Data.TaggedError("ApiDownError")<{}> {}
export class PokemonNotFoundError extends Data.TaggedError(
  "PokemonNotFoundError",
)<{}> {}
export class NoEvolutionError extends Data.TaggedError(
  "NoEvolutionError",
)<{}> {}
declare function eGetPokemonById(
  pokemonId: number,
): Effect.Effect<Pokemon, ApiDownError | PokemonNotFoundError>;

declare function eGetPokemonEvolutionId(
  pokemon: Pokemon,
): Effect.Effect<number, NoEvolutionError>;
// ---cut-before---
const partialResult = eGetPokemonById(1);
//    ^?
```

With the first pipe, what we tried is equivalent to this:

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

// @filename: index.ts
import { Data, Effect, pipe } from "effect";
import { Pokemon } from "./data";

export class ApiDownError extends Data.TaggedError("ApiDownError")<{}> {}
export class PokemonNotFoundError extends Data.TaggedError(
  "PokemonNotFoundError",
)<{}> {}
export class NoEvolutionError extends Data.TaggedError(
  "NoEvolutionError",
)<{}> {}
declare function eGetPokemonById(
  pokemonId: number,
): Effect.Effect<Pokemon, ApiDownError | PokemonNotFoundError>;

declare function eGetPokemonEvolutionId(
  pokemon: Pokemon,
): Effect.Effect<number, NoEvolutionError>;
// ---cut-before---
// @errors: 2345
const partialResult = eGetPokemonEvolutionId(eGetPokemonById(1));
```

The problem is ours: we are giving a box to our `eGetPokemonEvolutionId` worker, when he expects a green folder labelled `Pokemon`.

This worker is not going to open the box and just to maybe find a red folder!

### Couriers carry boxes

Instead of having a worker talk to another worker directly and figure out the details of what to do when a red folder is in the box, we are going to introduce a courier.

This courier picks up the box from the desk of the first box, peaks inside, and if he finds a green folder, he takes it to the next desk. Otherwise, he is going to _short circuit_, ie he will instead terminate the process holding the red folder.

The name of this courier is `Effect.andThen`, and he works like this:

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

// @filename: index.ts
import { Data, Effect, pipe } from "effect";
import { Pokemon } from "./data";

export class ApiDownError extends Data.TaggedError("ApiDownError")<{}> {}
export class PokemonNotFoundError extends Data.TaggedError(
  "PokemonNotFoundError",
)<{}> {}
export class NoEvolutionError extends Data.TaggedError(
  "NoEvolutionError",
)<{}> {}
declare function eGetPokemonById(
  pokemonId: number,
): Effect.Effect<Pokemon, ApiDownError | PokemonNotFoundError>;

declare function eGetPokemonEvolutionId(
  pokemon: Pokemon,
): Effect.Effect<number, NoEvolutionError>;
// ---cut-before---
const partialResult = pipe(
  1, // Input
  eGetPokemonById, // f1
  Effect.andThen(eGetPokemonEvolutionId), // 👈 f2
);
```

To get a better feeling of what `Effect.andThen` is doing, let's extend `f2`:

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

// @filename: index.ts
import { Data, Effect, pipe } from "effect";
import { Pokemon } from "./data";

export class ApiDownError extends Data.TaggedError("ApiDownError")<{}> {}
export class PokemonNotFoundError extends Data.TaggedError(
  "PokemonNotFoundError",
)<{}> {}
export class NoEvolutionError extends Data.TaggedError(
  "NoEvolutionError",
)<{}> {}
declare function eGetPokemonById(
  pokemonId: number,
): Effect.Effect<Pokemon, ApiDownError | PokemonNotFoundError>;

declare function eGetPokemonEvolutionId(
  pokemon: Pokemon,
): Effect.Effect<number, NoEvolutionError>;
// ---cut-before---
const partialResult = pipe(
  1, // Input
  eGetPokemonById, // f1
  Effect.andThen((x) => eGetPokemonEvolutionId(x)), // 👈 f2
  //              ^?
);
```

Just as expected, our `Effect.andThen` is delivering a green folder to the next desk.

But what were we on about when we said that `Effect.andThen` may short circuit?

Well, you're in for a nice surprise! In our analogy, `pipe` is a task manager, and he gets informed right away by a courier when this one sneaks into a box with a red folder. In types, it looks like this:

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

// @filename: index.ts
import { Data, Effect, pipe } from "effect";
import { Pokemon } from "./data";

export class ApiDownError extends Data.TaggedError("ApiDownError")<{}> {}
export class PokemonNotFoundError extends Data.TaggedError(
  "PokemonNotFoundError",
)<{}> {}
export class NoEvolutionError extends Data.TaggedError(
  "NoEvolutionError",
)<{}> {}
declare function eGetPokemonById(
  pokemonId: number,
): Effect.Effect<Pokemon, ApiDownError | PokemonNotFoundError>;

declare function eGetPokemonEvolutionId(
  pokemon: Pokemon,
): Effect.Effect<number, NoEvolutionError>;
// ---cut-before---
const partialResult = pipe(
  //  ^?
  1, // Input
  eGetPokemonById, // f1
  Effect.andThen((x) => eGetPokemonEvolutionId(x)), // f2
);
```

The task manager `pipe` is now telling us that he will deliver a box that may contain one of the two:

- A green folder labelled `number`
- A red folder labelled `ApiDownError`, `PokemonNotFoundError` or `PokemonNotFoundError`

You heard that right, `pipe` auto-magically joins the types of errors that any of the desks involved in the task may fail with.

But the task manager can't give a box back to a customer. A customer demands an explanation.

### Task managers delegate delivery

As many managers do at big corporations do, our task manager has a tee time coming soon at his favourite golf club. He's not going to write the report for the user. He's just going to deliver it. So he delegates.

This poor overworked employee who writes down the report is called `Effect.match`.

Out report writer `Effect.match` is special in the sense that he does get boxes delivered regardless of the colour of the folder contained therein and he usually does not give back a box.

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

// @filename: index.ts
import { Data, Effect, pipe } from "effect";
import { Pokemon } from "./data";

export class ApiDownError extends Data.TaggedError("ApiDownError")<{}> {}

export class PokemonNotFoundError extends Data.TaggedError(
  "PokemonNotFoundError",
)<{}> {}

export class NoEvolutionError extends Data.TaggedError(
  "NoEvolutionError",
)<{}> {}

declare function eGetPokemonById(
  pokemonId: number,
): Effect.Effect<Pokemon, ApiDownError | PokemonNotFoundError>;

declare function eGetPokemonEvolutionId(
  pokemon: Pokemon,
): Effect.Effect<number, NoEvolutionError>;

// ---cut-before---
const partialResult = pipe(
  //  ^?
  1, // Input
  eGetPokemonById, // f1
  Effect.andThen(eGetPokemonEvolutionId), // f2

  Effect.match({
    onSuccess: (evolutionId) =>
      `The id of the evolution of the original pokemon is ${evolutionId}`,

    onFailure: (err) => {
      switch (err._tag) {
        case "ApiDownError":
          return "The archive is temporarily unavailable";
        case "PokemonNotFoundError":
          return "We couldn't find your base Pokemon in the archive";
        case "NoEvolutionError":
          return "The pokemon whose id you gave us, does not have an evolution";
      }
    },
  }),
);
```

When the task manager comes back from an extenuating 18 holes, he's happy.

As we can see in the type anotation, he finds out that he always has words to talk back to the customer (`string`) and he `never` has a red folder to deliver.

## Handling Pokémon in our office

With this new analogy, we are fully armed to tackle our original problem once and for all.

Let us remember the last state in which we had our `getEvolution` function in our Pokédex.

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
              throw new Error("Unknown error");
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
              throw new Error("Unknown error");
          }
        },
      }),
    ),
  );
}
```

With the introduction of our `Effect.match` courier, we would have instead:

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
import { Data, Effect, pipe } from "effect";
import { type Pokemon } from "./data";
import { eGetPokemonById } from "./sdk-effect";

class NoEvolutionError extends Data.TaggedError("NoEvolutionError")<{}> {}

export function getEvolution(basePokemonId: number): Pokemon {
  const pokemon = Effect.runSync(
    pipe(
      // input
      basePokemonId,

      // f1
      eGetPokemonById,

      // f2
      Effect.andThen((pkm) =>
        Effect.gen(function* () {
          // This corresponds roughly to our previous to the line:
          // if (pokemon.evolutionId === null) throw new Error("No evolution");
          if (pkm.evolutionId === null) {
            return yield* Effect.fail(new NoEvolutionError());
          }

          return pkm.evolutionId;
        }),
      ),

      // f3
      Effect.andThen(eGetPokemonById),

      // f4
      Effect.match({
        onSuccess: (result) => result,
        onFailure: (err) => {
          switch (err._tag) {
            case "ApiDownError":
              throw new Error("Could not reach the database");
            case "PokemonNotFoundError":
              throw new Error("Pokemon not found in the database");
            case "NoEvolutionError":
              throw new Error("No evolution");
            default:
              const _exhaustiveCheck: never = err;
              throw new Error("Unknown error");
          }
        },
      }),
    ),
  );

  return pokemon;
}
```

By introducing a `TaggedError` of our own, we have now a seamless streamlined way to handle errors.

Our job here is done, and now we can leave the office to our own tee time.

But... As we are bragging about our success to our caddy, we get a call from Pallet Town in which the man, the myth, the legend, [Professor Samuel Oak](https://en.wikipedia.org/wiki/Professor_Oak) is annoyed on the other side of the line:

> My Pokédex is broken! I can't tell if the base Pokémon couldn't be fetched or its evolution.

😰 We screwed up!

In the most dramatic fashion, we drop our Pikachu-themed carry bag and rush back to the office.

We discuss with the team and make notes:

1. You deliver `basePokemonId` (`input` in the code comments) to the `eGetPokemonById` (`f1`) desk,
2. Then (`f2`) an `Effect.andThen` courier delivers the result to a floating desk where they extract the `evolutionId`, if there's one,
3. Another `Effect.andThen` courier delivers the result to the same (or another) `eGetPokemonById` desk as per `f3`,
4. Finally, `Effect.match` writes the report at `f4`.

You approach, `Effect.match` and enquire: 'Why don't you tell me whether it was the base Pokémon or the evolution that failed?' He calmly replies: 'Because I'm not a detective! I don't have the information! I get a box with a green folder labelled `Pokemon` or one of the red folders you talked about. Nowhere does it say what if it's the base or the evolution when they can't find it in the archive.' He's right.

Annoyed yourself now, you approach one of the `eGetPokemonById` desks and demand: 'From now on, you are to label whether your results with "base" or "evolution".' He ain't taking it — he challenges back: 'And what if it's the evolution of the evolution? I get dropped this green folders that just say `Pokemon`! And they are tons, I don't have time to your incognizant process change.' He's also right.

Time for a change of strategy... This young courier `Effect.andThen` is a young lad; he's surely eager to grow within the company. 'Hey, `andThen`, how's life?' and before he utters the first word, you start speaking again. 'Listen, a favour: from now on, you are going to label tell `eGetPokemonById` whether the folder you're devlivering is from a base Pokémon or an evolution.'

With the strongest of the Spanish accents, he replies: '[E**b**olutions?](https://youtu.be/VeLjFRPPvuY?si=npV_g28qzh-0YDvY)! You know I'm still attending [U**b**a](https://pokemon.fandom.com/wiki/Naranja_and_Uva_Academies), no? I not know about those yet. I'm here only as a part-time, I'm going to be a Pokémon trainer!' Then he swiftly resumes watching the 2022 World Champion encounter of Ash Ketchum v Leon on his phone. You become short for words at the dismay of the academic level of Uva Academy, but arrogantly accept it as you graduated from Naranja.

Behind the glass door of your corner office, you see everyone leaving for the day while you regret all of your life decisions and ponder the future of your career. As you start packing... Someone knocks on your door...

## Conclusion

Once again we have max'ed out our attention span. But we have learnt some new things:

- Effects can be taught of as boxes that contain either a green folder (success) or a red one (failure),
- Functions that return an Effect are desks,
- Work between two desks is passeed arount by an `Effect.andThen` courier,
- The `Effect.match` report writer is really grumpy.

We also learnt how to disect the errors TS throws at us when something goes wrong in a `pipe`.

## What's next?

That mysterious knock on the door is the forthcoming of your new people that were recently hired. Could one of them help you?

Find out in the next blog post!
