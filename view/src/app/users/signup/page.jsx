'use client'
import styles from './signup.module.css'

export default function Signup() {
    return (
        <section className={styles.signupBox} >
            <h3 className={styles.signupHeader} >SIGN UP</h3>
            <form className={styles.signupForm} >
                <label htmlFor="username">Username: </label>
                <input type="text" id="username" name="username" required />

                <label htmlFor="password">Password: </label>
                <input type="password" id="password" name="pswrd" required />

                <label htmlFor="confirmPassword">Confirm Password: </label>
                <input type="password" id="confirmPassword" name="confirmPassword" required />

                <label htmlFor="email">Email Address: </label>
                <input type="email" id="email" name="email" required />

                <label htmlFor="firstName">First Name: </label>
                <input type="text" id="firstName" name="firstName" required />

                <label htmlFor="lastName">Last Name: </label>
                <input type="text" id="lastName" name="lastName" required />

                <button type="submit">Register</button>
            </form>
        </section>
    )
}
