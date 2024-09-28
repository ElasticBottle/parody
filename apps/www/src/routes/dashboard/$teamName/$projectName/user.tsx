import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/$teamName/$projectName/user")({
	component: () => <div>Hello /dashboard/$teamName/$projectName/user!</div>,
});
