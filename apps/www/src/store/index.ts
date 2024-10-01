import { createStore } from "@xstate/store";

export const store = createStore({
  // Initial context
  context: {
    user: {
      status: "loggedOut",
      username: undefined as string | undefined,
    },
  },
  // Transitions
  on: {
    login: (_, event: { username: string }) => {
      return { user: { status: "loggedIn", username: event.username } };
    },
    logout: {
      user: {
        username: undefined,
        status: "loggedOut",
      },
    },
  },
});
