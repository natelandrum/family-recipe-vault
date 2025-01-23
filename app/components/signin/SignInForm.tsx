"use client";

import { useState, useEffect, useActionState } from "react";
import { authorizeUser } from "@/app/lib/actions";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";


export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  const initialState = {
    message: null,
    errors: {},
  };

  const [state, dispatch] = useActionState(authorizeUser, initialState);

  // Implement UseEffect Here
  useEffect(() => {
    const handleSignIn = async () => {
      if (state.message == "Success") {
        const result = await signIn("credentials", {
          email: email,
          password: password,
          redirect: false,
        });
        if (!result?.error) {
          redirect("/");
        }
      }
    };
    handleSignIn();
  }, [state.message, email, password]);


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome Back
        </h1>
        <p className="text-center text-gray-600 mb-4">Sign in to continue</p>

        <form action={dispatch} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`mt-2 w-full p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                state.errors?.email ? "border-red-500 border-2" : ""
              }`}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`mt-2 w-full p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  state.errors?.password ? "border-red-500 border-2" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-6 right-0 pr-3 text-sm leading-5"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div id="status-error" aria-live="polite" aria-atomic="true">
            {state.errors &&
              Object.entries(state.errors).map(([field, errors]) => (
                <div key={field}>
                  {errors &&
                    errors.map((error) => {
                      return (
                        <p key={error} className="mt-2 text-sm text-red-500">
                          {error}
                        </p>
                      );
                    })}
                </div>
              ))}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Don&apos;t have an account?{" "}
          <a
            href="/signup"
            className="text-blue-500 font-medium hover:underline"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
