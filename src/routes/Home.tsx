import { Outlet } from "react-router-dom";
import { Layout } from "../components/layout/Layout";

const HomePage = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default HomePage;
