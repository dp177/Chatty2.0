import { useEffect } from "react";
import { useStore } from "../store/useStore";
import { useNavigate } from "react-router-dom";

function LogoutPage() {
  const navigate = useNavigate();
  const logoutUser = useStore((state) => state.logoutUser);

  useEffect(() => {
    logoutUser(navigate);
  }, [logoutUser, navigate]);
  return <div>Logging out...</div>;
}

export default LogoutPage;
