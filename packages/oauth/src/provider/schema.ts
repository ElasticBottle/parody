import { Schema } from "@effect/schema";

export class BaseUser extends Schema.Class<BaseUser>("BaseUser")({
  id: Schema.String.annotations({
    description: "The user ID.",
  }),
  email: Schema.optionalWith(Schema.String, { nullable: true }).annotations({
    description: "The user's email.",
  }),
  pictureUrl: Schema.optionalWith(Schema.String, {
    nullable: true,
  }).annotations({
    description: "The user's avatar URL.",
  }),
}) {}

export const Tag$ = <A extends string>(tag: A) =>
  Schema.optionalWith(Schema.Literal(tag), { default: () => tag });
