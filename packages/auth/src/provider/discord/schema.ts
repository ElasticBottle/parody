import { Schema } from "@effect/schema";
import { BaseUser, Tag$ } from "../schema";

export class DiscordUserResponse extends Schema.Class<DiscordUserResponse>(
  "DiscordUserResponse",
)({
  _tag: Tag$("DiscordUserResponse"),
  id: Schema.String.annotations({
    description: "The user's ID (snowflake).",
  }),
  username: Schema.String.annotations({
    description: "The user's username, not unique across the platform.",
  }),
  discriminator: Schema.String.annotations({
    description: "The user's Discord-tag.",
  }),
  global_name: Schema.optionalWith(Schema.String, {
    nullable: true,
  }).annotations({
    description:
      "The user's display name, if it is set. For bots, this is the application name.",
  }),
  avatar: Schema.optionalWith(Schema.String, { nullable: true }).annotations({
    description: "The user's avatar hash.",
  }),
  bot: Schema.optionalWith(Schema.Boolean, { nullable: true }).annotations({
    description: "Whether the user belongs to an OAuth2 application.",
  }),
  system: Schema.optionalWith(Schema.Boolean, { nullable: true }).annotations({
    description:
      "Whether the user is an Official Discord System user (part of the urgent message system).",
  }),
  mfa_enabled: Schema.optionalWith(Schema.Boolean, {
    nullable: true,
  }).annotations({
    description: "Whether the user has two factor enabled on their account.",
  }),
  banner: Schema.optionalWith(Schema.String, { nullable: true }).annotations({
    description: "The user's banner hash.",
  }),
  accent_color: Schema.optionalWith(Schema.Number, {
    nullable: true,
  }).annotations({
    description:
      "The user's banner color encoded as an integer representation of hexadecimal color code.",
  }),
  locale: Schema.optionalWith(Schema.String, { nullable: true }).annotations({
    description: "The user's chosen language option.",
  }),
  verified: Schema.optionalWith(Schema.Boolean, {
    nullable: true,
  }).annotations({
    description: "Whether the email on this account has been verified.",
  }),
  email: Schema.optionalWith(Schema.String, { nullable: true }).annotations({
    description: "The user's email.",
  }),
  flags: Schema.optionalWith(Schema.Number, { nullable: true }).annotations({
    description: "The flags on a user's account.",
  }),
  premium_type: Schema.optionalWith(Schema.Number, {
    nullable: true,
  }).annotations({
    description: "The type of Nitro subscription on a user's account.",
  }),
  public_flags: Schema.optionalWith(Schema.Number, {
    nullable: true,
  }).annotations({
    description: "The public flags on a user's account.",
  }),
}) {}

export class DiscordUser extends BaseUser.extend<DiscordUser>("DiscordUser")({
  _tag: Tag$("DiscordUser"),

  username: Schema.String.annotations({
    description: "The user's username.",
  }),
  discordTag: Schema.String.annotations({
    description: "The user's Discord-tag.",
  }),
  displayName: Schema.optionalWith(Schema.String, {
    nullable: true,
  }).annotations({
    description: "The user's display name.",
  }),
  bot: Schema.optionalWith(Schema.Boolean, { nullable: true }).annotations({
    description: "Whether the user belongs to an OAuth2 application.",
  }),
  system: Schema.optionalWith(Schema.Boolean, { nullable: true }).annotations({
    description: "Whether the user is an Official Discord System user.",
  }),
  locale: Schema.optionalWith(Schema.String, { nullable: true }).annotations({
    description: "The user's chosen language option.",
  }),
  emailVerified: Schema.optionalWith(Schema.Boolean, {
    nullable: true,
  }).annotations({
    description: "Whether the email on this account has been verified.",
  }),
}) {}
