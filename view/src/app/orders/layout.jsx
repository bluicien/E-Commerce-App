import styles from './page.module.css';

export default function OrdersLayout({children}) {
    return (
        <section className={styles.ordersPage}>{children}</section>
    )
}