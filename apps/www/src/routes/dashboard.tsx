import {
  Link,
  Outlet,
  createFileRoute,
  redirect,
} from "@tanstack/react-router";
import { store } from "~/store";

export const Route = createFileRoute("/dashboard")({
  component: DashboardComponent,
  // Before loading, authenticate the user via our auth context
  // This will also happen during prefetching (e.g. hovering over links, etc)
  beforeLoad: ({ location }) => {
    const { user } = store.getSnapshot().context;
    // If the user is logged out, redirect them to the login page
    if (user.status === "loggedOut") {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }

    // Otherwise, return the user in context
    return {
      username: user.username,
    };
  },
});

function DashboardComponent() {
  return (
    <>
      <div className="flex items-center border-b">
        <h2 className="p-2 text-xl">Dashboard</h2>
      </div>
      <div className="flex flex-wrap divide-x">
        {(
          [
            ["/dashboard", "Summary", true],
            ["/dashboard/invoices", "Invoices"],
            ["/dashboard/users", "Users"],
          ] as const
        ).map(([to, label, exact]) => {
          return (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact }}
              activeProps={{ className: "font-bold" }}
              className="p-2"
            >
              {label}
            </Link>
          );
        })}
      </div>
      <hr />
      <Outlet />
    </>
  );
}
