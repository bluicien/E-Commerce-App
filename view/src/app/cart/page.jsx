'use client'
import useSWR from 'swr';
import styles from './cart.module.css';
import Cart from '@/components/Cart/Cart';



export default function CartPage() {
    
    const fetcher = (url) => fetch(url, { credentials: 'include' }).then((res) => res.json());
    const { data, error, isLoading } = useSWR("http://localhost:3000/cart", fetcher);

    return (
        <section className={styles.cartPage}>
            <h2 className={styles.pageHeader}>My Cart</h2>
            {
                isLoading
                ? <p>Loading...</p>
                : <Cart cartData={data} />
            }
        </section>
    )
}