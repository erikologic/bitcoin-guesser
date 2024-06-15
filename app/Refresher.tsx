"use client"

import { useRouter } from "next/navigation";
import { useEffect } from 'react';

export const Refresher = () => {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
          router.refresh();
        }, 1 * 1000); // TODO 3 secs
        return () => clearTimeout(timer);
      }, );

    return <></>
}