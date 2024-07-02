import styles from './page.module.css';

export default function ProductsLayout({children}) {
    return (
        <section className={styles.productsPage}>{children}</section>
    )
}