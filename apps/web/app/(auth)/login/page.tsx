import { Header } from "../../_components/header";
import { LoginForm } from "../_components/forms/login-form";

export default async function LoginPage() {
  return (
    <div className="relative">
      <main className="bg-white max-w-7xl container mx-auto flex flex-col min-h-screen">
        <section className="w-full border-l border-r border-gray-faint flex-1 flex flex-col justify-center items-center">
          <div className="max-w-xs w-full space-y-2">
            <LoginForm />
          </div>
        </section>
      </main>
    </div>
  );
}
