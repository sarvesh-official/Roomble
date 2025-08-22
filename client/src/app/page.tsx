'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { LandingPage } from '@/components/landing-page';

export default function Home() {


  return <LandingPage />;
}
