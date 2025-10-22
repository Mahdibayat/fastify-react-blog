import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema } from "../utils/schemas/loginSchema";
import { Link, useNavigate } from "react-router-dom";
import { appEnv } from "../utils/constants";

export default function Login() {
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ resolver: zodResolver(loginSchema) });

  async function submit(body: any) {
    try {
      const res = await fetch(`${appEnv.baseUrl}auth/login`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
      console.log({ res });
      if (res.token) {
        localStorage.setItem("auth", res.token);
        navigate("/");
      }
    } catch (error) {
      console.error({ error });
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <form
        className="flex flex-col gap-2 p-5 border shadow-md rounded"
        onSubmit={handleSubmit(submit, console.error)}
      >
        <label className="flex flex-col gap-1">
          شماره همراه
          <input
            {...register("mobile")}
            placeholder="09..."
            className="input [direction:ltr]"
            aria-errormessage={errors?.mobile?.message}
          />
          {errors?.mobile?.message}
        </label>

        <label className="flex flex-col gap-1">
          پسورد
          <input
            {...register("password")}
            placeholder="گذرواژه"
            className="input"
            aria-errormessage={errors?.password?.message}
          />
          {errors?.password?.message}
        </label>

        <button
          className="p-2 px-3 bg-primary text-white rounded"
          type="submit"
        >
          ورود
        </button>
      </form>

      <Link to={"/auth/register"}>
        حساب کاربری ندارید ؟{" "}
        <span className="text-blue-600 underline underline-offset-3">
          ثبت نام
        </span>
      </Link>
    </div>
  );
}
