import { KeyValueStore } from "@effect/platform";
import { SystemError } from "@effect/platform/Error";
import { Schema } from "@effect/schema";
import type { ParseError } from "@effect/schema/ParseResult";
import { Effect, Layer, Option } from "effect";
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

export class CloudflareKvStore extends Effect.Tag(
  "@cubeflair/services/cloudflare-kv-store",
)<CloudflareKvStore, ICloudflareKvStore>() {
  static keyValueStoreLayer = Layer.succeed(
    KeyValueStore.KeyValueStore,
    KeyValueStore.make({
      remove: (key) =>
        Effect.gen(function* () {
          yield* Effect.tryPromise({
            try: () => Resource.KvStore.delete(key),
            catch: (e) =>
              SystemError({
                message: `Failed to delete key: ${e}`,
                method: "remove",
                module: "KeyValueStore",
                pathOrDescriptor: key,
                reason: "Unknown",
              }),
          });
        }).pipe(Effect.withSpan("CloudflareKvStore.remove")),
      clear: Effect.fail(
        SystemError({
          message: "Failed to clear kv store",
          method: "clear",
          module: "KeyValueStore",
          pathOrDescriptor: "",
          reason: "NotFound",
        }),
      ),
      get: (key) =>
        Effect.tryPromise({
          try: async () => {
            const result = await Resource.KvStore.get(key, { type: "text" });
            return result ? Option.some(result) : Option.none();
          },
          catch: (e) =>
            SystemError({
              message: `Failed to get key: ${e}`,
              method: "get",
              module: "KeyValueStore",
              pathOrDescriptor: key,
              reason: "NotFound",
            }),
        }).pipe(Effect.withSpan("CloudflareKvStore.get")),
      size: Effect.tryPromise({
        try: async () => {
          const keys = await Resource.KvStore.list();
          return keys.keys.length;
        },
        catch: (e) =>
          SystemError({
            message: `Failed to get size of kv store: ${e}`,
            method: "size",
            module: "KeyValueStore",
            pathOrDescriptor: "",
            reason: "NotFound",
          }),
      }).pipe(Effect.withSpan("CloudflareKvStore.size")),
      set: (key, value) =>
        Effect.tryPromise({
          try: () => Resource.KvStore.put(key, value),
          catch: (e) =>
            SystemError({
              message: `Failed to set key: ${e}`,
              method: "set",
              module: "KeyValueStore",
              pathOrDescriptor: `key: ${key}, value: ${value}`,
              reason: "Unknown",
            }),
        }).pipe(Effect.withSpan("CloudflareKvStore.set")),
      getUint8Array: (key) =>
        Effect.tryPromise({
          try: async () => {
            const result = await Resource.KvStore.get(key, {
              type: "arrayBuffer",
            });
            return result ? Option.some(new Uint8Array(result)) : Option.none();
          },
          catch: (e) =>
            SystemError({
              message: `Failed to get key for Uint8Array: ${e}`,
              method: "get",
              module: "KeyValueStore",
              pathOrDescriptor: key,
              reason: "NotFound",
            }),
        }).pipe(Effect.withSpan("CloudflareKvStore.getUint8Array")),
      modifyUint8Array: (key, f) =>
        Effect.tryPromise({
          try: async () => {
            const result = await Resource.KvStore.get(key, {
              type: "arrayBuffer",
            });
            if (result) {
              const newValue = f(new Uint8Array(result));
              await Resource.KvStore.put(key, newValue.buffer);
              return Option.some(newValue);
            }
            return Option.none();
          },
          catch: (e) =>
            SystemError({
              message: `Failed to modify key for Uint8Array: ${e}`,
              method: "modify",
              module: "KeyValueStore",
              pathOrDescriptor: key,
              reason: "NotFound",
            }),
        }).pipe(Effect.withSpan("CloudflareKvStore.modifyUint8Array")),
    }),
  );

  static ttlLayer = Layer.effect(
    this,
    Effect.gen(function* () {
      const kvStore = yield* KeyValueStore.KeyValueStore;
      const setTtl = (key: string, value: string, ttlSeconds: number) =>
        Effect.tryPromise({
          try: () => {
            return Resource.KvStore.put(key, value, {
              expirationTtl: ttlSeconds,
            });
          },
          catch: (e) =>
            SystemError({
              message: `Failed to set key with TTL: ${e}`,
              method: "setTtl",
              module: "KeyValueStore",
              pathOrDescriptor: `key: ${key}, value: ${value}, ttl: ${ttlSeconds}`,
              reason: "Unknown",
            }),
        }).pipe(Effect.withSpan("CloudflareKvStore.setTtl"));
      return {
        ...kvStore,
        setTtl,
        forSchema: <A, I, R>(
          schema: Schema.Schema<A, I, R>,
        ): ICloudflareKvStoreSchema<A, R> => {
          const jsonSchema = Schema.parseJson(schema);
          const schemaStore = kvStore.forSchema(schema);
          const encode = Schema.encode(jsonSchema);

          const setTtlSchema = (key: string, value: A, ttlSeconds: number) => {
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
  ).pipe(Layer.provide(this.keyValueStoreLayer));
}
