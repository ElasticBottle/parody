import { Button } from "@parody/ui/button";
import DotPattern from "@parody/ui/dot-pattern";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
	component: Index,
});

function Index() {
	return (
		<div className="relative flex h-screen w-full flex-col items-center justify-center gap-4">
			<h3 className="font-bold text-4xl">Create Your Product Now!</h3>
			<Button asChild className="z-10 rounded-md" size={"lg"}>
				<Link to="/product/name" className="hover:cursor-pointer">
					Get Started
				</Link>
			</Button>
			<DotPattern
				className={
					"[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]"
				}
			/>
		</div>
	);
}
