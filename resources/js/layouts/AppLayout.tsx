import { PropsWithChildren } from 'react';
import Header from '@/components/Header';

export default function AppLayout({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main>{children}</main>
        </div>
    );
} 