"use client";

import { userRegister } from "@/actions/server-actions";
import Button from "@/components/common/button";
import Input from "@/components/common/input";
import { CREATE_USER_SCHEMA } from "@/constants/form-schemas";
import { PAGES } from "@/constants/pages-apis-mapping";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

type CreateUserFormInputs = z.infer<typeof CREATE_USER_SCHEMA>;

function CreateUser() {
  const router = useRouter();
  const [isCreatingUser, startCreatingUser] = useTransition();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserFormInputs>({
    resolver: zodResolver(CREATE_USER_SCHEMA),
    mode: "onSubmit",
    defaultValues: {
      firstName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: CreateUserFormInputs) => {
    const { firstName, email, password } = data;

    startCreatingUser(async () => {
      try {
        await userRegister(email, password, firstName);
        toast.success(
          `${firstName}, your account was created successfully. Redirecting to login...`
        );
        router.push(PAGES.LOGIN);
      } catch (error) {
        const errorMessage = (error as Error).message;
        toast.error(errorMessage);
      }
    });
  };

  return (
    <main className="flex items-center justify-center min-h-screen font-mono">
      <div className="flex flex-col bg-white rounded-lg items-center justify-center p-4 h-[600px] w-[800px] space-y-8 shadow-2xl">
        <div className="flex flex-col space-y-4 items-center">
          <h1 className="font-inter text-3xl tracking-tighter font-black">
            BTC Guessing Game
          </h1>
          <h2 className="font-mono text-lg">
            Let&apos;s create your account. 🚀
          </h2>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4 w-96 pt-4"
        >
          <Controller
            control={control}
            name="firstName"
            render={({ field }) => (
              <Input
                {...field}
                label="firstName"
                labelDescription="First name"
                type="text"
                placeholder="Your first name"
                error={errors.firstName?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Input
                {...field}
                label="email"
                labelDescription="Email"
                type="email"
                placeholder="Your email address"
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
                labelDescription="Your password"
                type="password"
                placeholder="Your password"
                error={errors.password?.message}
              />
            )}
          />
          <Button
            isLoading={isCreatingUser}
            label={
              isCreatingUser ? "Creating account..." : "Create new account"
            }
            type="submit"
            icon="→"
            iconPosition="right"
          />
        </form>
        <p className="text-sm text-center tracking-tighter">
          Already have an account?&nbsp;
          <Link
            href={PAGES.LOGIN}
            className="underline underline-offset-2 decoration-dotted decoration-berkeleyBlue focus:ring-2 focus:ring-offset-2 focus:ring-berkeleyBlue focus:outline-none"
          >
            Login here
          </Link>
        </p>
      </div>
    </main>
  );
}

export default CreateUser;
