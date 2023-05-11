import { Link } from "react-router-dom";
import { useAuthContext } from "../../context/AuthProvider";
import { useUser } from "../../context/UserProvider";
import { useEffect, useState } from "react";

const Header = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState<boolean>(false); // [TODO
  const { provider, isLoggedIn } = useAuthContext();

  useEffect(() => {
    if (user && !isLoggedIn) {
      setLoading(true);
    }
    if (user && isLoggedIn) {
      setLoading(false);
    }
  }, [isLoggedIn, user]);

  let wallet = null;
  if (provider === "eth") {
    const startWallet = user?.ethWallet?.slice(0, 6);
    const endWallet = user?.ethWallet?.slice(-4);
    wallet = `${startWallet}...${endWallet}`;
  } else {
    const startWallet = user?.solanaWallet?.slice(0, 6);
    const endWallet = user?.solanaWallet?.slice(-4);
    wallet = `${startWallet}...${endWallet}`;
  }

  return (
    <nav className="h-16 px-12 bg-primary-color flex items-center justify-between shadow-header relative">
      <Link to={"/"}>
        <img src="/images/JPG.png" alt="logo" className="" />
      </Link>
      {isLoggedIn && !loading ? (
        <Link className="flex items-center" to={"/profile"}>
          <img
            src={
              user?.picture ||
              "https://media.discordapp.net/attachments/1061972385139523594/1105927365646880898/Ellipse_1.png"
            }
            alt="avatar"
            className="w-8 h-8 rounded-full"
          />
          <div className="flex text-white flex-col ml-3">
            <span className="font-semibold leading-[0.9]">
              {user?.username || wallet}
            </span>
            <span className="text-secondary-color">{wallet}</span>
          </div>
        </Link>
      ) : (
        <Link to={"/login"} className="text-white">
          Login
        </Link>
      )}
    </nav>
  );
};

export default Header;
