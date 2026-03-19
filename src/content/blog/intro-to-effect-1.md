---
title: "Introduction to Effect.ts with Pokémon (1/n)"
pubDate: "2026-03-16T12:00:00.000-06:00"
description: "Gotta catch 'em bugs!"
author: "Carlos Chida"
category: "Software"
tags: ["effect", "typescript", "error"]
image: "/blog/pokemon-tech-bug.webp"
---

# Introduction to Effect.ts with Pokémon

When we code, we usually focus on the happy path because it's the case we toil
for until we get it right. JavaScript —and TypeScript, for that matter— are not
particularly useful for handling errors.

We'll start in Pallet Town where everything is nice and easy and will march all
the way to Victory Road while defeating the Team Rocket of bugs.

## Pokémon

For those of you who didn't have the joy of experiencing the most addictive game
of the early 2000's or didn't see the cartoon, this is the theme: a trainer
catches Pokémon (the plural of Pokémon is, against all common sense, apparently
also just Pokémon) and trains them by fighting to increase their level. Once
they reach a certain level, some **but not all** evolve into other Pokémon.

Given that there are currently over 1,000 Pokémon, there's a device called
Pokédex that helps trainers keep track of their Pokémon and present them with
information. We're gonna code a simple evolution viewer of a Pokédex.

## The Code

We have partial db entries that will do the trick.

```ts twoslash
// @filename: data.ts

export type Pokemon = {
  id: number;
  name: string;
  evolutionId: number | null;
};

export const DATA: Array<Pokemon> = [
  { id: 1, name: "Bulbasaur", evolutionId: 2 },
  { id: 2, name: "Ivysaur", evolutionId: 3 },
  { id: 3, name: "Venusaur", evolutionId: null },

  { id: 4, name: "Charmander", evolutionId: 5 },
  { id: 5, name: "Charmeleon", evolutionId: 7 },
  { id: 6, name: "Charizard", evolutionId: null },

  { id: 7, name: "Squirtle", evolutionId: 8 },
  { id: 8, name: "Wartortle", evolutionId: 9 },
  { id: 9, name: "Blastoise", evolutionId: null },

  // ...
];
// ---cut-after---
// @filename: sdk.ts

import { DATA, type Pokemon } from "./data";

export function getPokemonById(id: number): Pokemon {
  // Simulate a network error
  if (Math.random() < 0.3) throw new Error("API is down");

  const pokemon = DATA.find((pokemon) => pokemon.id === id);
  if (pokemon === undefined) throw new Error("Pokemon not found");

  return pokemon;
}

// @filename: pokedex.ts

import { type Pokemon } from "./data";
import { getPokemonById } from "./sdk";

export function getEvolution(basePokemonId: number): Pokemon {
  const pokemon = getPokemonById(basePokemonId);

  if (pokemon.evolutionId === null) throw new Error("No evolution");

  return getPokemonById(pokemon.evolutionId);
}

// We run this file to test it
console.log(getEvolution(1));
console.log(getEvolution(2));
console.log(getEvolution(3));

// @filename: pokedex.ts

import { type Pokemon } from "./data";
import { getPokemonById } from "./sdk";

export function getEvolution(basePokemonId: number): Pokemon {
  let pokemon: Pokemon | null | undefined;

  try {
    const pokemon = getPokemonById(basePokemonId);
  } catch (err: unknown) {
    throw new Error("Could not obtain base Pokémon", { cause: err });
  }

  if (pokemon === null || pokemon === undefined) {
    throw new Error("Base Pokémon not found in the database");
  }

  if (pokemon.evolutionId === null) throw new Error("No evolution");

  try {
    return getPokemonById(pokemon.evolutionId);
  } catch (err: unknown) {
    throw new Error("Could not obtain evolution Pokémon", { cause: err });
  }
}

// We run this file to test it
console.log(getEvolution(1));
console.log(getEvolution(2));
console.log(getEvolution(3));

// @filename: pokedex.ts

import { type Pokemon } from "./data";
import { getPokemonById } from "./sdk";

//
// Gets the evolution of a Pokémon given its id.
//
// @throws {Error} "Could not reach database to get the base Pokemon"
// @throws {Error} "Base Pokemons not found in the database"
// @throws {Error} "No evolution
// @throws {Error} "Could not reach database to get the evolution Pokemon"
// @throws {Error} "Pokemon evolution not found in the database"
// @throws {Error} "Unknow error"
//
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

  if (pokemon.evolutionId === null) throw new Error("No evolution");

  try {
    return getPokemonById(pokemon.evolutionId);
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.message === "API is down") {
        throw new Error(
          "Could not reach the database to get the evolution Pokemon",
          { cause: err },
        );
      } else if (err.message === "Pokemon not found") {
        throw new Error("Pokemon evolution not found in the database,", {
          cause: err,
        });
      }

      // Because you never know if the SDK will change its behaviour
      throw new Error("Unknow error", { cause: err });
    }
  }
}

// We run this file to test it
console.log(getEvolution(1));
console.log(getEvolution(2));
console.log(getEvolution(3));
```

