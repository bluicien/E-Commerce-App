'use client'
import Link from "next/link"
import styles from './Navbar.module.css'
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { useAppSelector } from "@/app/lib/hooks";


export default function Navbar() {
    const isAuthenticated = useAppSelector(state => state.authenticate.isAuthenticated);

    return (
        <nav className={styles.navBar} >
            <Link href="/" className={styles.navLogo}>E-Comm</Link>
            <div className={styles.dropdown}>
                <button className={styles.dropBtn} >Menu&nbsp;<IoIosArrowDropdownCircle /></button>
                <div className={styles.dropdownContent}>
                    <Link href="/" >Orders</Link>
                    <Link href="/" >Categories</Link>
                    <Link href="/" >To be implemented</Link>
                </div>
            </div>
            {!isAuthenticated && <Link href="/users/signup" className={styles.navButtons}>Sign-Up</Link>}
            {!isAuthenticated && <Link href="/users/login" className={styles.navButtons}>Login</Link>}
            {isAuthenticated && <Link href="/users/logout" className={styles.navButtons}>Log Out</Link>}
        </nav>
    )
}