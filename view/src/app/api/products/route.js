
export async function GET() {
    const BASE_URL = "http://localhost:3000";
    console.log("GET products...")
    const response = await fetch(`${BASE_URL}/products`)
    const products = await response.json();
    return Response.json(products);
}