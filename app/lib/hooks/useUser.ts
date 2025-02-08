"use client";

import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { getUser } from "../actions"; // Adjust the import based on your file structure
import { User } from "@/app/lib/definitions";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const session = await getSession();
      if (session?.user?.email) {
        const fetchedUser = await getUser(session.user.email);
        setUser(fetchedUser);
      }
      setLoading(false);
    }

    fetchUser();
  }, []);

  return { user, loading };
}
