'use client'
import Link from "next/link"
import styles from './Navbar.module.css'
import { IoIosArrowDropdownCircle } from "react-icons/io";


export default function Navbar() {
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
            <Link href="/users/signup" className={styles.navButtons}>Sign-Up</Link>
            <Link href="/users/login" className={styles.navButtons}>Login</Link>
        </nav>
    )
}