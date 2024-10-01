import { generateCodeVerifier, generateState } from "arctic";
import { Context, Data, Effect, Layer } from "effect";

export class GenerateStateError extends Data.TaggedError("GenerateStateError")<{
  message: string;
}> {}

export class GenerateCodeVerifierError extends Data.TaggedError(
  "GenerateCodeVerifierError",
)<{
  message: string;
}> {}

export class OauthStateGenerator extends Context.Tag("OauthStateGenerator")<
  OauthStateGenerator,
  {
    generateState: Effect.Effect<string, GenerateStateError>;
    generateCodeVerifier: Effect.Effect<string, GenerateCodeVerifierError>;
  }
>() {
  static nodeLive = Layer.succeed(this, {
    generateCodeVerifier: Effect.try(() => generateCodeVerifier()).pipe(
      Effect.catchTags({
        UnknownException: (e) =>
          Effect.fail(new GenerateCodeVerifierError({ message: e.message })),
      }),
      Effect.withSpan("OauthStateGenerator.generateCodeVerifier"),
    ),
    generateState: Effect.try(() => generateState()).pipe(
      Effect.catchTags({
        UnknownException: (e) =>
          Effect.fail(new GenerateStateError({ message: e.message })),
      }),
      Effect.withSpan("OauthStateGenerator.generateState"),
    ),
  });
}
