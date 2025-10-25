import { useEffect, useState } from "react";
import { appEnv } from "../utils/constants";
import type { IUserInfo } from "../utils/interfaces";

export default function UserManagement() {
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<
    Array<Omit<IUserInfo, "password"> & { id: string }>
  >([]);

  async function fetchList() {
    const auth = localStorage.getItem("auth");
    setLoading(true);
    try {
      const res = await fetch(appEnv.baseUrl + "user/list", {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      }).then((res) => res.json());
      if (res.status === "success") {
        setUsers(res.users);
      }
    } catch (error) {
      console.error({ error });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    setLoading(true);
    try {
      const auth = localStorage.getItem("auth");
      const res = await fetch(appEnv.baseUrl + `user/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      }).then((res) => res.json());
      if (res.status === "success") {
        fetchList();
      }
    } catch (error) {
      console.error({ error });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="flex flex-col">
      <h3 className="text-xl mb-2">لیست کاربران</h3>

      <div className="overflow-x-auto w-full rounded-xl shadow-sm border border-gray-200 bg-white">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-right font-semibold">نام</th>
              <th className="py-3 px-4 text-right font-semibold">
                نام خانوادگی
              </th>
              <th className="py-3 px-4 text-right font-semibold">موبایل</th>
              <th className="py-3 px-4 text-right font-semibold">عملیات</th>
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-t border-gray-100 even:bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <td className="py-3 px-4">{user.name}</td>
                <td className="py-3 px-4">{user.surname}</td>
                <td className="py-3 px-4">{user.mobile}</td>

                <td className="py-3 px-4">
                  <div className="flex flex-col gap-2 *:w-full *:cursor-pointer">
                    <button
                      className="bg-red-500 text-white py-1 rounded-md hover:bg-red-600 transition-colors"
                      onClick={() => handleDelete(user.id)}
                    >
                      حذف
                    </button>
                    <button className="bg-blue-500 text-white py-1 rounded-md hover:bg-blue-600 transition-colors">
                      ویرایش
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loading && (
          <h1 className="text-2xl text-center py-6 text-gray-500">
            در حال بارگذاری...
          </h1>
        )}
      </div>
    </div>
  );
}
