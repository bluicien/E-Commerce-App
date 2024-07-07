'use client'
import { useState } from 'react';
import styles from './signup.module.css'
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/app/lib/hooks';
import { authenticateUser } from '@/app/lib/features/authenticate/authenticateSlice';

export default function Signup() {

    const router = useRouter();
    const dispatch = useAppDispatch();

    const [ registrationForm, setRegistrationForm ] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        firstName: "",
        lastName: ""
    });

    const handleKeystroke = ({target}) => {
        const { name, value } = target;
        setRegistrationForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleRegistration = async (formBody) => {
        if (registrationForm.password !== registrationForm.confirmPassword) {
            console.log("Password does not match!")
            return;
        }
        try {
            const response = await fetch("http://localhost:3000/users/register", {
                method: "POST",
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(registrationForm)
            });
            const registration = await response.json();
            if (response.ok) {
                dispatch(authenticateUser());
                setRegistrationForm({
                    username: "",
                    password: "",
                    confirmPassword: "",
                    email: "",
                    firstName: "",
                    lastName: ""
                });
                router.replace("/")
            } else {
                throw new Error(registration.msg)
            }

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <section className={styles.signupBox} >
            <h3 className={styles.signupHeader} >SIGN UP</h3>
            <form className={styles.signupForm} action={handleRegistration} >
                <label htmlFor="username">Username: </label>
                <input 
                    type="text" 
                    id="username" 
                    name="username" 
                    onChange={handleKeystroke}
                    value={registrationForm.username}
                    required />
                <label htmlFor="password">Password: </label>
                <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    onChange={handleKeystroke}
                    value={registrationForm.password}
                    required />
                <label htmlFor="confirmPassword">Confirm Password: </label>
                <input 
                    type="password" 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    onChange={handleKeystroke}
                    value={registrationForm.confirmPassword}
                    required />
                <label htmlFor="email">Email Address: </label>
                <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    onChange={handleKeystroke}
                    value={registrationForm.email}
                    required />
                <label htmlFor="firstName">First Name: </label>
                <input 
                    type="text" 
                    id="firstName" 
                    name="firstName" 
                    onChange={handleKeystroke}
                    value={registrationForm.firstName}
                    required />
                <label htmlFor="lastName">Last Name: </label>
                <input 
                    type="text" 
                    id="lastName" 
                    name="lastName" 
                    onChange={handleKeystroke}
                    value={registrationForm.lastName}
                    required />
                <button type="submit">Register</button>
            </form>
        </section>
    )
}
