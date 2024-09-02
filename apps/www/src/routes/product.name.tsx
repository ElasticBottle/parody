import { Button } from "@parody/ui/button";
import { Input } from "@parody/ui/input";
import { Label } from "@parody/ui/label";
import { Link, createFileRoute, useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/product/name")({
	component: ProductName,
});

export function ProductName() {
	const router = useRouter();

	return (
		<div className="mx-auto flex h-full w-full max-w-4xl flex-col items-center gap-5 py-5">
			<div className="flex w-full flex-col gap-1">
				<Label htmlFor="email" className="font-bold text-4xl">
					Product Name
				</Label>
				<p className="text-muted-foreground text-sm">
					This is the unique name of your product
				</p>
			</div>
			<Input type="email" id="product-name" placeholder="Sun Plastic" />
			<div className="flex w-full flex-1 items-end justify-between">
				<Button
					variant={"ghost"}
					onClick={() => {
						router.history.go(-1);
					}}
				>
					back
				</Button>
				<Button asChild>
					<Link to="/product/photo">Continue</Link>
				</Button>
			</div>
		</div>
	);
}
