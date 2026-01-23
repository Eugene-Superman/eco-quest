import { useAppSelector } from "@/shared/lib/hooks/redux";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Loader } from "@/shared/ui";
import { Outlet } from "react-router";

function AdminLayout() {
	return (
		<div>
			<h1>Admin Layout</h1> <Outlet />
		</div>
	);
}

function ModeratorLayout() {
	return (
		<div>
			<h1>Moderator Layout</h1> <Outlet />
		</div>
	);
}

function ParticipantLayout() {
	return (
		<div>
			<h1>Participant Layout</h1> <Outlet />
		</div>
	);
}

function VisitorLayout() {
	return (
		<div>
			<h1>Visitor Layout</h1> <Outlet />
		</div>
	);
}

export default function AppLayout() {
	const user = useAppSelector((state) => state.user.user);
	const isLoading = useAppSelector((state) => state.user.isLoading);
	const userRole = user?.role;

	if (isLoading) {
		return <Loader />;
	}

	const getLayout = () => {
		switch (userRole) {
			case "admin":
				return <AdminLayout />;
			case "moderator":
				return <ModeratorLayout />;
			case "participant":
				return <ParticipantLayout />;
			default:
				return <VisitorLayout />;
		}
	};

	return (
		<>
			<Header userRole={userRole} />
			<main>{getLayout()}</main>
			<Footer />
		</>
	);
}
