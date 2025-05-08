import { Link } from '@inertiajs/react';

export default function Header() {
    return (
        <header className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link href={route('dashboard')} className="text-xl font-bold text-gray-900">
                            Tech Stocker
                        </Link>
                    </div>
                    <nav className="flex items-center space-x-4">
                        <Link
                            href={route('dashboard')}
                            className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                        >
                            ダッシュボード
                        </Link>
                        <Link
                            href={route('technologies.index')}
                            className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                        >
                            技術一覧
                        </Link>
                        <Link
                            href={route('tags.index')}
                            className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                        >
                            タグ管理
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
} 