// 'use client'
import AddToCartButton from '@/components/AddToCartButton/AddToCartButton';
import styles from './page.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
// import { useEffect, useState } from 'react';
const BACKEND_URL = process.env.BACKEND_URL;

export default async function ProductsPage() {

    console.log("Rendering Server Component ProductsPage...")

    // const [ products, setProducts ] = useState([]);

    // const getProducts = async () => {
    //     const response = await fetch('api/products');
    //     const result = await response.json();
    //     setProducts(result);
    //     return;
    // }

    const getProducts = async () => {
        console.log("GET products...")
        const response = await fetch(`${BACKEND_URL}/products`, { cache: 'no-store'} )
        const products = await response.json();
        return products;
    }

    const products = await getProducts();

    // useEffect(() => {
    //     getProducts();
    // }, [])
    
    return (
        <div>
            <h2 className={styles.pageHeader}>PRODUCTS</h2>
            <ul className={styles.products} >
            <Suspense fallback={<p>Loading...</p>} >
                {products.map((product) => (
                    <li key={`product-${product.id}`}>
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
                        <AddToCartButton productId={product.id} />
                    </li>
                ))}
            </Suspense>
            </ul>
        </div>
    );
}