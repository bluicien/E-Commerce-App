import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req) {
    console.log("Fetching cart...")
    const loginCookie = cookies().get('connect.sid');
    try {
        console.log(loginCookie)
        const response = await fetch('http://localhost:3000/cart', { cache: 'no-store' }, {
            method: "GET",
            credentials: 'include',
            headers: { "Content-Type": "application/json", cookies: loginCookie },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch cart")
        }

        const cartData = await response.json();
        console.log(cartData)
        return NextResponse.json({cartData, status: (200)});
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({error, status: 400})
    }
}