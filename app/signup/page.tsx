import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import RegisterForm from "../components/signup/RegisterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Sign up for a new account.",
};

export default async function SignUpPage() {
    const session = await getServerSession();

    if (session) {
        redirect("/");
    }

    return <RegisterForm />;

}
