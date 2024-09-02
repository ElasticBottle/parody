import { getErrorString } from "@parody/core/error/get-error-string";
import {
	FileUploadSchema,
	type FileUploadSchemaType,
} from "@parody/core/image/file-upload-schema";
import { useUploadFile } from "@parody/core/image/use-upload-file";
import { Button } from "@parody/ui/button";
import { Form, useForm, zodResolver } from "@parody/ui/form";
import { Label } from "@parody/ui/label";
import { toast } from "@parody/ui/sonner";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import React from "react";
import PlaceholderSvg from "~/assets/placeholder.svg";
import { ImageFileUpload } from "~/components/image-file-upload";

export const Route = createFileRoute("/product/photo")({
	component: ProductPhoto,
});

export function ProductPhoto() {
	const router = useRouter();

	const [loading, setLoading] = React.useState(false);
	const { onUpload, isUploading } = useUploadFile();
	const form = useForm<FileUploadSchemaType>({
		resolver: zodResolver(FileUploadSchema),
		defaultValues: {
			images: [],
		},
	});

	function onSubmit(input: FileUploadSchemaType) {
		setLoading(true);
		console.log("running");
		toast.promise(onUpload(input.images), {
			loading: "Uploading images...",
			success: () => {
				form.reset();
				setLoading(false);
				return "Images uploaded";
			},
			error: (err) => {
				setLoading(false);
				return getErrorString(err);
			},
		});
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className=" h-full w-full">
				<div className="mx-auto grid h-full w-full max-w-4xl items-start gap-6 py-5 md:grid-cols-2">
					<div className="grid gap-4">
						<div>
							<Label htmlFor="photo" className="font-bold text-4xl">
								Product Photo
							</Label>
							<p className="text-muted-foreground text-sm">
								Please upload a photos of your product from various angles for
								the best results.
							</p>
							<ImageFileUpload form={form} isUploading={isUploading} />
						</div>
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
									src={PlaceholderSvg}
									width={300}
									height={200}
									alt="Acceptable"
									className="aspect-video w-full rounded-md object-cover"
								/>
								<p className="mt-2 font-medium text-sm">Acceptable</p>
							</div>
							<div>
								<img
									src={PlaceholderSvg}
									width={300}
									height={200}
									alt="Unacceptable"
									className="aspect-video w-full rounded-md object-cover"
								/>
								<p className="mt-2 font-medium text-sm">Unacceptable</p>
							</div>
							<div>
								<img
									src={PlaceholderSvg}
									width={300}
									height={200}
									alt="Acceptable"
									className="aspect-video w-full rounded-md object-cover"
								/>
								<p className="mt-2 font-medium text-sm">Acceptable</p>
							</div>
							<div>
								<img
									src={PlaceholderSvg}
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
						<Button type="submit">Continue</Button>
					</div>
				</div>
			</form>
		</Form>
	);
}
