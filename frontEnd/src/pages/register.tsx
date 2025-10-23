import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import type z from "zod";
import { registerSchema } from "../utils/schemas/registerSchema";
import { appEnv } from "../utils/constants";

type IForm = z.infer<typeof registerSchema>;
export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IForm>({ resolver: zodResolver(registerSchema) });

  async function submit(body: IForm) {
    try {
      const res = await fetch(`${appEnv.baseUrl}auth/register`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
      navigate(`/auth/login?mobile=${res.user.mobile}`);
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
          نام
          <input
            {...register("name")}
            placeholder="نام"
            className="input"
            aria-errormessage={errors?.name?.message}
          />
          <span className="text-xs text-red-600">{errors?.name?.message}</span>
        </label>

        <label className="flex flex-col gap-1">
          نام خانوادگی
          <input
            {...register("surname")}
            placeholder="نام خانوادگی"
            className="input"
            aria-errormessage={errors?.surname?.message}
          />
          <span className="text-xs text-red-600">
            {errors?.surname?.message}
          </span>
        </label>

        <label className="flex flex-col gap-1">
          شماره همراه
          <input
            {...register("mobile")}
            placeholder="09..."
            className="input [direction:ltr]"
            aria-errormessage={errors?.mobile?.message}
          />
          <span className="text-xs text-red-600">
            {errors?.mobile?.message}
          </span>
        </label>

        <label className="flex flex-col gap-1">
          انتخاب پسورد
          <input
            {...register("password")}
            placeholder="گذرواژه"
            className="input"
            aria-errormessage={errors?.password?.message}
          />
          <span className="text-xs text-red-600">
            {errors?.password?.message}
          </span>
        </label>

        <button
          className="p-2 px-3 bg-primary text-white rounded"
          type="submit"
        >
          ثبت نام
        </button>
      </form>

      <Link to={"/auth/login"}>ورود به حساب کاربری</Link>
    </div>
  );
}
