import { Link, router } from '@inertiajs/react';
import { Technology, Tag } from '@/types';
import { FormEvent, useState, useMemo, useEffect } from 'react';

interface Props {
    technologies: {
        data: Technology[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
    tags: Tag[];
    filters: {
        search?: string;
        tag_id?: string;
        sort?: string;
        direction?: 'asc' | 'desc';
    };
}

export default function Index({ technologies, tags, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
    const [isTagModalOpen, setIsTagModalOpen] = useState(false);
    const [tagSearch, setTagSearch] = useState('');

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            router.get(
                route('technologies.index'),
                { search, ...filters },
                { preserveState: true }
            );
        }, 300); // 300ミリ秒のディレイ

        return () => clearTimeout(timeoutId);
    }, [search]);

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get(
            route('technologies.index'),
            { search, ...filters },
            { preserveState: true }
        );
    };

    const handleClearSearch = () => {
        setSearch('');
        router.get(
            route('technologies.index'),
            { ...filters, search: undefined },
            { preserveState: true }
        );
    };

    const handleTagFilter = (tagId: number | null) => {
        router.get(
            route('technologies.index'),
            tagId ? { tag_id: tagId, ...filters } : { ...filters, tag_id: undefined },
            { preserveState: true }
        );
    };

    const handleSort = (field: string) => {
        const direction = filters.sort === field && filters.direction === 'asc' ? 'desc' : 'asc';
        router.get(
            route('technologies.index'),
            { ...filters, sort: field, direction },
            { preserveState: true }
        );
    };

    const getSortIcon = (field: string) => {
        if (filters.sort !== field) return '↕️';
        return filters.direction === 'asc' ? '↑' : '↓';
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(technologies.data.map(tech => tech.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelect = (id: number) => {
        setSelectedIds(prev => {
            if (prev.includes(id)) {
                return prev.filter(selectedId => selectedId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const handleBulkDelete = () => {
        if (confirm(`${selectedIds.length}件の技術要素を削除してもよろしいですか？`)) {
            router.delete(route('technologies.bulk-delete'), {
                data: { ids: selectedIds },
                onSuccess: () => {
                    setSelectedIds([]);
                },
            });
        }
    };

    const handleBulkUpdateTags = (action: 'add' | 'remove') => {
        if (selectedTagIds.length === 0) {
            alert('タグを選択してください。');
            return;
        }

        if (confirm(`${selectedIds.length}件の技術要素にタグを${action === 'add' ? '追加' : '削除'}してもよろしいですか？`)) {
            router.post(route('technologies.bulk-update-tags'), {
                ids: selectedIds,
                tag_ids: selectedTagIds,
                action,
            }, {
                onSuccess: () => {
                    setSelectedTagIds([]);
                    setIsTagModalOpen(false);
                },
            });
        }
    };

    const handleExportSingle = (technologyId: number) => {
        window.location.href = route('technologies.export.single', { technology: technologyId });
    };

    const handleExportSelected = () => {
        if (selectedIds.length === 0) {
            alert('エクスポートする技術要素を選択してください。');
            return;
        }
        // TODO: 複数エクスポート機能の修正
        alert('複数エクスポート機能は現在開発中です。個別のエクスポート機能をご利用ください。');
        /*
        const params = new URLSearchParams();
        selectedIds.forEach(id => {
            params.append('ids[]', id.toString());
        });
        window.location.href = `${route('technologies.export')}?${params.toString()}`;
        */
    };

    const filteredTechnologies = useMemo(() => {
        if (!search) return technologies.data;
        const searchLower = search.toLowerCase();
        return technologies.data.filter(tech => 
            tech.name.toLowerCase().includes(searchLower) ||
            tech.type.toLowerCase().includes(searchLower) ||
            tech.status.toLowerCase().includes(searchLower) ||
            (tech.current_version && tech.current_version.toLowerCase().includes(searchLower)) ||
            (tech.license && tech.license.toLowerCase().includes(searchLower)) ||
            (tech.notes && tech.notes.toLowerCase().includes(searchLower))
        );
    }, [technologies.data, search]);

    const filteredTags = useMemo(() => {
        if (!tagSearch) return tags;
        const searchLower = tagSearch.toLowerCase();
        return tags.filter(tag => 
            tag.name.toLowerCase().includes(searchLower) ||
            (tag.description && tag.description.toLowerCase().includes(searchLower))
        );
    }, [tags, tagSearch]);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-3xl font-bold text-gray-100">技術要素一覧</h1>
                                <div className="space-x-4">
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-flex items-center px-4 py-2 bg-gray-700 border border-transparent rounded-md font-semibold text-xs text-gray-100 uppercase tracking-widest hover:bg-gray-600 focus:bg-gray-600 active:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        ダッシュボード
                                    </Link>
                                    <Link
                                        href={route('tags.index')}
                                        className="inline-flex items-center px-4 py-2 bg-gray-700 border border-transparent rounded-md font-semibold text-xs text-gray-100 uppercase tracking-widest hover:bg-gray-600 focus:bg-gray-600 active:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        タグ管理
                                    </Link>
                                    <Link
                                        href={route('technologies.create')}
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
                                        placeholder="技術名、種類、ステータスなどで検索..."
                                        className="flex-1 rounded-md border-gray-600 bg-gray-700 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    <button
                                        type="submit"
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        検索
                                    </button>
                                    {search && (
                                        <button
                                            type="button"
                                            onClick={handleClearSearch}
                                            className="inline-flex items-center px-4 py-2 bg-gray-700 border border-transparent rounded-md font-semibold text-xs text-gray-100 uppercase tracking-widest hover:bg-gray-600 focus:bg-gray-600 active:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        >
                                            クリア
                                        </button>
                                    )}
                                </div>
                            </form>

                            <div className="mb-6">
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm font-medium text-gray-300">タグでフィルター：</span>
                                    <button
                                        onClick={() => handleTagFilter(null)}
                                        className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
                                            !filters.tag_id
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                    >
                                        すべて
                                    </button>
                                    {tags.map((tag) => (
                                        <button
                                            key={tag.id}
                                            onClick={() => handleTagFilter(tag.id)}
                                            className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
                                                filters.tag_id === String(tag.id)
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            }`}
                                        >
                                            {tag.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {selectedIds.length > 0 && (
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="text-sm text-gray-300">
                                        {selectedIds.length}件選択中
                                    </div>
                                    <div className="space-x-4">
                                        <button
                                            onClick={handleExportSelected}
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        >
                                            選択した項目をエクスポート
                                        </button>
                                        <button
                                            onClick={() => setIsTagModalOpen(true)}
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        >
                                            タグを編集
                                        </button>
                                        <button
                                            onClick={handleBulkDelete}
                                            className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 focus:bg-red-700 active:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        >
                                            選択した項目を削除
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-600">
                                    <thead className="bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.length === technologies.data.length}
                                                    onChange={handleSelectAll}
                                                    className="rounded border-gray-600 bg-gray-700 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                />
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>
                                                技術名 {getSortIcon('name')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('type')}>
                                                種類 {getSortIcon('type')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('status')}>
                                                ステータス {getSortIcon('status')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                タグ
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                操作
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-gray-800 divide-y divide-gray-600">
                                        {filteredTechnologies.map((technology) => (
                                            <tr key={technology.id} className="hover:bg-gray-700 transition-colors duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedIds.includes(technology.id)}
                                                        onChange={() => handleSelect(technology.id)}
                                                        className="rounded border-gray-600 bg-gray-700 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Link
                                                        href={route('technologies.show', { technology: technology.id })}
                                                        className="text-blue-400 hover:text-blue-300"
                                                    >
                                                        {technology.name}
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-300">{technology.type}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        technology.status === 'アクティブ' ? 'bg-green-900 text-green-300' :
                                                        technology.status === '非推奨' ? 'bg-yellow-900 text-yellow-300' :
                                                        'bg-gray-900 text-gray-300'
                                                    }`}>
                                                        {technology.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-wrap gap-2">
                                                        {technology.tags.map((tag) => (
                                                            <span
                                                                key={tag.id}
                                                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300"
                                                            >
                                                                {tag.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="space-x-2">
                                                        <Link
                                                            href={route('technologies.show', { technology: technology.id })}
                                                            className="text-blue-400 hover:text-blue-300"
                                                        >
                                                            詳細
                                                        </Link>
                                                        <Link
                                                            href={route('technologies.edit', { technology: technology.id })}
                                                            className="text-blue-400 hover:text-blue-300"
                                                        >
                                                            編集
                                                        </Link>
                                                        <button
                                                            onClick={() => handleExportSingle(technology.id)}
                                                            className="text-blue-400 hover:text-blue-300"
                                                        >
                                                            エクスポート
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                if (confirm('本当に削除しますか？')) {
                                                                    router.delete(route('technologies.destroy', technology.id));
                                                                }
                                                            }}
                                                            className="text-red-400 hover:text-red-300"
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

                            <div className="mt-6">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-300">
                                        全 {technologies.total} 件中 {technologies.data.length} 件を表示
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {technologies.links.map((link, i) => {
                                            if (link.label === '&laquo; Previous') {
                                                return (
                                                    <button
                                                        key={i}
                                                        onClick={() => link.url && router.get(link.url)}
                                                        disabled={!link.url}
                                                        className={`px-3 py-1 rounded-md text-sm ${
                                                            link.url
                                                                ? 'text-gray-300 hover:bg-gray-700'
                                                                : 'text-gray-500 cursor-not-allowed'
                                                        }`}
                                                    >
                                                        前へ
                                                    </button>
                                                );
                                            }
                                            if (link.label === 'Next &raquo;') {
                                                return (
                                                    <button
                                                        key={i}
                                                        onClick={() => link.url && router.get(link.url)}
                                                        disabled={!link.url}
                                                        className={`px-3 py-1 rounded-md text-sm ${
                                                            link.url
                                                                ? 'text-gray-300 hover:bg-gray-700'
                                                                : 'text-gray-500 cursor-not-allowed'
                                                        }`}
                                                    >
                                                        次へ
                                                    </button>
                                                );
                                            }
                                            return (
                                                <button
                                                    key={i}
                                                    onClick={() => link.url && router.get(link.url)}
                                                    className={`px-3 py-1 rounded-md text-sm ${
                                                        link.active
                                                            ? 'bg-blue-600 text-white'
                                                            : 'text-gray-300 hover:bg-gray-700'
                                                    }`}
                                                >
                                                    {link.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* タグ編集モーダル */}
                            {isTagModalOpen && (
                                <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
                                    <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-600">
                                        <h3 className="text-lg font-medium text-gray-100 mb-4">
                                            タグの一括編集
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <div className="mb-4">
                                                    <input
                                                        type="text"
                                                        value={tagSearch}
                                                        onChange={(e) => setTagSearch(e.target.value)}
                                                        placeholder="タグを検索..."
                                                        className="w-full rounded-md border-gray-600 bg-gray-700 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div className="max-h-60 overflow-y-auto">
                                                    {filteredTags.length === 0 ? (
                                                        <p className="text-sm text-gray-400 text-center py-2">
                                                            タグが見つかりません
                                                        </p>
                                                    ) : (
                                                        <div className="space-y-2">
                                                            {filteredTags.map((tag) => (
                                                                <label key={tag.id} className="flex items-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedTagIds.includes(tag.id)}
                                                                        onChange={(e) => {
                                                                            if (e.target.checked) {
                                                                                setSelectedTagIds([...selectedTagIds, tag.id]);
                                                                            } else {
                                                                                setSelectedTagIds(selectedTagIds.filter(id => id !== tag.id));
                                                                            }
                                                                        }}
                                                                        className="rounded border-gray-600 bg-gray-700 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                                    />
                                                                    <span className="ml-2 text-sm text-gray-300">{tag.name}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="text-sm text-gray-400">
                                                    {selectedTagIds.length}個のタグを選択中
                                                </div>
                                                <div className="space-x-4">
                                                    <button
                                                        onClick={() => {
                                                            setIsTagModalOpen(false);
                                                            setTagSearch('');
                                                            setSelectedTagIds([]);
                                                        }}
                                                        className="inline-flex items-center px-4 py-2 bg-gray-700 border border-transparent rounded-md font-semibold text-xs text-gray-100 uppercase tracking-widest hover:bg-gray-600 focus:bg-gray-600 active:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                                    >
                                                        キャンセル
                                                    </button>
                                                    <button
                                                        onClick={() => handleBulkUpdateTags('remove')}
                                                        className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 focus:bg-red-700 active:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                                    >
                                                        選択したタグを削除
                                                    </button>
                                                    <button
                                                        onClick={() => handleBulkUpdateTags('add')}
                                                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                                    >
                                                        選択したタグを追加
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 