const BASE_URL = "http://localhost:3000";

import Image from 'next/image'

export default async function ProductPage({params}) {
    const productId = params.productId;

    const response = await fetch(`${BASE_URL}/products/${productId}`)
    const product = await response.json();
    return (
        <section>
                <Image 
                    src={"/Thumbnail.jpg"}
                    alt={"Placeholder image"}
                    width={150}
                    height={150}
                ></Image>
                <div>
                    <h4>Product Name: {product.name}</h4>
                    <p>Price: {product.price}</p>
                    <p>Description: {product.description || "N/A"}</p>
                </div>
        </section>
    )
}