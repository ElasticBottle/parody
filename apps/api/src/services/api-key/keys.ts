import { Schema } from "@effect/schema";

export const PublicKeySchema = Schema.TemplateLiteralParser(
  Schema.Literal("public_key_"),
  Schema.NonEmptyString,
);
export interface IPublicKey
  extends Schema.Schema.Type<typeof PublicKeySchema> {}
export const encodePublicKey = Schema.encode(PublicKeySchema);

export const PrivateKeySchema = Schema.TemplateLiteralParser(
  Schema.Literal("private_key_"),
  Schema.NonEmptyString,
);
export interface IPrivateKey
  extends Schema.Schema.Type<typeof PublicKeySchema> {}
