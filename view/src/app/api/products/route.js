
export async function GET() {
    console.log("GET products...")
    const BASE_URL = "http://localhost:3000";
    const response = await fetch(`${BASE_URL}/products`)
    const products = await response.json();
    return Response.json(products);
}