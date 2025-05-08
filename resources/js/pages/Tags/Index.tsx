import { Link, router } from '@inertiajs/react';
import { Tag } from '@/types';
import { FormEvent, useState } from 'react';
import AppLayout from '@/layouts/AppLayout';

interface Props {
    tags: Tag[];
}

export default function Index({ tags }: Props) {
    const [search, setSearch] = useState('');

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get(route('tags.index'), { search }, { preserveState: true });
    };

    const filteredTags = tags.filter(tag =>
        tag.name.toLowerCase().includes(search.toLowerCase()) ||
        (tag.description && tag.description.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <AppLayout>
            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-3xl font-bold text-gray-900">タグ一覧</h1>
                                <div className="space-x-4">
                                    <Link
                                        href={route('tags.create')}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        新規登録
                                    </Link>
                                </div>
                            </div>

                            <form onSubmit={handleSearch} className="mb-6">
                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        placeholder="タグ名で検索..."
                                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    <button
                                        type="submit"
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        検索
                                    </button>
                                </div>
                            </form>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                タグ名
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                説明
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                操作
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredTags.map((tag) => (
                                            <tr key={tag.id} className="hover:bg-gray-50 transition-colors duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Link
                                                        href={route('tags.show', { tag: tag.id })}
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        {tag.name}
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4 text-gray-700">
                                                    {tag.description || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="space-x-2">
                                                        <Link
                                                            href={route('tags.show', { tag: tag.id })}
                                                            className="text-blue-600 hover:text-blue-800"
                                                        >
                                                            詳細
                                                        </Link>
                                                        <Link
                                                            href={route('tags.edit', { tag: tag.id })}
                                                            className="text-blue-600 hover:text-blue-800"
                                                        >
                                                            編集
                                                        </Link>
                                                        <button
                                                            onClick={() => {
                                                                if (confirm('本当に削除しますか？')) {
                                                                    router.delete(route('tags.destroy', tag.id));
                                                                }
                                                            }}
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            削除
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 