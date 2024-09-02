import {
	ProductNameSchema,
	type ProductNameSchemaType,
} from "@parody/core/schema/product-form";
import { Button } from "@parody/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormMessage,
	useForm,
	zodResolver,
} from "@parody/ui/form";
import { Input } from "@parody/ui/input";
import { Label } from "@parody/ui/label";
import { createFileRoute, useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/product/name")({
	component: ProductName,
});

export function ProductName() {
	const router = useRouter();

	const form = useForm<ProductNameSchemaType>({
		resolver: zodResolver(ProductNameSchema),
		defaultValues: {
			productName: "",
		},
	});

	function onSubmit(input: ProductNameSchemaType) {
		console.log("input", input);
		// TODO: save in global state
		router.navigate({
			to: "/product/photo",
		});
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className=" h-full w-full">
				<div className="mx-auto flex h-full w-full max-w-4xl flex-col items-center gap-5 py-5">
					<div className="flex w-full flex-col gap-1">
						<FormField
							control={form.control}
							name="productName"
							render={({ field }) => (
								<div className="space-y-6">
									<FormItem className="w-full">
										<Label
											htmlFor="product-name"
											className="font-bold text-4xl"
										>
											Product Name
										</Label>
										<FormDescription>
											This is the unique name of your product
										</FormDescription>
										<FormControl>
											<Input placeholder="Sun Plastic" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								</div>
							)}
						/>
					</div>

					<div className="flex w-full flex-1 items-end justify-between">
						<Button
							variant={"ghost"}
							onClick={() => {
								router.history.go(-1);
							}}
						>
							back
						</Button>
						<Button type="submit">Continue</Button>
					</div>
				</div>
			</form>
		</Form>
	);
}
