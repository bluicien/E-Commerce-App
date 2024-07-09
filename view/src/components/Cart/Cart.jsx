'use client'
import Image from "next/image";
import Link from "next/link";
import styles from "./Cart.module.css"

export default function Cart({cartData}) {
    const { cart, cartTotal } = cartData;
    console.log(cart);
    let cartItems;
    if (cart && cart.length > 0) {
        cartItems = cart.map(product => 
                <li key={product.product_id}>
                <Link href={`/products/${product.product_id}`}>
                    <Image 
                        src={"/Thumbnail.jpg"}
                        alt={"Placeholder image"}
                        width={150}
                        height={150}
                        className={styles.thumbnail}
                    ></Image>
                </Link>
                <div className={styles.productInfo}>
                    <h5>Product Name: {product.name}</h5>
                    <p>Quantity: {product.quantity}</p>
                    <p>Price: {product.line_total}</p>
                    <p>Description: {product.description || "N/A"}</p>
                </div>
            </li>
        )
    } else {
        cartItems = <li>Your cart is empty</li>
    }

    return (
        <section className={styles.products}>
            <ul className={styles.cartComponent}>
                {cartItems}
            </ul>
            <div className={styles.totalDiv}>
                <h6 className={styles.cartTotal}>CART TOTAL: {cartTotal || "$0"}</h6>
                <Link href={"/"} className={styles.checkoutBtn}>Checkout</Link>
            </div>
        </section>
    )
}