import Button from "@/components/common/button";
import Input from "@/components/common/input";

function Login() {
  return (
    <main className="flex items-center justify-center min-h-screen font-mono">
      <div className="flex flex-col bg-white rounded-lg items-center justify-center p-4 h-[500px] w-[800px] space-y-4">
        <h1 className="font-inter text-3xl tracking-tighter font-black">
          BTC Guessing Game
        </h1>
        <h2 className="font-mono text-lg">
          Let&apos;s create your account. 🚀
        </h2>
        <div className="flex flex-col space-y-4 w-96 pt-4">
          <Input
            label="name"
            labelDescription="First name"
            type="text"
            placeholder="Your first name"
          />
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
          <Button
            label="Create new user"
            type="submit"
            icon="→"
            iconPosition="right"
          />
        </div>
      </div>
    </main>
  );
}

export default Login;
