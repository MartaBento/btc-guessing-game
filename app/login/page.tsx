import Button from "@/components/common/button";
import Input from "@/components/common/input";
import { PAGES } from "@/constants/pages-mapping";
import Link from "next/link";

function Login() {
  return (
    <main className="flex items-center justify-center min-h-screen font-mono">
      <div className="flex flex-col bg-white rounded-lg items-center justify-center p-4 h-[500px] w-[800px] space-y-4">
        <h1 className="font-inter text-3xl tracking-tighter font-black">
          BTC Guessing Game
        </h1>
        <h2 className="font-mono text-lg">
          Welcome! 👋🏻 Please login or create an account.
        </h2>
        <div className="flex flex-col space-y-4 w-96 pt-4">
          <Input
            label="email"
            labelDescription="Email"
            type="email"
            placeholder="Your email"
          />
          <Input
            label="password"
            labelDescription="Password"
            type="password"
            placeholder="Your password"
          />
          <Button label="Login" type="submit" icon="→" iconPosition="right" />
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
      </div>
    </main>
  );
}

export default Login;
