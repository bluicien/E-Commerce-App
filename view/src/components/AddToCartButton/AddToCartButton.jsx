'use client'
import { useState } from "react";
import styles from "./AddToCartButton.module.css"
import { useRouter } from "next/navigation";
import { FaHeart } from "react-icons/fa6";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

// Art Add to Cart button, handles functionality of sending PUT request to update cart
export default function AddToCartButton({productId}) {
    const router = useRouter();
    const [ quantity, setQuantity ] = useState(1);
    

    // Send PUT request to http://localhost:3000/products/:productId/addtocart to add to or update cart.
    const handleAddToCart = async (event) => {
        event.preventDefault();

        const response = await fetch(`${BACKEND_URL}/products/${productId}/addtocart`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity: quantity })
        });
        if (!response.ok) {
            console.log("Failed to add to cart");
            return;
        }
        console.log("Product added to cart.");
        router.push("/cart");
        return;
    }

    // Handles change in quantity input field. 
    const handleChange = ({target}) => {
        const { value } = target;
        if (value < 0) {
            // If the user sets value to negative, automatically reset to 0
            setQuantity(0);
        }
        else {
            // Set the value of the quantity state
            setQuantity(value)
        }  
    }

    return (
        <form className={styles.cartForm} onSubmit={handleAddToCart}>
            <div className={styles.purchaseOptions} >
                <input 
                    type="number" 
                    id="quantity" 
                    className={styles.quantity} 
                    value={quantity} 
                    onChange={handleChange} 
                    min={0}
                />
                <a className={styles.wishlistBtn} >Wish&nbsp;<FaHeart /></a>
            </div>
            <button className={styles.cartBtn} type="submit">ADD TO CART</button>
        </form>
    );
}