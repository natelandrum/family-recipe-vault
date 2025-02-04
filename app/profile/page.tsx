import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { getUser } from "../lib/actions";
import { getRecipesByUser, getFamilyGroupByUser } from "../lib/data";
import UserInfo from "../components/profile/UserInfo";
import RecipeList from "../components/profile/RecipeList";
import FamilyGroup from "../components/profile/FamilyGroup";

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
              <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <UserInfo name={user.name} email={user.email} />
                <FamilyGroup familyGroup={familyGroup} />
                <div className="md:col-span-3">
                  <RecipeList recipes={recipes} userId={user.id} />
                </div>
              </div>
            );
        }
    }
}