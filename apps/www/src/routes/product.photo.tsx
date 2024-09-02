import { Button } from "@parody/ui/button";
import { Input } from "@parody/ui/input";
import { Label } from "@parody/ui/label";
import { Link, createFileRoute, useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/product/photo")({
	component: ProductPhoto,
});

export function ProductPhoto() {
	const router = useRouter();

	return (
		<div className="mx-auto grid h-full w-full max-w-4xl items-start gap-6 py-5 md:grid-cols-2">
			<div className="grid gap-4">
				<div>
					<Label htmlFor="photo" className="font-bold text-4xl">
						Product Photo
					</Label>
					<p className="text-muted-foreground text-sm">
						Please upload a photos of your product from various angles for the
						best results.
					</p>
					<Input id="photo" type="file" className="mt-3" />
				</div>
				<Button type="submit" className="w-full">
					Upload
				</Button>
			</div>
			<div className="grid gap-4">
				<div>
					<h2 className="font-bold text-xl">Examples</h2>
					<p className="text-muted-foreground text-sm">
						Here are some examples of acceptable and unacceptable.
					</p>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<img
							src="/placeholder.svg"
							width={300}
							height={200}
							alt="Acceptable"
							className="aspect-video w-full rounded-md object-cover"
						/>
						<p className="mt-2 font-medium text-sm">Acceptable</p>
					</div>
					<div>
						<img
							src="/placeholder.svg"
							width={300}
							height={200}
							alt="Unacceptable"
							className="aspect-video w-full rounded-md object-cover"
						/>
						<p className="mt-2 font-medium text-sm">Unacceptable</p>
					</div>
					<div>
						<img
							src="/placeholder.svg"
							width={300}
							height={200}
							alt="Acceptable"
							className="aspect-video w-full rounded-md object-cover"
						/>
						<p className="mt-2 font-medium text-sm">Acceptable</p>
					</div>
					<div>
						<img
							src="/placeholder.svg"
							width={300}
							height={200}
							alt="Unacceptable"
							className="aspect-video w-full rounded-md object-cover"
						/>
						<p className="mt-2 font-medium text-sm">Unacceptable</p>
					</div>
				</div>
			</div>
			<div className="flex w-full flex-1 items-end justify-between md:col-span-2">
				<Button
					variant={"ghost"}
					onClick={() => {
						router.history.back();
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
