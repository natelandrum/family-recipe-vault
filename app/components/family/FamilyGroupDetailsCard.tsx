interface FamilyGroupDetailsCardProps {
    familyGroup: {
      family_id: string;
      family_name: string;
    };
  }
  
  export const FamilyGroupDetailsCard: React.FC<FamilyGroupDetailsCardProps> = ({ familyGroup }) => {
    return (
      <div className="mb-8 mt-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
          {familyGroup.family_name} Recipes
        </h1>
      </div>
    );
  };  