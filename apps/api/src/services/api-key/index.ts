import { Effect, Layer } from "effect";
import {
  getApiKeyByPublicKey,
  getApiKeyByPublicKeyWithProjectId,
} from "./get-api-key-by-public-key";
import { validatePublicKeyUsage } from "./validate-public-key-usage";

export class ApiKeyService extends Effect.Tag("@cubeflair/api-key-service")<
  ApiKeyService,
  {
    validatePublicKeyUsage: typeof validatePublicKeyUsage;
    getApiKeyByPublicKey: typeof getApiKeyByPublicKey;
    getApiKeyByPublicKeyWithProjectId: typeof getApiKeyByPublicKeyWithProjectId;
  }
>() {
  static layer = Layer.succeed(this, {
    validatePublicKeyUsage: validatePublicKeyUsage,
    getApiKeyByPublicKey,
    getApiKeyByPublicKeyWithProjectId,
  });
}

export * as ApiKey from "./keys";
