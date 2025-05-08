import { useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { Technology, Tag } from '@/types';

interface Props {
    technology: Technology;
    tags: Tag[];
}

interface TechnologyFormData {
    name: string;
    type: string;
    status: string;
    official_url: string | null;
    repository_url: string | null;
    current_version: string | null;
    license: string | null;
    notes: string | null;
    tag_ids: number[];
    [key: string]: string | null | number[];
}

export default function Edit({ technology, tags }: Props) {
    const { data, setData, put, processing, errors } = useForm<TechnologyFormData>({
        name: technology.name,
        type: technology.type,
        status: technology.status,
        official_url: technology.official_url,
        repository_url: technology.repository_url,
        current_version: technology.current_version,
        license: technology.license,
        notes: technology.notes,
        tag_ids: technology.tags.map(tag => tag.id),
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(route('technologies.update', { technology: technology.id }));
    };

    const handleTagChange = (tagId: number) => {
        const currentTagIds = data.tag_ids;
        const newTagIds = currentTagIds.includes(tagId)
            ? currentTagIds.filter(id => id !== tagId)
            : [...currentTagIds, tagId];
        setData('tag_ids', newTagIds);
    };

    return (
        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900">
                        <h1 className="text-2xl font-semibold mb-6">技術要素の編集</h1>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    技術名 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                                    種類 <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="type"
                                    value={data.type}
                                    onChange={e => setData('type', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                >
                                    <option value="">選択してください</option>
                                    <option value="Library">ライブラリ</option>
                                    <option value="Framework">フレームワーク</option>
                                    <option value="Tool">ツール</option>
                                    <option value="Language">言語</option>
                                    <option value="Database">データベース</option>
                                    <option value="Other">その他</option>
                                </select>
                                {errors.type && (
                                    <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                    ステータス <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="status"
                                    value={data.status}
                                    onChange={e => setData('status', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                >
                                    <option value="">選択してください</option>
                                    <option value="調査中">調査中</option>
                                    <option value="学習中">学習中</option>
                                    <option value="使用中">使用中</option>
                                    <option value="検討中">検討中</option>
                                    <option value="保留">保留</option>
                                </select>
                                {errors.status && (
                                    <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="official_url" className="block text-sm font-medium text-gray-700">
                                    公式サイトURL
                                </label>
                                <input
                                    type="url"
                                    id="official_url"
                                    value={data.official_url || ''}
                                    onChange={e => setData('official_url', e.target.value || null)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                {errors.official_url && (
                                    <p className="mt-1 text-sm text-red-600">{errors.official_url}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="repository_url" className="block text-sm font-medium text-gray-700">
                                    リポジトリURL
                                </label>
                                <input
                                    type="url"
                                    id="repository_url"
                                    value={data.repository_url || ''}
                                    onChange={e => setData('repository_url', e.target.value || null)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                {errors.repository_url && (
                                    <p className="mt-1 text-sm text-red-600">{errors.repository_url}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="current_version" className="block text-sm font-medium text-gray-700">
                                    現在のバージョン
                                </label>
                                <input
                                    type="text"
                                    id="current_version"
                                    value={data.current_version || ''}
                                    onChange={e => setData('current_version', e.target.value || null)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                {errors.current_version && (
                                    <p className="mt-1 text-sm text-red-600">{errors.current_version}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="license" className="block text-sm font-medium text-gray-700">
                                    ライセンス
                                </label>
                                <input
                                    type="text"
                                    id="license"
                                    value={data.license || ''}
                                    onChange={e => setData('license', e.target.value || null)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                {errors.license && (
                                    <p className="mt-1 text-sm text-red-600">{errors.license}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                                    メモ
                                </label>
                                <textarea
                                    id="notes"
                                    value={data.notes || ''}
                                    onChange={e => setData('notes', e.target.value || null)}
                                    rows={4}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                {errors.notes && (
                                    <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    タグ
                                </label>
                                <div className="space-y-2">
                                    {tags.map((tag) => (
                                        <label key={tag.id} className="inline-flex items-center mr-4">
                                            <input
                                                type="checkbox"
                                                checked={data.tag_ids.includes(tag.id)}
                                                onChange={() => handleTagChange(tag.id)}
                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">{tag.name}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.tag_ids && (
                                    <p className="mt-1 text-sm text-red-600">{errors.tag_ids}</p>
                                )}
                            </div>

                            <div className="flex justify-end space-x-4">
                                <a
                                    href={route('technologies.show', { technology: technology.id })}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                                >
                                    キャンセル
                                </a>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    更新
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
} 