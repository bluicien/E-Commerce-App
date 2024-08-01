'use client'
import useSWR from 'swr';
import styles from './cart.module.css';
import Cart from '@/components/Cart/Cart';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

const fetcher = (url) => fetch(url, { credentials: 'include' }).then((res) => res.json());

export default function CartPage() {
    
    const { data, error, isLoading } = useSWR(`${BACKEND_URL}/cart`, fetcher);

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