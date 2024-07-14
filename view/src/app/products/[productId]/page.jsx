// Imports
import AddToCartButton from "@/components/AddToCartButton/AddToCartButton";
import styles from "./page.module.css";
import Image from 'next/image'
import BackButton from "@/components/BackButton/BackButton";


// Backend base url
const BASE_URL = "http://localhost:3000";

// A single product's page
export default async function ProductPage({params}) {

    // Get productId from params
    const productId = params.productId;
    
    // Fetch product details from backend with params productId
    const response = await fetch(`${BASE_URL}/products/${productId}`)
    const product = await response.json();

    return (
        // Product Page Section
        <section className={styles.productPage} >

            {/* Product Section */}
            <div className={styles.product} >

                {/* Product Image */}
                <Image 
                    src={"/Thumbnail.jpg"}
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
                        <AddToCartButton />
                    </div>
                </section>
            </div>

            {/* Return to previous page */}
            <BackButton />
        </section>
    )
}
