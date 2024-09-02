import { Button } from "@parody/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import PlaceholderSvg from "~/assets/placeholder.svg";

export const Route = createFileRoute("/login")({
	component: LoginComponent,
});

export function LoginComponent() {
	return (
		<div className="min-h-screen w-full md:grid md:grid-cols-2">
			<div className="hidden bg-muted md:block">
				<img
					src={PlaceholderSvg}
					alt="placeholder"
					width="1920"
					height="1080"
					className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
				/>
			</div>
			<div className="flex items-center justify-center py-12">
				<div className="mx-auto grid w-[350px] gap-6">
					<h1 className="font-bold text-3xl">Login</h1>

					<Button variant="outline" className="w-full">
						Login with Discord
					</Button>
					<Button variant="outline" className="w-full">
						Login with Google
					</Button>
				</div>
			</div>
		</div>
	);
}
