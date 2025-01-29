"use server";

import { z } from "zod";
import { sql } from "@vercel/postgres";
import { Recipe } from "@/app/lib/definitions";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

const passwordValidation = new RegExp(
  /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*/
);

const AuthenticationSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" })
    .regex(passwordValidation, { message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character" }),
});

const RegistrationSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" })
    .regex(passwordValidation, { message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character" }),
    confirmPassword: z.string().min(8, { message: "Password confirmation must be at least 8 characters" }),
})
.refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type AuthenticationState = {
    errors?: {
        email?: string[];
        password?: string[];
    }
    message?: string | null;
};

export type RegistrationState = {
    errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
    }
    message?: string | null; 
};

export async function registerUser(prevState: RegistrationState, formData: FormData): Promise<RegistrationState> {
    const validatedFields = RegistrationSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
    });

    if (!validatedFields.success) {
        return { ...prevState, errors: validatedFields.error.flatten().fieldErrors };
    }

    const { name, email, password } = validatedFields.data;

    const user = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (user.rowCount && user.rowCount > 0) {
        return { message: "User already exists" };
    }

    const passwordHashed = await bcrypt.hash(password, 10);

    try {
        await sql`INSERT INTO users (name, email, password) VALUES (${name}, ${email}, ${passwordHashed})`;
    }
    catch (error) {
        console.error(error);
        return { message: "Database Error. Failed to create user." };
    }
    redirect("/signin");
};

export async function authorizeUser(prevState: AuthenticationState, formData: FormData): Promise<AuthenticationState> {
    const validatedFields = AuthenticationSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!validatedFields.success) {
        return {...prevState, errors: validatedFields.error.flatten().fieldErrors };
    }

    const { email, password } = validatedFields.data;

    const user = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (!user.rowCount || user.rowCount === 0) {
        return { errors: { email: ["User not found"] } };
    }    

    const userRecord = user.rows[0];
    const passwordMatch = await bcrypt.compare(password, userRecord.password);
    if (!passwordMatch) {
        return { errors: { password: ["Invalid password"] } };
    } 
    return {message: "Success"};
}

export async function getUser(email: string) {
    const user = await sql`SELECT * FROM users WHERE email = ${email}`;
    return user.rows[0];
}


export async function getRecipes(): Promise<Recipe[]> {
    try {
        const result = await sql`SELECT * FROM recipe ORDER BY created_on DESC`;
        return result.rows.map(row => ({
            recipe_id: row.recipe_id,
            recipe_name: row.recipe_name,
            recipe_servings: row.recipe_servings,
            recipe_description: row.recipe_description,
            recipe_instructions: row.recipe_instructions,
            meal_type: row.meal_type,
            recipe_image: row.recipe_image || null,
            created_on: row.created_on,
            user_id: row.user_id,
        })) as Recipe[];
    } catch (error) {
        console.error("Error fetching recipes:", error);
        return [];
    }
}
  
