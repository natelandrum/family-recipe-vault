"use client";

import React from "react";

interface UserInfoProps {
  name: string;
  email: string;
}

const UserInfo: React.FC<UserInfoProps> = ({ name, email }) => {
  return (
    <section className="p-4 bg-gray-100 rounded-lg mb-6 shadow-lg lg:col-span-2">
      <h2 className="text-3xl font-semibold mb-2">User Info</h2>
      <p className="">
        <strong>Name:</strong> {name}
      </p>
      <p className="">
        <strong>Email:</strong> {email}
      </p>
    </section>
  );
};

export default UserInfo;
