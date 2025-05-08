export interface Technology {
    id: number;
    name: string;
    type: string;
    status: string;
    official_url: string | null;
    repository_url: string | null;
    current_version: string | null;
    license: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
    tags: Tag[];
}

export interface Tag {
    id: number;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    technologies_count?: number;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
} 