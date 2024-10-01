import { Data } from "effect";

export class LoginTimeout extends Data.TaggedError("auth.errors.LoginTimeout") {
  message = "Login Timeout. Please try logging in again.";
}

export class InvalidState extends Data.TaggedError("auth.errors.InvalidState") {
  message = "Invalid state, please try to login again.";
}
