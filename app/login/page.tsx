"use client";

import Button from "@/components/common/button";
import Input from "@/components/common/input";
import { LOGIN_SCHEMA } from "@/constants/form-schemas";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { PAGES } from "@/constants/pages-apis-mapping";
import { userLogin } from "@/actions/actions";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

type LoginFormInputs = z.infer<typeof LOGIN_SCHEMA>;

function Login() {
  const router = useRouter();

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

  const onSubmit = async (data: LoginFormInputs) => {
    const { email, password } = data;

    try {
      await userLogin(email, password);
      Cookies.set("userEmail", email, { expires: 1 });
      router.push(PAGES.HOME);
    } catch (error) {
      const errorMessage = (error as Error).message;
      toast.error(errorMessage);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen font-mono">
      <div className="flex flex-col bg-white rounded-lg items-center justify-center p-4 h-[500px] w-[800px] space-y-4">
        <h1 className="font-inter text-3xl tracking-tighter font-black">
          BTC Guessing Game
        </h1>
        <h2 className="font-mono text-lg">
          Welcome! 👋🏻 Please login or create an account.
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4 w-96 pt-4"
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
          <Button label="Login" type="submit" icon="→" iconPosition="right" />
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
