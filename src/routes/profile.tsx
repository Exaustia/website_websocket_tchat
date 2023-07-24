import { Profile } from "../components/profile";
import useAuth from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

const ProfileRoute = () => {
  const { isLoggedIn, status } = useAuth();

  if (!isLoggedIn && status !== "connecting") {
    return <Navigate to="/login" />;
  }

  return <Profile />;
};

export default ProfileRoute;
