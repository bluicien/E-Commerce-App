'use client'
import { useAppDispatch, useAppSelector } from '@/app/lib/hooks';
import styles from './page.module.css';
import { useState } from 'react';
import { authenticateUser } from '@/app/lib/features/authenticate/authenticateSlice';
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const [login, setLogin] = useState({
        username: "",
        password: ""
    });

    const handleKeystroke = ({target}) => {
        const { name, value } = target;
        setLogin(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/users/login", {
                method: "POST",
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(login),
            });
            console.log(response)
            const auth = await response.json();
            console.log(auth)
            if (response.ok && login.username === auth.username) {
                dispatch(authenticateUser());
                setLogin({username: "", password: ""})
                router.replace("/");
            }
            else {
                throw new Error("ERROR: Invalid username or password");
            }
            
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <section className={styles.loginBox}>  
            <h3 className={styles.loginHeader}>LOGIN</h3>
            <form className={styles.loginForm} onSubmit={handleLogin}>
                <label htmlFor="username">Username: </label>
                <input 
                    type="text" 
                    id="username" 
                    name="username" 
                    onChange={handleKeystroke} 
                    value={login.username} 
                    required />
                <label htmlFor="password">Password: </label>
                <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    onChange={handleKeystroke} 
                    value={login.password} 
                    required />
                <button type='submit'>Login</button>
            </form>
        </section>
    )
}