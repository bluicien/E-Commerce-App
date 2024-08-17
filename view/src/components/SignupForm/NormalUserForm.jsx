import styles from './signupform.module.css';

export default function NormalUser(props) {

    const {handleKeystroke, handleCheckbox, handleRegistration, registrationForm } = props

    return (
        <form className={styles.signupForm} action={handleRegistration} >
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

        </form>
    )
}