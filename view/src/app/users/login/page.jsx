'use client'
import styles from './page.module.css';
import { useState } from 'react';

export default function Login() {
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

    const handlePost = async () => {
        try {
            const response = await fetch("http://localhost:3000/users/login", {
                method: "POST",
                credentials: 'include',
                body: JSON.stringify(login),
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const result = response.json();

            if (result.authenticated && login.username === result.username) {
                
            }
            
        } catch (error) {
            console.log("Internal Server Error");
        }
        
    }

    return (
        <section className={styles.loginBox}>  
            <h3 className={styles.loginHeader}>LOGIN</h3>
            <form className={styles.loginForm} action={handlePost}>
                <label>Username: </label>
                <input 
                    type="text" 
                    id="username" 
                    name="username" 
                    onChange={handleKeystroke} 
                    value={login.username} 
                    required />
                <label>Password: </label>
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