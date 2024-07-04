'use client'

import { unAuthenticateUser } from "@/app/lib/features/authenticate/authenticateSlice";
import { useAppDispatch } from "@/app/lib/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LogoutPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(unAuthenticateUser())
        router.replace("/users/login")
    })
    return <></>;
}