You can see here that there are some evolution chains:

- `Bulbasaur  -> Ivysaur    -> Venusaur`
- `Charmander -> Charmeleon -> Charizard`
- `Squirtle   -> Wartortle  -> Blastoise`

Now let's assume that we have a third-party SDK that retrieves the data from
the database.

```ts twoslash
// @filename: data.ts

export type Pokemon = {
  id: number;
  name: string;
  evolutionId: number | null;
};

export const DATA: Array<Pokemon> = [
  { id: 1, name: "Bulbasaur", evolutionId: 2 },
  { id: 2, name: "Ivysaur", evolutionId: 3 },
  { id: 3, name: "Venusaur", evolutionId: null },

  { id: 4, name: "Charmander", evolutionId: 5 },
  { id: 5, name: "Charmeleon", evolutionId: 7 },
  { id: 6, name: "Charizard", evolutionId: null },

  { id: 7, name: "Squirtle", evolutionId: 8 },
  { id: 8, name: "Wartortle", evolutionId: 9 },
  { id: 9, name: "Blastoise", evolutionId: null },

  // ...
];
// ---cut-before---
// @filename: sdk.ts

import { DATA, type Pokemon } from "./data";

export function getPokemonById(id: number): Pokemon {
  // Simulate a network error
  if (Math.random() < 0.3) throw new Error("API is down");

  const pokemon = DATA.find((pokemon) => pokemon.id === id);
  if (pokemon === undefined) throw new Error("Pokemon not found");

  return pokemon;
}
// ---cut-after---
// @filename: pokedex.ts

import { type Pokemon } from "./data";
import { getPokemonById } from "./sdk";

export function getEvolution(basePokemonId: number): Pokemon {
  const pokemon = getPokemonById(basePokemonId);

  if (pokemon.evolutionId === null) throw new Error("No evolution");

  return getPokemonById(pokemon.evolutionId);
}

// We run this file to test it
console.log(getEvolution(1));
console.log(getEvolution(2));
console.log(getEvolution(3));

// @filename: pokedex.ts

import { type Pokemon } from "./data";
import { getPokemonById } from "./sdk";

export function getEvolution(basePokemonId: number): Pokemon {
  let pokemon: Pokemon | null | undefined;

  try {
    const pokemon = getPokemonById(basePokemonId);
  } catch (err: unknown) {
    throw new Error("Could not obtain base Pokémon", { cause: err });
  }

  if (pokemon === null || pokemon === undefined) {
    throw new Error("Base Pokémon not found in the database");
  }

  if (pokemon.evolutionId === null) throw new Error("No evolution");

  try {
    return getPokemonById(pokemon.evolutionId);
  } catch (err: unknown) {
    throw new Error("Could not obtain evolution Pokémon", { cause: err });
  }
}

// We run this file to test it
console.log(getEvolution(1));
console.log(getEvolution(2));
console.log(getEvolution(3));

// @filename: pokedex.ts

import { type Pokemon } from "./data";
import { getPokemonById } from "./sdk";

//
// Gets the evolution of a Pokémon given its id.
//
// @throws {Error} "Could not reach database to get the base Pokemon"
// @throws {Error} "Base Pokemons not found in the database"
// @throws {Error} "No evolution
// @throws {Error} "Could not reach database to get the evolution Pokemon"
// @throws {Error} "Pokemon evolution not found in the database"
// @throws {Error} "Unknow error"
//
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

  if (pokemon.evolutionId === null) throw new Error("No evolution");

  try {
    return getPokemonById(pokemon.evolutionId);
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.message === "API is down") {
        throw new Error(
          "Could not reach the database to get the evolution Pokemon",
          { cause: err },
        );
      } else if (err.message === "Pokemon not found") {
        throw new Error("Pokemon evolution not found in the database,", {
          cause: err,
        });
      }

      // Because you never know if the SDK will change its behaviour
      throw new Error("Unknow error", { cause: err });
    }
  }
}

// We run this file to test it
console.log(getEvolution(1));
console.log(getEvolution(2));
console.log(getEvolution(3));
```

And now finally, we have the Pokédex that we are programming.

