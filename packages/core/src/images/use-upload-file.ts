import { useState } from "react";
import { getErrorString } from "../error/get-error-string";

export const useUploadFile = () => {
	const [uploadedFiles, setUploadedFiles] = useState<Array<unknown>>([]);
	const [progresses, setProgresses] = useState<Record<string, number>>({});
	const [isUploading, setIsUploading] = useState(false);
	const [error, setError] = useState<string | undefined>(undefined);

	async function onUpload(files: Array<File>) {
		setIsUploading(true);
		try {
			const res = await uploadFiles({
				files,
				onUploadProgress: ({ file, progress }) => {
					setProgresses((prev) => {
						return {
							...prev,
							[file]: progress,
						};
					});
				},
			});

			setUploadedFiles((prev) => (prev ? [...prev, ...res] : res));
		} catch (err) {
			setError(getErrorString(err));
		} finally {
			setProgresses({});
			setIsUploading(false);
		}
	}

	return {
		onUpload,
		uploadedFiles,
		progresses,
		isUploading,
		error,
		isError: !!error,
	};
};

const uploadFiles = async ({
	files,
	onUploadProgress,
}: {
	files: Array<File>;
	onUploadProgress: (progress: { file: string; progress: number }) => void;
}) => {
	const formData = new FormData();

	for (const file of files) {
		formData.append("files", file);
	}
	return await Promise.resolve([]);
	// const res = await fetch("/api/upload", {
	// 	method: "POST",
	// 	body: formData,
	// });

	// if (!res.ok) {
	// 	throw new Error("Failed to upload files");
	// }

	// const data = (await res.json()) as Array<unknown>;

	// return data;
};
