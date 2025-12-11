import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/axiosinstance"; // your axios instance

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        // Call backend to clear cookie
        await api.post("/logout");

        // Clear localStorage token
        localStorage.removeItem("token");
        sessionStorage.clear(); // optional
      } catch (err) {
        console.log("Logout error:", err);
      }

      // Redirect to login
      
      navigate("/login", { replace: true });
    };

    logoutUser();
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h3>Logging out...</h3>
    </div>
  );
}

export default Logout;
