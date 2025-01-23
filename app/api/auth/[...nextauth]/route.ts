import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUser } from "@/app/lib/actions";

const authOptions = {
    providers : [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                let  user;
                if (credentials?.email) {
                    user = await getUser(credentials?.email)
                }
                if (user) {
                    return { email: user?.email, name: user?.name, id: user?.id }
                }
                return null;
            }
            
        })
    ],
    pages: {
                signIn: "/signin",
            },
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };