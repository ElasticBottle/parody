import { Discord } from "@cubeflair/auth/provider";
import { FetchHttpClient } from "@effect/platform";
import { ConfigProvider, Layer, ManagedRuntime, pipe } from "effect";
import { ApiKeyService } from "~/services/api-key";
import { CloudflareKvStore } from "~/services/kv-store";
import { RandomValue } from "~/services/random-value";
import { SessionService } from "~/services/session";
import { UserService } from "~/services/user";
import type { Env } from "../env";

export const liveRuntime = (env: Env) => {
  return ManagedRuntime.make(
    Layer.mergeAll(
      Discord.layer.pipe(
        Layer.provide(
          pipe(
            env,
            Object.entries,
            (e) => new Map(e),
            (e) =>
              ConfigProvider.fromMap(e, {
                pathDelim: "_",
              }),
            Layer.setConfigProvider,
          ),
        ),
      ),
      CloudflareKvStore.ttlLayer,
      RandomValue.layer,
      ApiKeyService.layer,
      UserService.layer,
      SessionService.layer,
      FetchHttpClient.layer,
    ),
  );
};
