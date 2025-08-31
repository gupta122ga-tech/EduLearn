import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

export default function Register() {
	const { signUp, signInWithProvider } = useAuth();
	const navigate = useNavigate();
	const [pending, setPending] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		setError(null);
		const fd = new FormData(e.currentTarget);
		const email = String(fd.get("email") || "").trim();
		const name = String(fd.get("name") || "").trim();
		const password = String(fd.get("password") || "");
		if (!email || !name || !password) return setError("Name, email and password are required");
		setPending(true);
		const { error } = await signUp({ name, email, password });
		setPending(false);
		if (error) return setError(error);
		navigate("/profile");
	};

	const onProvider = async (provider: "google" | "github") => {
		setError(null);
		setPending(true);
		const { error } = await signInWithProvider(provider);
		setPending(false);
		if (error) setError(error);
	};

	return (
		<main>
			<section className="container-max py-12">
				<div className="bg-card rounded-xl p-8 elevate max-w-xl mx-auto">
					<h1 className="text-3xl font-bold">Create account</h1>
					<p className="mt-2 text-muted-foreground">Create an account to manage your notes.</p>
					<form onSubmit={onSubmit} className="mt-6 space-y-4">
						<div>
							<label className="block text-sm font-medium" htmlFor="name">Name</label>
							<input id="name" name="name" className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2" required />
						</div>
						<div>
							<label className="block text-sm font-medium" htmlFor="email">Email</label>
							<input id="email" name="email" type="email" className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2" required />
						</div>
						<div>
							<label className="block text-sm font-medium" htmlFor="password">Password</label>
							<input id="password" name="password" type="password" className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2" required />
						</div>
						<button disabled={pending} className="h-11 px-5 rounded-md bg-gradient-brand text-white ripple">{pending ? "Creating..." : "Create account"}</button>
						{error && <p className="text-sm text-red-600">{error}</p>}
						<p className="text-sm text-muted-foreground">Have an account? <Link to="/login" className="text-primary underline-animation">Login</Link></p>
					</form>
					<div className="mt-6 space-y-3">
						<div className="flex items-center gap-3">
							<div className="h-px bg-border flex-1" />
							<span className="text-xs text-muted-foreground">or continue with</span>
							<div className="h-px bg-border flex-1" />
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<button type="button" disabled={pending} onClick={() => onProvider("google")} className="h-10 rounded-md border border-input hover:bg-muted">Google</button>
							<button type="button" disabled={pending} onClick={() => onProvider("github")} className="h-10 rounded-md border border-input hover:bg-muted">GitHub</button>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
