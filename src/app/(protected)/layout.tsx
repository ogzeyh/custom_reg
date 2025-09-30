"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(!token) {
            router.replace('/login');
            return;
        }

        try {
            const decoted: any = jwtDecode(token);
            const exp = decoted.exp * 1000;
            if(Date.now() >= exp) {
                localStorage.removeItem('token');
                router.replace('/login');
            } else {
                setLoading(false);
            }
        } catch {
            localStorage.removeItem('token');
            router.replace('/login');
        }
    }, [router]);

    if (loading) return <div>Ładowanie...</div>

    return (
        <>{children}</>
    )
}