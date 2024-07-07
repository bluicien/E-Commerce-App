'use client'
import styles from './page.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ProductsPage() {

    const [ products, setProducts ] = useState([]);

    const getProducts = async () => {
        const response = await fetch('/api/products');
        const result = await response.json();
        setProducts(result);
    }

    useEffect(() => {
        getProducts();
    }, [])
    
    return (
        <div>
            <h2 className={styles.pageHeader}>PRODUCTS</h2>
            <ul className={styles.products} >
            {products.map((product) => (
                    <li key={product.id}>
                        <Link href={`/products/${product.id}`}>
                            <Image 
                                src={"/Thumbnail.jpg"}
                                alt={"Placeholder image"}
                                width={150}
                                height={150}
                                className={styles.thumbnail}
                            ></Image>
                        </Link>
                        <div className={styles.productInfo}>
                            <Link href={`/products/${product.id}`}>Product Name: {product.name}</Link>
                            <p>Price: {product.price}</p>
                            <p>Description: {product.description || "N/A"}</p>
                        </div>
                        <Link href={"/cart"} className={styles.cartBtn}><button>ADD TO CART</button></Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}