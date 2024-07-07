import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const data = await req.json()
        const response = await fetch("http://localhost:3000/users/login", {
            method: "POST",
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        console.log(response)

        if (!response.ok) {
            throw new Error("ERROR: Invalid username or password");
        }
        
        const auth = await response.json();
        return NextResponse.json(auth);

    } catch (error) {
        return NextResponse.json(error);
    }
}