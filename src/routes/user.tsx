import { useParams } from "react-router-dom";
import { UserProfil } from "../components/user";

const UserRoute = () => {
  // get the name from the URL
  const { username } = useParams();
  if (!username) throw new Error("No streamId in URL");
};

export default UserRoute;
