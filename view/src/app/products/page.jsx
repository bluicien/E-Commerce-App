import styles from './page.module.css';
const BASE_URL = "http://localhost:3000";
import Image from 'next/image';
import Link from 'next/link';

export default async function ProductsPage() {
    const response = await fetch(`${BASE_URL}/products`)
    const products = await response.json();

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