import Header from "./Header";

export const Layout = ({ children }: { children: any }) => {
  return (
    <main className="w-full min-h-screen bg-primary-color">
      <Header />
      {children}
    </main>
  );
};
