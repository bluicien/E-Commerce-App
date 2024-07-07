import Image from "next/image";
import styles from "./home.module.css"

export default  async function Home() {
  return (
    <main className={styles.mainPage}>
      <h1 className={styles.homeHeader}>WELCOME TO MY E-COMMERCE APP!</h1>
    </main>
  )
}
