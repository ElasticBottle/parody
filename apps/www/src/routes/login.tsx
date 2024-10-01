import { Button } from "@parody/ui/button";
import { Input } from "@parody/ui/input";
import { Label } from "@parody/ui/label";
import { Link, createFileRoute, useRouter } from "@tanstack/react-router";
import { useSelector } from "@xstate/store/react";
import * as React from "react";
import { z } from "zod";
import { store } from "~/store";
export const Route = createFileRoute("/login")({
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  component: LoginComponent,
});

function LoginComponent() {
  const router = useRouter();
  const { status, username: userChosenUsername } = useSelector(
    store,
    (state) => {
      return state.context.user;
    },
  );
  const search = Route.useSearch();
  const [username, setUsername] = React.useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    store.send({
      type: "login",
      username,
    });
    router.invalidate();
  };

  // Ah, the subtle nuances of client side auth. 🙄
  React.useLayoutEffect(() => {
    if (status === "loggedIn" && search.redirect) {
      router.history.push(search.redirect);
    }
  }, [status, search.redirect, router.history.push]);

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <div className="hidden items-center justify-center bg-muted lg:flex">
        <figure className="mx-auto max-w-screen-md text-center">
          <svg
            className="mx-auto mb-3 h-10 w-10 text-foreground"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 18 14"
          >
            <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
          </svg>
          <blockquote>
            <p className="font-medium text-2xl text-foreground italic">
              "Flowbite is just awesome. It contains tons of predesigned
              components and pages starting from login screen to complex
              dashboard. Perfect choice for your next SaaS application."
            </p>
          </blockquote>
          <figcaption className="mt-6 flex items-center justify-center space-x-3 rtl:space-x-reverse">
            <div className="flex items-center divide-x-2 divide-primary rtl:divide-x-reverse">
              <cite className="pe-3 font-medium text-foreground">
                Michael Gough
              </cite>
              <cite className="ps-3 text-muted-foreground text-sm">
                CEO at Google
              </cite>
            </div>
          </figcaption>
        </figure>
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="font-bold text-3xl">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
            <Button variant="outline" className="w-full">
              Login with Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="#" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
