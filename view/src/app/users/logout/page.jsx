'use client'

import { deleteCookie } from "@/app/actions";
import { unAuthenticateUser } from "@/app/lib/features/authenticate/authenticateSlice";
import { useAppDispatch } from "@/app/lib/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export default function LogoutPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    
    const fetcher = (url) => fetch(url, { credentials: 'include' }).then((res) => res);
    const { data, error, isLoading } = useSWR(`${BACKEND_URL}/users/logout`, fetcher);
    if (error) console.log(error);
    
    useEffect(() => {
        deleteCookie();
        dispatch(unAuthenticateUser());
        router.push("/users/login");
    }, [])

    if (!isLoading) return <></>;
}