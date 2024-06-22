"use client";

import Button from "@/components/common/button";
import Input from "@/components/common/input";
import { LOGIN_SCHEMA } from "@/constants/form-schemas";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { APIS, PAGES } from "@/constants/pages-apis-mapping";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useTransition } from "react";

type LoginFormInputs = z.infer<typeof LOGIN_SCHEMA>;

function Login() {
  const router = useRouter();
  const [isLoggingIn, startLoggingIn] = useTransition();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(LOGIN_SCHEMA),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function login(email: string, password: string) {
    try {
      const response = await fetch(APIS.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const { error } = errorData;
        throw new Error(error);
      }

      return response.json();
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  const onSubmit = async (data: LoginFormInputs) => {
    const { email, password } = data;

    startLoggingIn(async () => {
      try {
        const userData = await login(email, password);
        Cookies.set("userEmail", email, { expires: 1 });
        Cookies.set("userId", userData.userId.toString(), { expires: 1 });
        toast.success("Login successful. Redirecting...");
        router.push(PAGES.HOME);
      } catch (e) {
        const error = e as Error;
        toast.error(error.message);
      }
    });
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col bg-white rounded-lg items-center justify-center p-8 xl:p-4 xl:h-[600px] xl:w-[800px] space-y-8 shadow-2xl h-full w-96">
        <div className="flex flex-col space-y-4 items-center">
          <h1 className="text-3xl tracking-tighter font-black">
            BTC Guessing Game
          </h1>
          <h2 className="text-lg text-center">
            Welcome! 👋🏻 Please login or create an account.
          </h2>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4 xl:w-96 pt-4"
        >
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Input
                {...field}
                label="email"
                labelDescription="Email"
                type="email"
                placeholder="Your email"
                error={errors.email?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <Input
                {...field}
                label="password"
                labelDescription="Password"
                type="password"
                placeholder="Your password"
                error={errors.password?.message}
              />
            )}
          />
          <Button
            isLoading={isLoggingIn}
            label={isLoggingIn ? "Logging in..." : "Login"}
            type="submit"
            icon="→"
            iconPosition="right"
          />
        </form>
        <p className="text-sm text-center tracking-tighter">
          Don&apos;t have an account yet?&nbsp;
          <Link
            href={PAGES.CREATE_USER}
            className="underline underline-offset-2 decoration-dotted decoration-berkeleyBlue focus:ring-2 focus:ring-offset-2 focus:ring-berkeleyBlue focus:outline-none"
          >
            Create an account here
          </Link>
        </p>
      </div>
    </main>
  );
}

export default Login;
