import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

export type AuthUser = {
	id: string;
	name: string;
	email: string;
	avatarUrl?: string;
};

type Provider = "google" | "github";

type AuthContextType = {
	user: AuthUser | null;
	signIn: (args: { email: string; password: string }) => Promise<{ error?: string }>;
	signUp: (args: { name: string; email: string; password: string }) => Promise<{ error?: string }>;
	signOut: () => Promise<void>;
	updateProfile: (args: { name?: string; email?: string; avatarUrl?: string }) => Promise<{ error?: string }>;
	signInWithProvider: (provider: Provider) => Promise<{ error?: string }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapSessionUser(u: any | null): AuthUser | null {
	if (!u) return null;
	const meta = (u.user_metadata ?? {}) as Record<string, any>;
	const name: string = meta.name || u.email?.split("@")[0] || "User";
	const avatarUrl: string | undefined = meta.avatarUrl || meta.avatar_url || undefined;
	return { id: u.id, name, email: u.email, avatarUrl } as AuthUser;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<AuthUser | null>(null);

	useEffect(() => {
		let mounted = true;
		supabase.auth.getSession().then(({ data }) => {
			if (!mounted) return;
			setUser(mapSessionUser(data.session?.user ?? null));
		});
		const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(mapSessionUser(session?.user ?? null));
		});
		return () => {
			mounted = false;
			sub.subscription.unsubscribe();
		};
	}, []);

	const signIn: AuthContextType["signIn"] = async ({ email, password }) => {
		const { error } = await supabase.auth.signInWithPassword({ email, password });
		return { error: error?.message };
	};

	const signUp: AuthContextType["signUp"] = async ({ name, email, password }) => {
		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: { data: { name } },
		});
		return { error: error?.message };
	};

	const signOut: AuthContextType["signOut"] = async () => {
		await supabase.auth.signOut();
	};

	const updateProfile: AuthContextType["updateProfile"] = async ({ name, email, avatarUrl }) => {
		const { error } = await supabase.auth.updateUser({
			data: { ...(name ? { name } : {}), ...(avatarUrl ? { avatarUrl } : {}) },
			...(email ? { email } as any : {}),
		});
		return { error: error?.message };
	};

	const signInWithProvider: AuthContextType["signInWithProvider"] = async (provider) => {
		const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: `${window.location.origin}/profile` } });
		return { error: error?.message };
	};

	const value = useMemo(() => ({ user, signIn, signUp, signOut, updateProfile, signInWithProvider }), [user]);
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
}
