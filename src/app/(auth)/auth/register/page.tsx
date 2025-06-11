import AuthForm from "@/components/AuthForm";

import LogoText from "@/components/LogoText";

export default function Register() {
  return (
    <div className="max-h-screen flex flex-col">
      <LogoText position={"pt-[26px] pl-6"} />
      <AuthForm />
    </div>
  );
}
