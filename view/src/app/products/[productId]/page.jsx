// Imports
import AddToCartButton from "@/components/AddToCartButton/AddToCartButton";
import styles from "./page.module.css";
import Image from 'next/image'
import BackButton from "@/components/BackButton/BackButton";

// Backend base url
const BACKEND_URL = process.env.BACKEND_URL;

// A single product's page
export default async function ProductPage({params}) {

    // Get productId from params
    const productId = params.productId;
    
    // Fetch product details from backend with params productId
    const response = await fetch(`${BACKEND_URL}/products/${productId}`, { cache: 'no-store'} )
    const product = await response.json();
    console.log(product)

    return (
        // Product Page Section
        <section className={styles.productPage} >

            {/* Product Section */}
            <div className={styles.product} >

                {/* Product Image */}
                <Image 
                    src={product.url}
                    alt={"Placeholder image"}
                    width={400}
                    height={400}
                    className={styles.thumbnail}
                ></Image>
                
                {/* Product information section */}
                <section className={styles.infoSection} >

                    {/* Product information: Product name, price and description */}
                    <h2 className={styles.productTitle} >{product.name}</h2> 
                    <p className={styles.price} >Price: {product.price}</p>
                    <p className={styles.description} >Description: {product.description || "N/A"}</p>

                    {/* Purchase/Wishlist section after divider */}
                    <hr className={styles.buttonsDivider} />
                    <div className={styles.buttons}>
                        <AddToCartButton productId={product.id} />
                    </div>
                </section>
            </div>

            {/* Return to previous page */}
            <BackButton />
        </section>
    )
}