```ts twoslash
// @filename: data.ts

export type Pokemon = {
  id: number;
  name: string;
  evolutionId: number | null;
};

export const DATA: Array<Pokemon> = [
  { id: 1, name: "Bulbasaur", evolutionId: 2 },
  { id: 2, name: "Ivysaur", evolutionId: 3 },
  { id: 3, name: "Venusaur", evolutionId: null },

  { id: 4, name: "Charmander", evolutionId: 5 },
  { id: 5, name: "Charmeleon", evolutionId: 7 },
  { id: 6, name: "Charizard", evolutionId: null },

  { id: 7, name: "Squirtle", evolutionId: 8 },
  { id: 8, name: "Wartortle", evolutionId: 9 },
  { id: 9, name: "Blastoise", evolutionId: null },

  // ...
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

export function getEvolution(basePokemonId: number): Pokemon {
  const pokemon = getPokemonById(basePokemonId);

  if (pokemon.evolutionId === null) throw new Error("No evolution");

  return getPokemonById(pokemon.evolutionId);
}

// We run this file to test it
console.log(getEvolution(1));
console.log(getEvolution(2));
console.log(getEvolution(3));
// ---cut-after---
// @filename: pokedex.ts

import { type Pokemon } from "./data";
import { getPokemonById } from "./sdk";

export function getEvolution(basePokemonId: number): Pokemon {
  let pokemon: Pokemon | null | undefined;

  try {
    const pokemon = getPokemonById(basePokemonId);
  } catch (err: unknown) {
    throw new Error("Could not obtain base Pokémon", { cause: err });
  }

  if (pokemon === null || pokemon === undefined) {
    throw new Error("Base Pokémon not found in the database");
  }

  if (pokemon.evolutionId === null) throw new Error("No evolution");

  try {
    return getPokemonById(pokemon.evolutionId);
  } catch (err: unknown) {
    throw new Error("Could not obtain evolution Pokémon", { cause: err });
  }
}

// We run this file to test it
console.log(getEvolution(1));
console.log(getEvolution(2));
console.log(getEvolution(3));

// @filename: pokedex.ts

import { type Pokemon } from "./data";
import { getPokemonById } from "./sdk";

//
// Gets the evolution of a Pokémon given its id.
//
// @throws {Error} "Could not reach database to get the base Pokemon"
// @throws {Error} "Base Pokemons not found in the database"
// @throws {Error} "No evolution
// @throws {Error} "Could not reach database to get the evolution Pokemon"
// @throws {Error} "Pokemon evolution not found in the database"
// @throws {Error} "Unknow error"
//
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

  if (pokemon.evolutionId === null) throw new Error("No evolution");

  try {
    return getPokemonById(pokemon.evolutionId);
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.message === "API is down") {
        throw new Error(
          "Could not reach the database to get the evolution Pokemon",
          { cause: err },
        );
      } else if (err.message === "Pokemon not found") {
        throw new Error("Pokemon evolution not found in the database,", {
          cause: err,
        });
      }

      // Because you never know if the SDK will change its behaviour
      throw new Error("Unknow error", { cause: err });
    }
  }
}

// We run this file to test it
console.log(getEvolution(1));
console.log(getEvolution(2));
console.log(getEvolution(3));
```

When we run this code, we will get any of the following errors:

- `API is down`
- `Pokemon not found`
- `No evolution`

All of them are problematic for their own particular reasons, particularly
`Pokemon not found` since we have no information on which Pokémon was not found
in the databasethe base Pokémon or its evolution.
Moreover, all of them kill the program.

We can do better:

```ts twoslash
// @filename: data.ts

export type Pokemon = {
  id: number;
  name: string;
  evolutionId: number | null;
};

export const DATA: Array<Pokemon> = [
  { id: 1, name: "Bulbasaur", evolutionId: 2 },
  { id: 2, name: "Ivysaur", evolutionId: 3 },
  { id: 3, name: "Venusaur", evolutionId: null },

  { id: 4, name: "Charmander", evolutionId: 5 },
  { id: 5, name: "Charmeleon", evolutionId: 7 },
  { id: 6, name: "Charizard", evolutionId: null },

  { id: 7, name: "Squirtle", evolutionId: 8 },
  { id: 8, name: "Wartortle", evolutionId: 9 },
  { id: 9, name: "Blastoise", evolutionId: null },

  // ...
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

export function getEvolution(basePokemonId: number): Pokemon {
  let pokemon: Pokemon | null | undefined;

  try {
    const pokemon = getPokemonById(basePokemonId);
  } catch (err: unknown) {
    throw new Error("Could not obtain base Pokémon", { cause: err });
  }

  if (pokemon === null || pokemon === undefined) {
    throw new Error("Base Pokémon not found in the database");
  }

  if (pokemon.evolutionId === null) throw new Error("No evolution");

  try {
    return getPokemonById(pokemon.evolutionId);
  } catch (err: unknown) {
    throw new Error("Could not obtain evolution Pokémon", { cause: err });
  }
}

// We run this file to test it
console.log(getEvolution(1));
console.log(getEvolution(2));
console.log(getEvolution(3));
```

