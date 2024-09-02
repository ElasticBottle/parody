import { Button } from "@parody/ui/button";
import { Card } from "@parody/ui/card";
import { ChevronRight, Plus } from "@parody/ui/icons";
import { Link, createFileRoute } from "@tanstack/react-router";
import PlaceholderSvg from "~/assets/placeholder.svg";

export const Route = createFileRoute("/dashboard/product/")({
	component: ProductComponent,
	beforeLoad() {
		return {
			getTitle: undefined,
		};
	},
});

export function ProductComponent() {
	return (
		<div className="mx-auto grid w-full max-w-6xl gap-5">
			<div className="grid w-full gap-4">
				<div className="flex w-full items-center gap-4">
					<h1 className="flex-1 shrink-0 whitespace-nowrap font-semibold text-xl tracking-tight sm:grow-0">
						Products
					</h1>
					<div className="ml-auto items-center gap-2">
						<Button size="sm" className="gap-2" asChild>
							<Link to="/product/name">
								<Plus size={15} /> Create New Product
							</Link>
						</Button>
					</div>
				</div>
			</div>
			<ProductList />
		</div>
	);
}

export function ProductList() {
	const data: Array<{
		id: string;
		name: string;
		description: string;
		image: string;
	}> = [
		{
			id: "1",
			name: "Acme Circles T-Shirt",
			description: "Stylish and comfortable tee for everyday wear",
			image: PlaceholderSvg,
		},
		{
			id: "2",
			name: "Acme Mug",
			description: "A mug for your morning coffee",
			image: PlaceholderSvg,
		},
		{
			id: "3",
			name: "Acme Hat",
			description: "A hat for your head",
			image: PlaceholderSvg,
		},
		{
			id: "4",
			name: "Acme Pant",
			description: "A pant for your legs",
			image: PlaceholderSvg,
		},
	];

	return (
		<div className="grid grid-cols-1 justify-items-center gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{data.map((product) => {
				return (
					<Card
						key={product.name}
						className="width w-full max-w-xs rounded-xl border"
					>
						<div className="flex h-full flex-col gap-4 p-4">
							<div className="aspect-[4/5] w-full overflow-hidden rounded-xl">
								<img
									src={product.image}
									alt={product.name}
									width="400"
									height="500"
									className="aspect-[4/5] w-full border object-cover"
								/>
							</div>
							<div className="flex flex-1 flex-col gap-1.5">
								<h3 className="font-semibold text-sm md:text-base">
									{product.name}
								</h3>
								<p className="flex-1 text-muted-foreground text-sm md:text-base">
									{product.description}
								</p>
							</div>
							<Button size="sm" asChild>
								<Link
									to="/dashboard/product/$productId"
									params={{
										productId: product.id,
									}}
								>
									Product Shots <ChevronRight />
								</Link>
							</Button>
						</div>
					</Card>
				);
			})}
		</div>
	);
}
