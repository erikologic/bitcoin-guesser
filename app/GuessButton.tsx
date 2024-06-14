'use client';
import { useRouter } from 'next/router';
import { voteUp } from './actions';

export const GuessButton = () => {
    const router = useRouter();
  return (
    <button aria-label="up" onClick={async () => {
      await voteUp();
      router.reload();
      
      }}>Up</button>
  );
}