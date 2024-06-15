'use client'

import { useRouter } from "next/navigation";
import { vote } from "../lib/action";

interface Props {
    direction: 'Up' | 'Down';
}

export const Button = ({direction}: Props) => {
    const router = useRouter();

    return <button aria-label={direction} onClick={async () => {
        await vote(direction);
        router.refresh();
    }}>{direction}</button>;
}