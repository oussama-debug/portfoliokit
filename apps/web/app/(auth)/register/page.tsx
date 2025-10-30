import { Header } from "../../_components/header";
import { RegisterForm } from "../_components/forms/register-form";

export default async function RegisterPage() {
  return (
    <div className="relative">
      <main className="bg-white max-w-7xl container mx-auto flex flex-col min-h-screen">
        <Header />
        <section className="w-full border-l border-r border-gray-faint flex-1 flex flex-col justify-center items-center">
          <div className="max-w-xs w-full space-y-2">
            <RegisterForm />
          </div>
        </section>
      </main>
    </div>
  );
}
