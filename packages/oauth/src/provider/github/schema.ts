import { Schema } from "@effect/schema";
import { BaseUser, Tag$ } from "../schema";

export class GitHubUserResponse extends Schema.Class<GitHubUserResponse>(
  "GitHubUserResponse",
)({
  _tag: Tag$("GitHubUserResponse"),
  login: Schema.String,
  id: Schema.Number,
  node_id: Schema.String,
  avatar_url: Schema.String,
  name: Schema.optionalWith(Schema.String, { nullable: true }),
  company: Schema.optionalWith(Schema.String, { nullable: true }),
  blog: Schema.optionalWith(Schema.String, { nullable: true }),
  location: Schema.optionalWith(Schema.String, { nullable: true }),
  email: Schema.optionalWith(Schema.String, { nullable: true }),
}) {}

export const decodeGitHubUserResponseFromUnknown =
  Schema.decodeUnknown(GitHubUserResponse);

export class GitHubUser extends BaseUser.extend<GitHubUser>("GitHubUser")({
  _tag: Tag$("GitHubUser"),
  login: Schema.String,
  nodeId: Schema.String,
  name: Schema.optionalWith(Schema.String, { nullable: true }),
  company: Schema.optionalWith(Schema.String, { nullable: true }),
  blog: Schema.optionalWith(Schema.String, { nullable: true }),
  location: Schema.optionalWith(Schema.String, { nullable: true }),
}) {}
