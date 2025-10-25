import React, { createContext, useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import type { IUserInfo } from "../utils/interfaces";
import { appEnv } from "../utils/constants";

const UserContext = createContext(null as null | IUserInfo);

export default function MainLayout() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<null | IUserInfo>(null);

  async function fetchUser(token: string) {
    try {
      const res = await fetch(appEnv.baseUrl + "user/detail", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {
        const status = res.status;
        if (status === 401) {
          setUserInfo(null);
          localStorage.removeItem("auth");
          navigate("/auth/login");
          return;
        }
        return res.json();
      });
      if (res.user) setUserInfo(res.user);
    } catch (error) {
      console.error({ error });
    }
  }

  function handleLogout() {
    localStorage.removeItem("auth");
  }

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (auth) {
      fetchUser(auth);
    } else {
      navigate("/auth/login");
    }
  }, []);
  return (
    <UserContext.Provider value={userInfo}>
      <div className="flex flex-col">
        <header className="bg-primaryDark text-white h-[70px] p-2">
          <p>
            خوش آمدید : {userInfo?.name} {userInfo?.surname}
          </p>
        </header>
        <div className="grid grid-cols-[170px_1fr] [height:calc(100vh-120px)]">
          <aside className="bg-secondaryLight border-l p-2 flex flex-col gap-2">
            <Link to={"/user-management"}>مدیریت کاربران</Link>
            <Link
              to={"/auth/login"}
              onClick={handleLogout}
              className="text-red-600"
            >
              خروج
            </Link>
          </aside>
          <main className=" p-2">
            <Outlet />
          </main>
        </div>
        <footer className="bg-primaryDark text-white h-[50px] p-2">
          <h1>footer</h1>
        </footer>
      </div>
    </UserContext.Provider>
  );
}
