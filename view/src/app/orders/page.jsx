'use client' // Client component

// Imports
import useSWR from "swr";
import styles from "./page.module.css";
import OrdersTable from "@/components/OrdersTable/OrdersTable";
import { useAppSelector } from "../lib/hooks";
import { redirect } from "next/navigation";

// Backend base URL
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

// Fetcher function to send credentials
const fetcher = (url) => fetch(url, { credentials: 'include' }).then((res) => res.json());

// Renders Orders Page
export default function OrdersPage() {

    const isAuthenticated = useAppSelector(state => state.authenticate.isAuthenticated);
    if (!isAuthenticated) {
        return redirect("/users/login");
    }

    // Api get request to backend to retrieve orders data
    const { data, error, isLoading } = useSWR(`${BACKEND_URL}/orders`, fetcher);

    if (error) console.log(error);
    console.log(data)

    return (
        <div>
            {/* Orders Page Header */}
            <h2 className={styles.pageHeader} >Orders</h2>

            {/* If data is still loading, render a "Loading..." message. 
                Once loaded render OrdersTable component */}
            { isLoading ? <p>Loading...</p> : !data ? <p>No Orders...</p> : <OrdersTable ordersData={data} /> }
        </div>
    );
}