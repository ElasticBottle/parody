"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { z } from "zod";

import { getErrorString } from "@parody/core/error/get-error-string";
import { useUploadFile } from "@parody/core/images/use-upload-file";
import { Button } from "@parody/ui/button";
import { FileUploader } from "@parody/ui/file-upload.primitive";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	useForm,
} from "@parody/ui/form";
import { toast } from "@parody/ui/sonner";

const schema = z.object({
	images: z.array(z.instanceof(File)),
});

type Schema = z.infer<typeof schema>;

export function FileUpload() {
	const [loading, setLoading] = React.useState(false);
	const { onUpload, progresses, uploadedFiles, isUploading } = useUploadFile();
	const form = useForm<Schema>({
		resolver: zodResolver(schema),
		defaultValues: {
			images: [],
		},
	});

	function onSubmit(input: Schema) {
		setLoading(true);

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
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex w-full flex-col gap-6"
			>
				<FormField
					control={form.control}
					name="images"
					render={({ field }) => (
						<div className="space-y-6">
							<FormItem className="w-full">
								<FormLabel className="sr-only">Images</FormLabel>
								<FormControl>
									<FileUploader
										value={field.value}
										onValueChange={field.onChange}
										maxFileCount={10}
										maxSize={10 * 1024 * 1024}
										progresses={progresses}
										disabled={isUploading}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						</div>
					)}
				/>
				<Button type="submit" className="w-fit" disabled={loading}>
					Save
				</Button>
			</form>
		</Form>
	);
}
