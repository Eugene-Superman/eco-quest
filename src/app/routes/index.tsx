import { BrowserRouter, Routes, Route } from "react-router";
import { ROUTES } from "@/shared/config";
import { HomePage } from "@/pages/home";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}
