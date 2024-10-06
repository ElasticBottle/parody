import { generateCodeVerifier, generateState } from "arctic";
import { Effect, Layer } from "effect";
import { GenerateCodeVerifierError, GenerateStateError } from "../errors";

export class Random extends Effect.Tag("@cubeflair/oauth/Random")<
  Random,
  {
    generateState: () => Effect.Effect<string, GenerateStateError>;
    generateCodeVerifier: () => Effect.Effect<
      string,
      GenerateCodeVerifierError
    >;
  }
>() {
  static nodeLayer = Layer.succeed(this, {
    generateCodeVerifier: () =>
      Effect.try(() => generateCodeVerifier()).pipe(
        Effect.catchTags({
          UnknownException: (e) =>
            Effect.fail(new GenerateCodeVerifierError({ message: e.message })),
        }),
        Effect.withSpan("@cubeflair/oauth/Random.generateCodeVerifier"),
      ),
    generateState: () =>
      Effect.try(() => generateState()).pipe(
        Effect.catchTags({
          UnknownException: (e) =>
            Effect.fail(new GenerateStateError({ message: e.message })),
        }),
        Effect.withSpan("@cubeflair/oauth/Random.generateState"),
      ),
  });
}

export const createNonce = Effect.gen(function* () {
  const oauthRandom = yield* Random;
  const state = yield* oauthRandom.generateState();
  const codeVerifier = yield* oauthRandom.generateCodeVerifier();
  return { state, codeVerifier };
});
