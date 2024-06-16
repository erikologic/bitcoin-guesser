'use client'

import { useRouter } from "next/navigation";
import clsx from 'clsx';
import { guess } from "../lib/game";
import { ArrowUp, ArrowDown } from "./Arrow";

interface Props {
    direction: 'Up' | 'Down';
}

export const Button = ({direction}: Props) => {
    const router = useRouter();

    const isUp = direction === 'Up';

    return <button 
        className={clsx(" text-white font-bold py-2 px-4 border rounded inline-flex items-center",{
            'bg-red-600 hover:bg-red-700 border-red-700': !isUp,
            'bg-green-600 hover:bg-green-700 border-green-700': isUp
        })}
        aria-label={direction} 
        onClick={async () => {
                await guess(direction);
                router.refresh();
            }}
        >
              {isUp ? <ArrowUp /> : <ArrowDown />}
              <span>{direction}</span>
        </button>;
}