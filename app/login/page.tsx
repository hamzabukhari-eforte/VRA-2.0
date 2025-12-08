import LoginImage from "@/components/login/LoginImage";
import LoginForm from "@/components/login/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      <LoginImage />
      <div className="w-full lg:w-1/2 bg-[#2a2a2a] flex flex-col">
        <LoginForm />
      </div>
    </div>
  );
}
