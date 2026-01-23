import { ROUTES } from "@/shared/config";
import { HomePage } from "@/pages/home";
import { BrowserRouter, Route, Routes } from "react-router";
import AppLayout from "../layouts/AppLayout";

export default function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<AppLayout />}>
					<Route path={ROUTES.HOME} element={<HomePage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
