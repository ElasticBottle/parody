import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/product")({
	component: ProductLayout,
	beforeLoad() {
		return {
			getTitle: () => "Product",
		};
	},
});

export function ProductLayout() {
	return <Outlet />;
}
