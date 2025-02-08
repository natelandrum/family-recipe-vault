import { getFamilyGroupById } from "@/app/lib/data";
import { notFound } from "next/navigation";
import { FamilyGroupDetailsCard } from "@/app/components/family/FamilyGroupDetailsCard";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Family Group Details",
    description: "Information about the family group.",
};

export default async function FamilyGroupPage(props: { params: Promise<{ family_id: string }> }) {
    const params = await props.params;
    const family_id = (params.family_id);

    if (!family_id) {
        notFound();
    }

    const familyGroup = await getFamilyGroupById(parseInt(family_id));

    if (!familyGroup) {
        notFound();
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <FamilyGroupDetailsCard familyGroup={familyGroup} />
        </div>
    );
}