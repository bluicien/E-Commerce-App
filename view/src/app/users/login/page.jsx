'use client'
import styles from './page.module.css';

export default function Login() {
    return (
        <section className={styles.loginBox}>  
            <h3 className={styles.loginHeader}>LOGIN</h3>
            <form className={styles.loginForm}>
                <label>Username: </label>
                <input type="text" id="username" name="username" required/>
                <label>Password: </label>
                <input type="password" id="pswrd" name="pswrd" required/>
                <button type='submit'>Login</button>
            </form>
        </section>
    )
}