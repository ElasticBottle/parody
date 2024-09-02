import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import "@parody/ui/globals.css";
import { Toaster } from "@parody/ui/sonner";

export const Route = createRootRouteWithContext<{
	getTitle?: () => string;
}>()({
	component: () => (
		<>
			<Outlet />
			<Toaster />
			<TanStackRouterDevtools />
		</>
	),
});
