'use client'

import { deleteCookie } from "@/app/actions";
import { unAuthenticateUser } from "@/app/lib/features/authenticate/authenticateSlice";
import { useAppDispatch } from "@/app/lib/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";

const fetcher = (url) => fetch(url, { credentials: 'include' }).then((res) => res);
export default function LogoutPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const { data, error, isLoading } = useSWR("http://localhost:3000/users/logout", fetcher);
    if (error) console.log(error);

    deleteCookie();
    dispatch(unAuthenticateUser())
    router.replace("/users/login")

    if (!isLoading) return <></>;
}