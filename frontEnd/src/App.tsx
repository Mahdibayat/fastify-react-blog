import { Route, Routes } from "react-router-dom";
import AuthLayout from "./layouts/authLayout";
import Login from "./pages/login";
import Register from "./pages/register";
import MainLayout from "./layouts/mainLayout";
import Dashboard from "./pages/dashboard";

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
      </Route>

      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
      </Route>

      <Route
        path="*"
        element={
          <h3 className="text-5xl text-center w-full mt-10">
            صفحه ای یافت نشد
          </h3>
        }
      />
    </Routes>
  );
}

export default App;
