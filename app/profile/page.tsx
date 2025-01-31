import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { getUser } from "../lib/actions";
import { getRecipesByUser, getFamilyGroupByUser } from "../lib/data";
import UserInfo from "../components/profile/UserInfo";
import RecipeList from "../components/profile/RecipeList";
import FamilyGroup from "../components/profile/FamilyGroup";
import AddRecipeForm from "../components/profile/AddRecipeForm";

export default async function ProfilePage() {
    const session = await getServerSession();
    if (!session) {
        redirect('/signin');
    }

    if (session && session.user && session.user.email) {
        const userEmail = session?.user?.email;
        const user = await getUser(userEmail);

        if (user?.id) {
            const recipes = await getRecipesByUser(user.id);
            const familyGroup = await getFamilyGroupByUser(user.id);

            return (
                <div className="container mx-auto p-4 space-y-6">
                    <UserInfo name={user.name} email={user.email} />
                    <RecipeList recipes={recipes} />
                    <FamilyGroup familyGroup={familyGroup} />
                    <AddRecipeForm currentAdd={{ currentAdd: true }} userId={user.id} />
                </div>
            );
        }
    }
}