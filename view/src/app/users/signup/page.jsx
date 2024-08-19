'use client'
import { useState } from 'react';
import styles from './signup.module.css'
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/app/lib/hooks';
import { authenticateUser } from '@/app/lib/features/authenticate/authenticateSlice';
import NormalUserForm from '@/components/SignupForm/NormalUserForm';
import OrganizationForm from '@/components/SignupForm/OrganizationForm.jsx';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export default function Signup() {

    const router = useRouter(); // Assign router function to variable
    const dispatch = useAppDispatch(); // Assign dispatch function to variable

    // State for manage controlled registration form
    const [ registrationForm, setRegistrationForm ] = useState({
        organization: "",
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        firstName: "",
        lastName: "",
        termsOfService: false
    });

    // State to manage type of form
    const [ formType, setFormType ] = useState({
        normalUser: true,
        organization: false
    })

    // Handle form input for each keystroke and update state
    const handleKeystroke = ({target}) => {
        const { name, value } = target;
        setRegistrationForm(prev => ({ ...prev, [name]: value }))
    }

    // Handle the the on/off of the checkbox and update state
    const handleCheckbox = ({target}) => {
        const { name, checked } = target;
        checked 
            ? setRegistrationForm(prev => ({ ...prev, [name]: true })) 
            : setRegistrationForm(prev => ({ ...prev, [name]: false }))
    }

    // Handle submission of form and post request to backend server
    const handleRegistration = async () => {

        // If passwords do not match, function returns and does not continue
        if (registrationForm.password !== registrationForm.confirmPassword) {
            console.log("Password does not match!")
            return;
        }

        // Try post fetch request to backend server route "/users/register"
        try {
            const registrationEndpoint = normalUser ? "register" : "registerOrganization";
            const response = await fetch(`${BACKEND_URL}/users/${registrationEndpoint}`, {
                method: "POST",
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(registrationForm)
            });
            
            const registration = await response.json(); // Parse backend response to json

            // If response is ok. Dispatch authenticateUser() action to redux state
            // to change frontend state and allow user to access authenticated apis
            if (response.ok) {
                dispatch(authenticateUser());
                setRegistrationForm({
                    organization: "",
                    username: "",
                    password: "",
                    confirmPassword: "",
                    email: "",
                    firstName: "",
                    lastName: "",
                    termsOfService: false
                });
                router.replace("/") // Re-route user to home
            } else {
                throw new Error(registration.msg) // If error, throw error with response message
            }

        } catch (error) {
            console.log(error);
        }
    }

    // Handle switching of form types from normal user and organization when button is clicked
    const changeFormType = (userType) => {
        for (const key in formType) {
            key === userType 
                ? setFormType(prev => ({...prev, [key]: true})) 
                : setFormType(prev => ({...prev, [key]: false}))
        }

        setRegistrationForm(prev => ({...prev, termsOfService: false}))
    }

    // Assign type of form component to regFormType based on form type state as a condition
    let regFormType;
    if (formType.normalUser) {
        regFormType = (
            <NormalUserForm
            handleKeystroke={handleKeystroke}
            handleCheckbox={handleCheckbox}
            handleRegistration={handleRegistration}
            registrationForm={registrationForm}
            />
        )
    } else if (formType.organization) {
        regFormType = (
            <OrganizationForm
            handleKeystroke={handleKeystroke}
            handleCheckbox={handleCheckbox}
            handleRegistration={handleRegistration}
            registrationForm={registrationForm}
            />
        )
    }

    // Render component
    return (
        <section className={styles.signupBox} >
            <h3 className={styles.signupHeader} >SIGN UP</h3>
            <div className={styles.accountType} >
                <button className={formType.normalUser ? styles.accountTypeBtn + ' ' + styles.activeBtn : styles.accountTypeBtn} id='normalUser' onClick={() => changeFormType("normalUser")} >
                    Individual
                </button>
                <button className={formType.organization ? styles.accountTypeBtn + ' ' + styles.activeBtn : styles.accountTypeBtn} id='organization' onClick={() => changeFormType("organization")} >
                    Organization
                </button>
            </div>
            { regFormType }
        </section>
    )
}

            {/* <form className={styles.signupForm} action={handleRegistration} >
                <div className={styles.inputGroup} >
                    <label htmlFor="username">Username * </label>
                    <input 
                        type="text" 
                        id="username" 
                        name="username"
                        placeholder="example02"
                        onChange={handleKeystroke}
                        value={registrationForm.username}
                        required />
                </div>
                <div className={styles.inputGroup} >
                    <label htmlFor="password">Password *</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password"
                        placeholder="Password"
                        onChange={handleKeystroke}
                        value={registrationForm.password}
                        required />
                </div>
                <div className={styles.inputGroup} >
                    <label htmlFor="confirmPassword">Confirm Password *</label>
                    <input 
                        type="password" 
                        id="confirmPassword" 
                        name="confirmPassword" 
                        placeholder="Confirm password"
                        onChange={handleKeystroke}
                        value={registrationForm.confirmPassword}
                        required />
                </div>
                <div className={styles.inputGroup} >
                    <label htmlFor="email">Email Address *</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email"
                        placeholder="email@example.com"
                        onChange={handleKeystroke}
                        value={registrationForm.email}
                        required />
                    </div>
                <div className={styles.inputGroup} >
                    <label htmlFor="firstName">First Name *</label>
                    <input 
                        type="text" 
                        id="firstName" 
                        name="firstName"
                        placeholder="First Name"
                        onChange={handleKeystroke}
                        value={registrationForm.firstName}
                        required />
                </div>
                <div className={styles.inputGroup} >
                    <label htmlFor="lastName">Last Name</label>
                    <input 
                        type="text" 
                        id="lastName" 
                        name="lastName"
                        placeholder="Last Name"
                        onChange={handleKeystroke}
                        value={registrationForm.lastName}
                        required />
                </div>
                <div className={styles.tosCheckbox} >
                    <input
                        type="checkbox"
                        id="tos"
                        name="termsOfService"
                        onChange={handleCheckbox}
                        value={registrationForm.termsOfService}
                        required
                    />
                    <label className={styles.tosText} htmlFor="tos" >I Agree to the Terms and Conditions</label>
                </div>
                { registrationForm.termsOfService 
                    ? <button type="submit" >Register</button>
                    : <button type="submit" className={styles.disabledBtn} disabled >Register</button>
                }
                
            </form> */}
