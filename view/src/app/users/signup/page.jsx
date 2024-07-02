'use client'
import styles from './signup.module.css'

export default function Signup() {
    return (
        <section className={styles.signupBox} >
            <h3 className={styles.signupHeader} >SIGN UP</h3>
            <form className={styles.signupForm} >
                <label for="username">Username: </label>
                <input type="text" id="username" name="username" required />

                <label for="pswrd">Password: </label>
                <input type="password" id="pswrd" name="pswrd" required />

                <label for="confirmPswrd">Confirm Password: </label>
                <input type="password" id="confirmPswrd" name="confirmPswrd" required />

                <label for="email">Email Address: </label>
                <input type="email" id="email" name="email" required />

                <label for="firstName">First Name: </label>
                <input type="text" id="firstName" name="firstName" required />

                <label for="lastName">Last Name: </label>
                <input type="text" id="lastName" name="lastName" required />

                <button type="submit">Register</button>
            </form>
        </section>
    )
}
