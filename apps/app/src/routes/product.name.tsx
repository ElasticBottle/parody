import { Input } from "@parody/ui/input";
import { Label } from "@parody/ui/label";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/product/name")({
	component: ProductName,
});

export function ProductName() {
	return (
		<div className="grid w-full max-w-sm items-center gap-1.5">
			<Label htmlFor="email">Email</Label>
			<Input type="email" id="email" placeholder="Email" />
		</div>
	);
}
