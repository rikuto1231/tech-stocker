import { useState } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface Notification {
    id: number;
    title: string;
    url: string;
    createdAt: string;
}

export default function NotificationBell() {
    // テストデータ
    const [notifications] = useState<Notification[]>([
        {
            id: 1,
            title: "Reactの最新アップデート情報",
            url: "https://example.com/react-update",
            createdAt: "2024-05-09 10:00:00"
        },
        {
            id: 2,
            title: "TypeScriptの新機能について",
            url: "https://example.com/typescript-features",
            createdAt: "2024-05-09 09:30:00"
        },
        {
            id: 3,
            title: "Laravel 10の新機能紹介",
            url: "https://example.com/laravel-10",
            createdAt: "2024-05-09 09:00:00"
        }
    ]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <BellIcon className="h-5 w-5" />
                    {notifications.length > 0 && (
                        <span className="absolute right-0 top-0 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <div className="p-4">
                    <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">通知</h3>
                    <div className="space-y-4">
                        {notifications.map((notification) => (
                            <a
                                key={notification.id}
                                href={notification.url}
                                className="block rounded-lg p-2 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            >
                                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                    {notification.title}
                                </p>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                    {notification.createdAt}
                                </p>
                            </a>
                        ))}
                    </div>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
} 