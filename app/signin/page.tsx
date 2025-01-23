import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SignInForm from "@/app/components/signin/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account.",
};

export default async function SignInPage() {
      const session = await getServerSession();
  
      if (session) {
          redirect("/");
      }

      return <SignInForm />;
}
