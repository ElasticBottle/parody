import { KeyValueStore } from "@effect/platform";
import { SystemError } from "@effect/platform/Error";
import { Schema } from "@effect/schema";
import type { ParseError } from "@effect/schema/ParseResult";
import { Context, Effect, Layer, Option } from "effect";
import { Resource } from "sst";

interface ICloudflareKvStore extends KeyValueStore.KeyValueStore {
  setTtl: (
    key: string,
    value: string,
    ttlSeconds: number,
  ) => Effect.Effect<void, SystemError>;
  forSchema: <A, I, R>(
    schema: Schema.Schema<A, I, R>,
  ) => ICloudflareKvStoreSchema<A, R>;
}

interface ICloudflareKvStoreSchema<A, R>
  extends KeyValueStore.SchemaStore<A, R> {
  setTtl: (
    key: string,
    value: A,
    ttlSeconds: number,
  ) => Effect.Effect<void, SystemError | ParseError, R>;
}

export class CloudflareKvStore extends Context.Tag("kv-store/KvStoreWithExpr")<
  CloudflareKvStore,
  ICloudflareKvStore
>() {
  static keyValueStoreImpl = Layer.succeed(
    KeyValueStore.KeyValueStore,
    KeyValueStore.make({
      remove: (key) =>
        Effect.gen(function* () {
          yield* Effect.tryPromise(() => Resource.KvStore.delete(key));
        }).pipe(
          Effect.catchAll((e) =>
            Effect.fail(
              SystemError({
                message: `Failed to delete key: ${e.error}`,
                method: "remove",
                module: "KeyValueStore",
                pathOrDescriptor: key,
                reason: "Unknown",
              }),
            ),
          ),
          Effect.withSpan("CloudflareKvStore.remove"),
        ),
      clear: Effect.gen(function* () {
        yield* Effect.fail(
          SystemError({
            message: "Failed to clear kv store",
            method: "clear",
            module: "KeyValueStore",
            pathOrDescriptor: "",
            reason: "NotFound",
          }),
        );
      }),
      get: (key) =>
        Effect.tryPromise(async () => {
          const result = await Resource.KvStore.get(key, { type: "text" });
          return result ? Option.some(result) : Option.none();
        }).pipe(
          Effect.catchAll((e) =>
            Effect.fail(
              SystemError({
                message: `Failed to get key: ${e.error}`,
                method: "get",
                module: "KeyValueStore",
                pathOrDescriptor: key,
                reason: "NotFound",
              }),
            ),
          ),
          Effect.withSpan("CloudflareKvStore.get"),
        ),
      size: Effect.tryPromise(async () => {
        const keys = await Resource.KvStore.list();
        return keys.keys.length;
      }).pipe(
        Effect.catchAll((e) =>
          Effect.fail(
            SystemError({
              message: `Failed to get size of kv store: ${e.error}`,
              method: "size",
              module: "KeyValueStore",
              pathOrDescriptor: "",
              reason: "NotFound",
            }),
          ),
        ),
        Effect.withSpan("CloudflareKvStore.size"),
      ),
      set: (key, value) =>
        Effect.tryPromise(() => Resource.KvStore.put(key, value)).pipe(
          Effect.catchAll((e) =>
            Effect.fail(
              SystemError({
                message: `Failed to set key: ${e.error}`,
                method: "set",
                module: "KeyValueStore",
                pathOrDescriptor: `key: ${key}, value: ${value}`,
                reason: "Unknown",
              }),
            ),
          ),
        ),
      getUint8Array: (key) =>
        Effect.tryPromise(async () => {
          const result = await Resource.KvStore.get(key, {
            type: "arrayBuffer",
          });
          return result ? Option.some(new Uint8Array(result)) : Option.none();
        }).pipe(
          Effect.catchAll((e) =>
            Effect.fail(
              SystemError({
                message: `Failed to get key for Uint8Array: ${e.error}`,
                method: "get",
                module: "KeyValueStore",
                pathOrDescriptor: key,
                reason: "NotFound",
              }),
            ),
          ),
          Effect.withSpan("CloudflareKvStore.getUint8Array"),
        ),
      modifyUint8Array: (key, f) =>
        Effect.tryPromise(async () => {
          const result = await Resource.KvStore.get(key, {
            type: "arrayBuffer",
          });
          if (result) {
            const newValue = f(new Uint8Array(result));
            await Resource.KvStore.put(key, newValue.buffer);
            return Option.some(newValue);
          }
          return Option.none();
        }).pipe(
          Effect.catchAll((e) =>
            Effect.fail(
              SystemError({
                message: `Failed to modify key for Uint8Array: ${e.error}`,
                method: "modify",
                module: "KeyValueStore",
                pathOrDescriptor: key,
                reason: "NotFound",
              }),
            ),
          ),
          Effect.withSpan("CloudflareKvStore.modifyUint8Array"),
        ),
    }),
  );

  static withTtlLayer = Layer.effect(
    this,
    Effect.gen(function* () {
      const kvStore = yield* KeyValueStore.KeyValueStore;
      const setTtl = (key: string, value: string, ttlSeconds: number) =>
        Effect.tryPromise(() => {
          console.log("key, value", { key, value });
          console.log(`ttlSeconds: ${ttlSeconds}`);
          return Resource.KvStore.put(key, value, {
            expirationTtl: ttlSeconds,
          });
        }).pipe(
          Effect.catchAll((e) => {
            return Effect.fail(
              SystemError({
                message: `Failed to set key with TTL: ${e.error}`,
                method: "setTtl",
                module: "KeyValueStore",
                pathOrDescriptor: `key: ${key}, value: ${value}, ttl: ${ttlSeconds}`,
                reason: "Unknown",
              }),
            );
          }),
          Effect.withSpan("CloudflareKvStore.setTtl"),
        );
      return {
        ...kvStore,
        setTtl,
        forSchema: <A, I, R>(schema: Schema.Schema<A, I, R>) => {
          const jsonSchema = Schema.parseJson(schema);
          const schemaStore = kvStore.forSchema(schema);
          const encode = Schema.encode(jsonSchema);

          const setTtlSchema = (key: string, value: A, ttlSeconds: number) => {
            console.log("key", key);
            console.log("value", value);
            console.log(`ttlSeconds: ${ttlSeconds}`);
            return Effect.flatMap(encode(value), (json) =>
              setTtl(key, json, ttlSeconds),
            );
          };
          return {
            ...schemaStore,
            setTtl: setTtlSchema,
          };
        },
      };
    }),
  );

  static withTtlLayerLive = this.withTtlLayer.pipe(
    Layer.provide(this.keyValueStoreImpl),
  );
}
