import { Progress } from "@parody/ui/progress";
import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";

export const Route = createFileRoute("/product")({
	component: ProductComponent,
});

function ProductComponent() {
	const location = useLocation();

	const HREF_PROGRESS_MAP: Record<string, number> = {
		"/product/name": 1,
		"/product/photo": 2,
		"/product/payment": 3,
		"/product/summary": 4,
	};
	const totalSteps = Object.keys(HREF_PROGRESS_MAP).length;
	const progress = HREF_PROGRESS_MAP[location.href] ?? 0;
	const progressValue = (progress / totalSteps) * 100;

	return (
		<div className="flex min-h-screen w-full flex-col items-center pt-2">
			<div className="flex h-20 w-full max-w-6xl items-center justify-between rounded-md p-3 shadow-md md:p-5">
				<div className="flex-shrink-0 font-bold text-lg md:text-xl">
					Product Gen
				</div>
				<div className="w-full max-w-2xl px-3 md:px-10">
					<Progress value={progressValue} />
				</div>
				<div>{Math.round(progressValue)}%</div>
			</div>
			<main className="h-full w-full p-5">
				<Outlet />
			</main>
		</div>
	);
}
