import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useEffect } from "react";

const navLinks = [
	{ label: "Home", href: "/" },
	{ label: "Notes", href: "/courses" },
	{ label: "About", href: "/about" },
	{ label: "Contact", href: "/contact" },
];

export default function Header() {
	const [open, setOpen] = useState(false);
	const { user, signOut } = useAuth();
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 6);
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	return (
		<header className={cn("sticky top-0 z-40 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-border transition-all", scrolled && "shadow-sm bg-white/80") }>
			<div className={cn("container-max flex items-center justify-between transition-all", scrolled ? "h-16" : "h-20")}>
				<div className="flex items-center gap-3">
					<Link to="/" className="flex items-center gap-2" aria-label="EduLearn Home">
						<span className="text-lg font-extrabold bg-gradient-brand bg-clip-text text-transparent">EduLearn</span>
					</Link>
				</div>

				<nav className="hidden md:flex items-center gap-8" aria-label="Primary">
					{navLinks.map((l) => (
						<NavLink
							key={l.href}
							to={l.href}
							className={({ isActive }) =>
								cn(
									"text-sm font-medium text-foreground/80 hover:text-foreground underline-animation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm",
									isActive && "text-foreground"
								)
							}
						>
							{l.label}
						</NavLink>
					))}
				</nav>

				<div className="hidden md:flex items-center gap-3">
					{user ? (
						<DropdownMenu>
							<DropdownMenuTrigger className="outline-none">
								<div className="flex items-center gap-2">
									<Avatar className="h-9 w-9">
										{user.avatarUrl ? (
											<img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
										) : (
											<AvatarFallback>{user.name.slice(0,1).toUpperCase()}</AvatarFallback>
										)}
									</Avatar>
									<span className="text-sm font-medium hidden sm:block">{user.name}</span>
								</div>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem asChild>
									<Link to="/profile" className="flex items-center gap-2"><User className="h-4 w-4" /> Profile</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link to="/courses" className="flex items-center gap-2">My notes</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={() => signOut()} className="text-destructive flex items-center gap-2"><LogOut className="h-4 w-4" /> Sign out</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<>
							<Button asChild variant="outline" className="h-10 px-5">
								<Link to="/login" aria-label="Login">Login</Link>
							</Button>
							<Button asChild className="h-10 px-5 bg-gradient-brand hover:brightness-105 text-white shadow-[0_8px_20px_rgba(98,0,238,0.30)] ripple">
								<Link to="/register" aria-label="Register">Register</Link>
							</Button>
						</>
					)}
				</div>

				<button
					className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					aria-label="Toggle navigation menu"
					aria-expanded={open}
					onClick={() => setOpen((v) => !v)}
				>
					<Menu className="h-6 w-6" />
				</button>
			</div>

			{/* Mobile dropdown */}
			{open && (
				<div className="md:hidden border-t border-border bg-white">
					<div className="container-max py-4 space-y-2">
						{navLinks.map((l) => (
							<Link
								key={l.href}
								to={l.href}
								className="block px-2 py-2 text-foreground/90 hover:text-foreground">
								{l.label}
							</Link>
						))}
						<div className="pt-2 flex gap-2">
							{user ? (
								<>
									<Button asChild className="flex-1 bg-gradient-brand text-white ripple"> <Link to="/profile">Profile</Link> </Button>
									<Button onClick={() => signOut()} variant="outline" className="flex-1">Sign out</Button>
								</>
							) : (
								<>
									<Button asChild variant="outline" className="flex-1"> <Link to="/login">Login</Link> </Button>
									<Button asChild className="flex-1 bg-gradient-brand hover:brightness-105 text-white ripple"> <Link to="/register">Register</Link> </Button>
								</>
							)}
						</div>
					</div>
				</div>
			)}
		</header>
	);
}
