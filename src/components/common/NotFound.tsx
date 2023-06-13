export const NotFound = () => {
  return (
    <div className="w-full flex justify-center items-center mt-16 flex-col">
      <h1 className="text-white text-2xl">Look like nothing here :(</h1>
      <a href={"/"} className="text-black text-2xl bg-white">
        Go back
      </a>
    </div>
  );
};
