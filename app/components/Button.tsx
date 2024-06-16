'use client'

import { useRouter } from "next/navigation";
import { guess } from "../lib/game";
import clsx from 'clsx';

interface Props {
    direction: 'Up' | 'Down';
}

const ArrowDown = () => (
    <svg  className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 30 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 4.5 15 15m0 0V8.25m0 11.25H8.25" />
    </svg>
)

const ArrowUp = () => (
    <svg  className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 30 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
    </svg>
)

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