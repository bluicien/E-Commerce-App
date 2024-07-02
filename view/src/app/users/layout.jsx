import styles from './users.module.css'

export default function UserLayout({children}) {
    return <div className={styles.userPage}>{children}</div>
}