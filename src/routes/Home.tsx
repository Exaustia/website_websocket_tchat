import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import { Layout } from "../components/layout/Layout";

const Home = () => {
  return (
    <Layout>
      <Header />
      <Outlet />
    </Layout>
  );
};

export default Home;
