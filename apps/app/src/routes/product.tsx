import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/product")({
	component: ProductComponent,
});

function ProductComponent() {
	return (
		<div className="flex h-screen w-full flex-col">
			Hello /product!
			<Outlet />
		</div>
	);
}
