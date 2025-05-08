import { PageProps } from '@inertiajs/core';

export interface NavItem {
    title: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
}

interface User {
    name: string;
    avatar?: string;
}

interface Auth {
    user: User;
}

export interface SharedData extends PageProps {
    props: {
        auth: Auth;
    };
    url: string;
    [key: string]: any;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
} 