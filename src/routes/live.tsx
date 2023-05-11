import { useParams } from "react-router-dom";
import Live from "../components/live";

const LiveRoute = () => {
  // get the name from the URL
  const { streamId } = useParams();
  if (!streamId) throw new Error("No streamId in URL");

  return <Live streamId={streamId} />;
};

export default LiveRoute;
