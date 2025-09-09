/* eslint-disable @typescript-eslint/no-explicit-any */
// app/SessionWrapper.tsx
"use client";

import { SessionProvider } from 'next-auth/react';

interface SessionWrapperProps {
    children: React.ReactNode;
    session: any;
}

export function SessionWrapper({ children, session }: SessionWrapperProps) {
    return (
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    );
}