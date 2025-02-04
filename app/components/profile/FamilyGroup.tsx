"use client";

import React from "react";
import { Family } from "@/app/lib/definitions";

interface FamilyGroupProps {
  familyGroup: Family[];
}

const FamilyGroup: React.FC<FamilyGroupProps> = ({ familyGroup }) => {
  return (
    <section className="p-4 bg-gray-100 rounded-lg mb-6 shadow-lg">
      <h2 className="text-2xl font-semibold mb-2">Family Group</h2>
      {familyGroup.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
          {familyGroup.map((family) => (
            <li
              key={family.family_id}
              className="bg-white p-4 rounded-lg shadow"
            >
              <p className="text-lg">{family.family_name}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No family group found.</p>
      )}
    </section>
  );
};

export default FamilyGroup;
