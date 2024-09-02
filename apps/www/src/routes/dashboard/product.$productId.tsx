import { Badge } from "@parody/ui/badge";
import { Button } from "@parody/ui/button";
import { ChevronLeft, CornerDownLeft } from "@parody/ui/icons";
import { Label } from "@parody/ui/label";
import { Textarea } from "@parody/ui/textarea";
import { createFileRoute, useRouterState } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/product/$productId")({
	component: ProductComponent,
	beforeLoad(ctx) {
		return {
			getTitle: () => ctx.params.productId,
		};
	},
});

export function ProductComponent() {
	const { matches } = useRouterState();
	const title = matches.slice(-1)[0]?.context.getTitle?.();
	return (
		<>
			<div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
				<div className="flex items-center gap-4">
					<Button variant="outline" size="icon" className="h-7 w-7">
						<ChevronLeft />
						<span className="sr-only">Back</span>
					</Button>
					<h1 className="flex-1 shrink-0 whitespace-nowrap font-semibold text-xl tracking-tight sm:grow-0">
						{title}
					</h1>
					<Badge variant="outline" className="ml-auto sm:ml-0">
						90 images left
					</Badge>
				</div>

				<div className="flex items-center justify-center gap-2 md:hidden">
					<Button variant="outline" size="sm">
						Discard
					</Button>
					<Button size="sm">Save Product</Button>
				</div>
			</div>
			<div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
				<Badge variant="outline" className="absolute right-3 top-3">
					Output
				</Badge>
				<div className="flex-1" />
				<form
					className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
					x-chunk="dashboard-03-chunk-1"
				>
					<Label htmlFor="message" className="sr-only">
						Message
					</Label>
					<Textarea
						id="message"
						placeholder="Type your message here..."
						className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
					/>
					<div className="flex items-center p-3 pt-0">
						<Button type="submit" size="sm" className="ml-auto gap-1.5">
							Send Message
							<CornerDownLeft className="size-3.5" />
						</Button>
					</div>
				</form>
			</div>
		</>
	);
}
