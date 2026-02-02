import "./styles/App.css";
import AppRouter from "./routes";
import { useEffect } from "react";
import { refreshUserData } from "@/entities/user/model";
import { useAppDispatch } from "@/shared/lib/hooks/redux";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(refreshUserData());
  }, []);

  return <AppRouter />;
}

export default App;
