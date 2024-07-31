import Link from "next/link";
import styles from "./OrdersTable.module.css";

export default function OrdersTable({ordersData}) {

    return (
        <table className={styles.orderTable} >
            <thead>
                <tr className={styles.tableHeaders} >
                    <th>Order ID</th>
                    <th>Status</th>
                    <th>Total (USD)</th>
                    <th>Action</th>
                </tr>
            </thead>

            <tbody>
            {
                ordersData.map(order => 
                <tr className={styles.tableRow} key={`order-${order.id}`}>
                    <td>{order.id}</td>
                    <td>{order.status}</td>
                    <td>{order.total}</td>
                    <td className={styles.actionBtns} >
                        <Link href={"/"} ><button className={styles.viewOrder} >View</button></Link>
                        { order.status == "Not paid" ? <button className={styles.cancelOrder} >Cancel</button> : <button disabled className={styles.disabledBtn} >Cancel</button> }
                    </td>
                </tr>
                )
            }
            </tbody>
        </table>
    )
}