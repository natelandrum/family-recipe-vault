import { redirect } from "next/navigation";
import AddRecipeForm from "../components/profile/AddRecipeForm";
import { getServerSession } from "next-auth";
import { getUser } from "../lib/actions";


export default async function ProfilePage() {
    const session = await getServerSession();
    if (!session) {
            redirect('/signin');
    }

    if (session && session.user && session.user.email) {
        const userEmail = session?.user?.email;
        const user = await getUser(userEmail);
            return (
    <>
        {user?.id && <AddRecipeForm currentAdd={{ currentAdd: true }} userId={user.id} />}
    </>
    );
    }




}