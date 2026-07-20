import {
  FiBell,
} from "react-icons/fi";

import {
  UserButton,
  useUser,
} from "@clerk/clerk-react";

const Topbar = () => {
  const {
    user,
    isLoaded,
  } = useUser();

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">
          Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Logged-in user name */}
        {isLoaded && user && (
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-slate-800">
              {user.fullName ||
                user.firstName ||
                "User"}
            </p>

            <p className="text-xs text-slate-500">
              {user
                .primaryEmailAddress
                ?.emailAddress}
            </p>
          </div>
        )}

        {/* Notifications */}
        <button
          type="button"
          className="rounded-full p-2 hover:bg-slate-100"
          aria-label="Notifications"
        >
          <FiBell size={20} />
        </button>

        {/* Clerk User Profile */}
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox:
                "w-9 h-9",
            },
          }}
        />
      </div>
    </header>
  );
};

export default Topbar;