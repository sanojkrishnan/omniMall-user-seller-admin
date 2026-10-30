import {
  HomeIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  User,
  UserCog,
} from "lucide-react";
import OmniMall from "./OmniMall";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import P2 from "./P2";

const headerContent = ["Home", "Shop", "Cart", "Profile"];

const icons = {
  Home: HomeIcon,
  Shop: ShoppingBagIcon,
  Cart: ShoppingCartIcon,
  Profile: null,
};

const getNavPath = (item, user) => {
  switch (item) {
    case "Home":
      return user ? "/user" : "/";
    case "Shop":
      return user ? "/user/shop" : "/shop";
    case "Cart":
      return user ? "/user/cart" : "/login";
    case "Profile":
      return user ? "/user/profile" : "/login";
    default:
      return "/";
  }
};

/**
 * Profile avatar for the menu:
 *  - user + profile image  -> the image
 *  - user, no image        -> first letter of the user's name
 *  - no user               -> user icon
 */
function ProfileAvatar({ user, FallbackIcon, iconClass = "" }) {
  const imageUrl = user?.profileImage?.url;
  const initial = user?.firstName?.trim().charAt(0).toUpperCase();

  if (user && imageUrl) {
    return (
      <img
        src={imageUrl}
        alt="Profile"
        referrerPolicy="no-referrer"
        className="size-6 rounded-full object-cover"
      />
    );
  }

  if (user && initial) {
    return (
      <div className="grid size-6 place-items-center rounded-full bg-white text-sm font-bold leading-none text-black">
        {initial}
      </div>
    );
  }

  return (
    <div className="w-fit h-fit rounded-full bg-white p-1 text-black">
      <FallbackIcon className={iconClass} />
    </div>
  );
}

function Header({ hideMenu, borderLine, selection }) {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  return (
    <div
      className={`w-full fixed z-50 m-0 top-0 h-18 flex items-center justify-between ${borderLine ? "border-b-1 shadow-lg bg-white" : ""}`}
    >
      <div className="m-2 ml-4 w-fit">
        <OmniMall />
      </div>

      {/* menu */}
      {!hideMenu && (
        <div className="mr-5 hidden sm:block">
          <div className="w-fit p-1 text-center text-sm text-white rounded-b-3xl bg-black flex justify-evenly">
            {headerContent.map((item) => {
              const Icon = icons[item];
              const path = getNavPath(item, user);

              return (
                <div
                  key={item}
                  className="text-center flex flex-col items-center justify-center w-16 h-16 hover:bg-white hover:text-black transition-all duration-500 rounded-3xl cursor-pointer group"
                  onClick={() =>
                    path &&
                    navigate(
                      path,
                      item === "Profile" ? { replace: true } : undefined,
                    )
                  }
                >
                  {item === "Profile" ? (
                    <ProfileAvatar user={user} FallbackIcon={User} />
                  ) : (
                    <Icon className="size-6" />
                  )}

                  <P2>
                    {item === "Profile" ? (user ? "Profile" : "Login") : item}
                  </P2>

                  {/* selection indicator */}
                  <div
                    className={`mt-1 h-1 rounded-xl transition-all duration-500
                ${selection === item.toLowerCase() ? "w-1/2" : "w-0"}
                group-hover:bg-black bg-white`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* mobile menu */}
      {!hideMenu && (
        <div className="fixed top-3 right-0 flex sm:hidden">
          <div className="w-fit p-1 text-center text-xs text-white rounded-l-3xl bg-black flex flex-col justify-evenly">
            {headerContent.map((item) => {
              const Icon = icons[item];
              const path = getNavPath(item, user);

              return (
                <div
                  key={item}
                  className="text-center flex flex-col items-center justify-center w-16 h-16 hover:bg-white hover:text-black transition-all duration-500 rounded-3xl cursor-pointer group"
                  onClick={() => path && navigate(path, { replace: true })}
                >
                  {item === "Profile" ? (
                    <ProfileAvatar
                      user={user}
                      FallbackIcon={UserCog}
                      iconClass="size-4"
                    />
                  ) : (
                    <Icon className="size-4" />
                  )}

                  <P2>
                    {item === "Profile" ? (user ? "Profile" : "Login") : item}
                  </P2>

                  {/* selection indicator */}
                  <div
                    className={`h-1 rounded-xl transition-all duration-500
    ${selection === item.toLowerCase() ? "w-8 opacity-100" : "w-0 opacity-0"}
    group-hover:bg-black bg-white`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
