"use client"

import { useRouter } from "next/navigation";
import { useEffect } from 'react';

const UPDATE_RATE = 3 * 1000;

export const Refresher = () => {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
          router.refresh();
        }, UPDATE_RATE);
        return () => clearTimeout(timer);
      }, );

    return <></>
}