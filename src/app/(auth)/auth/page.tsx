import AuthForm from "@/components/AuthForm";

import LogoText from "@/components/LogoText";


export default function Login() {
  return (
    <div className="min-h-screen flex flex-col">
      <LogoText position={"pt-[26px] pl-6"} />
      <AuthForm />
     
    </div>
  );
}
