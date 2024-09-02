import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import "@parody/ui/globals.css";

export const Route = createRootRouteWithContext<{
	getTitle?: () => string;
}>()({
	component: () => (
		<>
			<Outlet />
			<TanStackRouterDevtools />
		</>
	),
});
