'use client'

import { useRouter } from "next/navigation";
import { guess } from "../lib/game";

interface Props {
    direction: 'Up' | 'Down';
}

export const Button = ({direction}: Props) => {
    const router = useRouter();

    return <button aria-label={direction} onClick={async () => {
        await guess(direction);
        router.refresh();
    }}>{direction}</button>;
}