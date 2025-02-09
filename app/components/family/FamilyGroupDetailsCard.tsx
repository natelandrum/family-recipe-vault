interface FamilyGroupDetailsCardProps {
    familyGroup: {
      family_id: string;
      family_name: string;
    };
  }
  
  export const FamilyGroupDetailsCard: React.FC<FamilyGroupDetailsCardProps> = ({ familyGroup }) => {
    return (
      <div className="container mx-auto p-6 justify-center">
          <h1 className="text-4xl text-gray-800 font-bold text-center">
            Recipe Vault from <span className="text-[var(--color-dark)] text-4xl">{familyGroup.family_name}</span> Family
          </h1>
          {/* <p className="text-lg text-gray-600">Family ID: {familyGroup.family_id}</p> */}
      </div>
    );
  };  