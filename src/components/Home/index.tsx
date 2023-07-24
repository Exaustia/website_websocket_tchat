export const Home = () => {
  return (
    <div className="flex justify-center items-center text-white flex-col">
      PAGE DISPO:
      <a href="/live" className="text-blue-500 ml-2">
        LIVE
      </a>
      <a href="/profile" className="text-blue-500 ml-2">
        PROFILE
      </a>
      <span>Vous pouvez cliquer sur un utilisateur sur le tchat, ça ouvrira son profile</span>
    </div>
  );
};
