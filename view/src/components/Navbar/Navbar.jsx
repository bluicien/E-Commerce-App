'use client'
import useSWR from "swr";
import Link from "next/link"
import styles from './Navbar.module.css'
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { useAppSelector, useAppDispatch } from "@/app/lib/hooks";
import { authenticateUser, unAuthenticateUser } from "@/app/lib/features/authenticate/authenticateSlice";
import { Suspense, useEffect } from "react";

// Fetcher function to check authentication

export default function Navbar() {
    
    // Get state of user
    
    // Declare dispatch hook
    const dispatch = useAppDispatch();
    
    // Fetcher function to send request to check if user is still authenticated
    const fetcher = (url) => fetch(url, { credentials: 'include' }).then((res) => res);
    // On page refresh, send session cookie from browser to backend to check if user is still authenticated. 
    const { data, error, isLoading } = useSWR("http://localhost:3000/isAuth", fetcher);
    
    if (error) console.log(error);
    
    // Based on response from backend, set browser state to authenticated or un-authenticate user.
    useEffect(() => {
        if (isLoading) {
            return
        }
        if (data && data.ok) {
            dispatch(authenticateUser());
        } else {
            dispatch(unAuthenticateUser());
        }
    }, [isLoading])

    // Get the current authentication state using the redux state selector
    const isAuthenticated = useAppSelector(state => state.authenticate.isAuthenticated);
    
    return (
        <nav className={styles.navBar} >
            <Link href="/" className={styles.navLogo}>E-Comm</Link>
            <div className={styles.dropdown}>
                <button className={styles.dropBtn} >Menu&nbsp;<IoIosArrowDropdownCircle /></button>
                <div className={styles.dropdownContent}>
                    <Link href="/products" >Products</Link>
                    <Link href="/" >Orders</Link>
                    <Link href="/" >Categories</Link>
                </div>
            </div>
            {/* Will not render the user buttons until authentication check is complete to prevent buttons flickering */}
            { !isLoading &&
            <Suspense fallback={ <p>Is loading...</p>}>
                {!isAuthenticated && <Link href="/users/signup" className={styles.navButtons}>Sign-Up</Link>}
                {!isAuthenticated && <Link href="/users/login" className={styles.navButtons}>Login</Link>}
                {isAuthenticated && <Link href="/users/logout" className={styles.navButtons}>Log Out</Link>}
            </Suspense>
            }
        </nav>
    )
}