'use client'
import useSWR from "swr";
import styles from "./AddToCartButton.module.css"
import Link from "next/link";


export default function AddToCartButton({productId}) {

    // const fetcher = () => {
    //     fetch(`http://localhost:3000/products/${productId}/addtocart`, {
    //         method: "PUT",
    //         credentials: "include",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({ quantity: 1 })
    //     });
    // }
    // const { data, error, isLoading } = useSWR(`http://localhost:3000/products/${productId}/addtocart`, fetcher);

    return <Link href={"/cart"} className={styles.cartBtn}><button /*</Link>onClick={fetcher}*/ >ADD TO CART</button></Link>;
}