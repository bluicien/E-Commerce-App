'use client'
import styles from "./AddToCartButton.module.css"
import Link from "next/link";

// Art Add to Cart button, handles functionality of sending PUT request to update cart
export default function AddToCartButton({productId}) {

    // Send PUT request to http://localhost:3000/products/:productId/addtocart to add to or update cart.
    const handleAddToCart = () => {
        fetch(`http://localhost:3000/products/${productId}/addtocart`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity: 1 })
        });
    }

    return <Link href={"/cart"} className={styles.cartBtn}><button onClick={handleAddToCart}>ADD TO CART</button></Link>;
}