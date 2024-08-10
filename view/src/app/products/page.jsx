// 'use client'
import AddToCartButton from '@/components/AddToCartButton/AddToCartButton';
import styles from './page.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

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
    // /productImages/tip-top-icecream.png
    // /productImages/tip-top-icecream-png
    return (
        <div>
            <h2 className={styles.pageHeader}>PRODUCTS</h2>
            <ul className={styles.products} >
            <Suspense fallback={<p>Loading...</p>} >
                {products.map((product) => (
                    <li key={`product-${product.id}`}>
                        <Link href={`/products/${product.id}`}>
                            <Image 
                                src={`${product.url}`}
                                alt={"Placeholder image"}
                                width={150}
                                height={150}
                                className={styles.thumbnail}
                            ></Image>
                        </Link>
                        <div className={styles.productInfo}>
                            <Link href={`/products/${product.id}`} className={styles.productDetail} ><span id='brandname' >{product.brand_name}</span> {product.name}</Link>
                            <p className={styles.productDetail} >Price: {product.price}</p>
                            <p className={styles.productDetail} >Description: {product.description || "N/A"}</p>
                        </div>
                        <AddToCartButton productId={product.id} />
                    </li>
                ))}
            </Suspense>
            </ul>
        </div>
    );
}