import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // Insert into PostgreSQL
    const query = "INSERT INTO contact_messages (name, email, message) VALUES ($1, $2, $3) RETURNING *";
    const values = [name, email, message];
    const result = await pool.query(query, values);

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
