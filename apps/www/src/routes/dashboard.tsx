import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@parody/ui/breadcrumb";
import { Button } from "@parody/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@parody/ui/dropdown-menu";
import { Input } from "@parody/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@parody/ui/sheet";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@parody/ui/tooltip";
import {
	Link,
	Outlet,
	createFileRoute,
	useRouterState,
} from "@tanstack/react-router";
import {
	Home,
	LineChart,
	Package,
	Package2,
	PanelLeft,
	Search,
	Settings,
	ShoppingCart,
	Users2,
} from "lucide-react";
import { Fragment } from "react";
import PlaceholderSvg from "~/assets/placeholder.svg";

export const Route = createFileRoute("/dashboard")({
	component: DashboardLayoutComponent,
	beforeLoad() {
		return {
			getTitle: () => "Dashboard",
		};
	},
});

export function DashboardLayoutComponent() {
	const matches = useRouterState({ select: (s) => s.matches });
	const breadcrumbs = matches
		.map(({ pathname, context }) => {
			if (!context.getTitle) return;
			return {
				title: context.getTitle?.(),
				path: pathname,
			};
		})
		.filter((result) => !!result);

	return (
		<TooltipProvider>
			<div className="flex min-h-screen w-full flex-col bg-muted/40">
				<aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
					<nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
						<Link
							href="#"
							className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary font-semibold text-lg text-primary-foreground md:h-8 md:w-8 md:text-base"
						>
							<Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
							<span className="sr-only">Acme Inc</span>
						</Link>
						<Tooltip>
							<TooltipTrigger asChild>
								<Link
									href="#"
									className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
								>
									<Home className="h-5 w-5" />
									<span className="sr-only">Dashboard</span>
								</Link>
							</TooltipTrigger>
							<TooltipContent side="right">Dashboard</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<Link
									to="/dashboard/product"
									className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
								>
									<Package className="h-5 w-5" />
									<span className="sr-only">Products</span>
								</Link>
							</TooltipTrigger>
							<TooltipContent side="right">Products</TooltipContent>
						</Tooltip>
					</nav>
					<nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
						<Tooltip>
							<TooltipTrigger asChild>
								<Link
									href="#"
									className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
								>
									<Settings className="h-5 w-5" />
									<span className="sr-only">Settings</span>
								</Link>
							</TooltipTrigger>
							<TooltipContent side="right">Settings</TooltipContent>
						</Tooltip>
					</nav>
				</aside>
				<div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
					<header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
						<Sheet>
							<SheetTrigger asChild>
								<Button size="icon" variant="outline" className="sm:hidden">
									<PanelLeft className="h-5 w-5" />
									<span className="sr-only">Toggle Menu</span>
								</Button>
							</SheetTrigger>
							<SheetContent side="left" className="sm:max-w-xs">
								<nav className="grid gap-6 font-medium text-lg">
									<Link
										href="#"
										className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary font-semibold text-lg text-primary-foreground md:text-base"
									>
										<Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
										<span className="sr-only">Acme Inc</span>
									</Link>
									<Link
										href="#"
										className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
									>
										<Home className="h-5 w-5" />
										Dashboard
									</Link>
									<Link
										href="#"
										className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
									>
										<ShoppingCart className="h-5 w-5" />
										Orders
									</Link>
									<Link
										href="#"
										className="flex items-center gap-4 px-2.5 text-foreground"
									>
										<Package className="h-5 w-5" />
										Products
									</Link>
									<Link
										href="#"
										className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
									>
										<Users2 className="h-5 w-5" />
										Customers
									</Link>
									<Link
										href="#"
										className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
									>
										<LineChart className="h-5 w-5" />
										Settings
									</Link>
								</nav>
							</SheetContent>
						</Sheet>
						<Breadcrumb className="hidden md:flex">
							<BreadcrumbList>
								{breadcrumbs.map(({ title, path }, index) => {
									console.log("path", path);
									return (
										<Fragment key={`${title}-${path}`}>
											{index > 0 && <BreadcrumbSeparator />}
											<BreadcrumbItem>
												<BreadcrumbLink asChild>
													<Link to={path}>{title}</Link>
												</BreadcrumbLink>
											</BreadcrumbItem>
										</Fragment>
									);
								})}
							</BreadcrumbList>
						</Breadcrumb>
						<div className="relative ml-auto flex-1 md:grow-0">
							<Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								type="search"
								placeholder="Search..."
								className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
							/>
						</div>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									size="icon"
									className="overflow-hidden rounded-full"
								>
									<img
										src={PlaceholderSvg}
										width={36}
										height={36}
										alt="Avatar"
										className="overflow-hidden rounded-full"
									/>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>My Account</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem>Settings</DropdownMenuItem>
								<DropdownMenuItem>Support</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem>Logout</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</header>
					<main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
						<Outlet />
					</main>
				</div>
			</div>
		</TooltipProvider>
	);
}
