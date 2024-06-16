"use client"

import { useRouter } from "next/navigation";
import { useEffect } from 'react';

export const Refresher = () => {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
          router.refresh();
        }, 3 * 1000);
        return () => clearTimeout(timer);
      }, );

    return <></>
}