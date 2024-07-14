'use server'
 
import { cookies } from 'next/headers'
 
// Delete login cookie to end session
export async function deleteCookie() {
  cookies().delete('connect.sid')
}