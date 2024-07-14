"use client"
import { useRouter } from "next/navigation";
import styles from "./BackButton.module.css";


// Sends user back to previous page in history
export default function BackButton() {

    const router = useRouter();

    const goBack = () => {
        router.back();
    }

    return <button className={styles.backBtn} onClick={goBack} >Back</button>;
}