The first thing to notice is that `unknown` is the right type for any caught
error in a try-catch block. That's correct, the type is not `Error` as in JS/TS
you can throw anything, a string, an error, or any other object.

Moreover, if the SDK is written in TS, unless you dig deep in the code, you'll
only see the declaration of the function:

```ts twoslash
// @filename: sdk.d.ts
declare function getPokemon(id: number): Pokemon;
```

Absolutely nowhere in the code it's indicated that the function can throw an
error of the type `Error` nor is it stated what the message of that error is.

In other words, you would need a lot of trial an error and reading documentation
to manage what can, and almost entirely certain, will go wrong. If you're nice
to your colleagues and/or to your future self in the future, you'll document it.

```ts twoslash
// @filename: data.ts

export type Pokemon = {
  id: number;
  name: string;
  evolutionId: number | null;
};

export const DATA: Array<Pokemon> = [
  { id: 1, name: "Bulbasaur", evolutionId: 2 },
  { id: 2, name: "Ivysaur", evolutionId: 3 },
  { id: 3, name: "Venusaur", evolutionId: null },

  { id: 4, name: "Charmander", evolutionId: 5 },
  { id: 5, name: "Charmeleon", evolutionId: 7 },
  { id: 6, name: "Charizard", evolutionId: null },

  { id: 7, name: "Squirtle", evolutionId: 8 },
  { id: 8, name: "Wartortle", evolutionId: 9 },
  { id: 9, name: "Blastoise", evolutionId: null },

  // ...
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

/**
 * Gets the evolution of a Pokémon given its id.
 *
 * @throws {Error} "Could not reach database to get the base Pokemon"
 * @throws {Error} "Base Pokemons not found in the database"
 * @throws {Error} "No evolution
 * @throws {Error} "Could not reach database to get the evolution Pokemon"
 * @throws {Error} "Pokemon evolution not found in the database"
 * @throws {Error} "Unknow error"
 */
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

  if (pokemon.evolutionId === null) throw new Error("No evolution");

  try {
    return getPokemonById(pokemon.evolutionId);
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.message === "API is down") {
        throw new Error(
          "Could not reach the database to get the evolution Pokemon",
          { cause: err },
        );
      } else if (err.message === "Pokemon not found") {
        throw new Error("Pokemon evolution not found in the database,", {
          cause: err,
        });
      }

      // Because you never know if the SDK will change its behaviour
      throw new Error("Unknow error", { cause: err });
    }
  }
}

// We run this file to test it
console.log(getEvolution(1));
console.log(getEvolution(2));
console.log(getEvolution(3));
```

This seemingly innocent function now has a myriad of problems. Let's go over
the most prominent ones:

- **We need to maintain documentation on runtime execution.** The documentation
  contains strings and type definitions that may mismatch the actual
  implementation if the code gets refactored. It's important to remember that
  comments are ignored by the compiler and not even the smartest IDEs will catch
  that. I guess you didn't event catch the mismatch in the accents used in the
  error messages against those in the documentation comments.
- **Tough refactoring of the exception handling.** When seeing similar lines of
  code, our Pavlovian reflex is factoring them into a function. The problem is
  that the handling changes for each step of the process, whether it's the base
  Pokémon or the evolution. Imagine what that would like for a function that
  gets the whole evolution chain.
- **It's ugly!** We have four levels of nesting in that function, arguably
  five if you count the indentation of the formatter. We read code more often
  than we write it. Even if you nail the actual decision tree, will your
  colleagues be able to understand it?

To finish off this section, imagine how you would handle retrying in case of a
network error or if you want to handle a timeout error. How would you
structure the code to make it more readable and maintainable?

## Conclusion

How come are we in the conclusion now? We didn't even speak about Effect.ts.

Well... We just passed the 15-min mark of reading time according to my plugin,
and since our attention spans are shortened by the excessive use of social
media, I decided to split this series into multiple parts.

But the lesson to take is that error handling is tough. And this was only a
single functionality!

Stay tuned for the next part! As soon as I finish it, you'll see it here.

## Update (2026-03-18)

[Here](/blog/intro-to-effect-2) is the next part of the series.
