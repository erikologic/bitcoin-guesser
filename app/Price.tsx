"use client"

import { useRouter } from "next/navigation";
import { useEffect } from 'react';

interface Props {
  price: string;
}

export const Price = ({price}: Props) => {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
          router.refresh();
        }, 5000);
        return () => clearTimeout(timer);
      }, );

    return (
        <div role="status" aria-label="Price">
            BTC Price: ${price}
        </div>
    )
}