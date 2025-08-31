import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import type { NoteItem } from "@shared/api";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Profile() {
	const { user, signOut, updateProfile } = useAuth();
	const navigate = useNavigate();
	const [notes, setNotes] = useState<NoteItem[]>([]);
	const [editing, setEditing] = useState<string | null>(null);
	const titleRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		if (!user) {
			navigate("/login");
			return;
		}
		fetch("/api/notes")
			.then((r) => r.json())
			.then((data: NoteItem[]) => {
				const mine = data.filter((n) => (n as any).ownerEmail === user.email);
				setNotes(mine);
			});
	}, [user, navigate]);

	if (!user) return null;

	const onAvatarChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = async () => {
			await updateProfile({ avatarUrl: String(reader.result) });
		};
		reader.readAsDataURL(file);
	};

	const onProfileSave: React.FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		const fd = new FormData(e.currentTarget);
		const name = String(fd.get("name") || user.name);
		const email = String(fd.get("email") || user.email);
		await updateProfile({ name, email });
	};

	const refreshMine = () => {
		fetch("/api/notes").then((r) => r.json()).then((data: NoteItem[]) => setNotes(data.filter((n) => (n as any).ownerEmail === user.email)));
	};

	const deleteNote = async (id: string) => {
		await fetch(`/api/notes/${id}`, { method: "DELETE" });
		refreshMine();
	};

	const startEdit = (id: string, current: string) => {
		setEditing(id);
		setTimeout(() => titleRef.current?.focus(), 0);
	};

	const saveEdit = async (id: string) => {
		const title = titleRef.current?.value?.trim();
		if (!title) return setEditing(null);
		await fetch(`/api/notes/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title }) });
		setEditing(null);
		refreshMine();
	};

	return (
		<main>
			<section className="container-max py-12">
				<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
					<div className="flex items-start gap-4">
						<Avatar className="h-16 w-16">
							{user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt={user.name} /> : <AvatarFallback>{user.name.slice(0,1).toUpperCase()}</AvatarFallback>}
						</Avatar>
						<form onSubmit={onProfileSave} className="space-y-3">
							<h1 className="text-3xl md:text-4xl font-bold">Your profile</h1>
							<p className="text-muted-foreground">Manage your account and notes.</p>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								<input aria-label="Name" name="name" defaultValue={user.name} className="rounded-md border border-input bg-background px-3 py-2" />
								<input aria-label="Email" name="email" type="email" defaultValue={user.email} className="rounded-md border border-input bg-background px-3 py-2" />
							</div>
							<div className="flex items-center gap-3">
								<label className="inline-flex items-center gap-2 text-sm cursor-pointer">
									<input aria-label="Upload avatar" type="file" accept="image/*" onChange={onAvatarChange} className="hidden" />
									<span className="underline-animation">Upload avatar</span>
								</label>
								<button className="h-9 px-4 rounded-md bg-gradient-brand text-white ripple">Save</button>
							</div>
						</form>
					</div>
					<button onClick={() => { signOut().then(() => navigate("/")); }} className="h-10 px-4 rounded-md bg-gradient-brand text-white ripple self-start">Sign out</button>
				</div>

				<div className="mt-10">
					<div className="flex items-center justify-between">
						<h2 className="text-2xl font-semibold">My uploads</h2>
						<Link to="/courses" className="text-primary underline-animation">Upload more →</Link>
					</div>
					<ul className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{notes.map((n) => (
							<li key={n.id} className="bg-card rounded-lg p-4 elevate">
								<div className="flex items-start justify-between gap-3">
									<div className="flex-1 min-w-0">
										{editing === n.id ? (
											<input aria-label="Rename note title" ref={titleRef} defaultValue={n.title} className="w-full rounded-md border border-input bg-background px-2 py-1" />
										) : (
											<h3 className="font-semibold truncate" title={n.title}>{n.title}</h3>
										)}
										{n.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{n.description}</p>}
									</div>
								<div className="flex items-center gap-2">
									{editing === n.id ? (
										<button onClick={() => saveEdit(n.id)} className="text-sm text-primary underline-animation">Save</button>
									) : (
										<button onClick={() => startEdit(n.id, n.title)} className="text-sm text-primary underline-animation">Rename</button>
									)}
									<button onClick={() => deleteNote(n.id)} className="text-sm text-destructive underline-animation">Delete</button>
									<a href={n.url} className="text-sm text-primary underline-animation whitespace-nowrap">Download</a>
								</div>
							</div>
						</li>
						))}
						{notes.length === 0 && <li className="text-muted-foreground">No uploads yet.</li>}
					</ul>
				</div>
			</section>
		</main>
	);
}
