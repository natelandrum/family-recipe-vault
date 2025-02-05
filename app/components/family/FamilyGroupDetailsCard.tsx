interface FamilyGroupDetailsCardProps {
    familyGroup: {
      family_id: string;
      family_name: string;
    };
  }
  
  export const FamilyGroupDetailsCard: React.FC<FamilyGroupDetailsCardProps> = ({ familyGroup }) => {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg h-full flex flex-col justify-center items-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
            Family: {familyGroup.family_name}
          </h1>
          <p className="text-lg text-gray-600">Family ID: {familyGroup.family_id}</p>
        </div>
      </div>
    );
  };  