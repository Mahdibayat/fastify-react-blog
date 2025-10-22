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
      }).then((res) => res.json());

      setUserInfo(res.user);
    } catch (error) {
      console.error({ error });
    }
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
      <div>
        <header>
          <p>
            خوش آمدید : {userInfo?.name} {userInfo?.surname}
          </p>
        </header>
        <aside>
          <Link to={"/auth/login"}>users</Link>
          <button>logout</button>
        </aside>
        <main>
          <Outlet />
        </main>
        <footer>
          <h1>footer</h1>
        </footer>
      </div>
    </UserContext.Provider>
  );
}
