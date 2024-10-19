import { sha256 } from "@oslojs/crypto/sha2";
import { encodeBase64urlNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { Effect, Layer } from "effect";

export class RandomValue extends Effect.Tag("@cubeflair/services/RandomValue")<
  RandomValue,
  {
    next(length?: number): Effect.Effect<string>;
    nextWithHash(
      length?: number,
    ): Effect.Effect<{ value: string; hash: string }>;
  }
>() {
  static layer = Layer.sync(this, () => {
    const randomValue = (length = 32) =>
      Effect.sync(() => {
        const randomValues = new Uint8Array(length);
        crypto.getRandomValues(randomValues);
        return encodeBase64urlNoPadding(randomValues);
      }).pipe(
        Effect.withSpan("RandomValue.next"),
        Effect.tap(() => Effect.annotateCurrentSpan("length", length)),
      );
    return {
      next: randomValue,
      nextWithHash: (length = 32) =>
        Effect.gen(function* () {
          const value = yield* randomValue(length);
          const hash = encodeHexLowerCase(
            sha256(new TextEncoder().encode(value)),
          );
          return { value, hash };
        }).pipe(
          Effect.withSpan("RandomValue.nextWithHash"),
          Effect.tap(() => Effect.annotateCurrentSpan("length", length)),
        ),
    };
  });
}

export const createOauthNonce = Effect.gen(function* () {
  const random = yield* RandomValue;
  const state = yield* random.next();
  const codeVerifier = yield* random.next();
  return { state, codeVerifier };
});
