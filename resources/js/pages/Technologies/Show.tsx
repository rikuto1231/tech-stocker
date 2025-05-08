import { Link } from '@inertiajs/react';
import { Technology } from '@/types';

interface Props {
    technology: Technology;
}

export default function Show({ technology }: Props) {
    return (
        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-semibold">{technology.name}</h1>
                            <div className="space-x-4">
                                <Link
                                    href={route('technologies.edit', { technology: technology.id })}
                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    編集
                                </Link>
                                <Link
                                    href={route('technologies.index')}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                                >
                                    一覧に戻る
                                </Link>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-lg font-medium text-gray-900">基本情報</h2>
                                    <dl className="mt-2 space-y-2">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">種類</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{technology.type}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">ステータス</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{technology.status}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">現在のバージョン</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{technology.current_version || '未設定'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">ライセンス</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{technology.license || '未設定'}</dd>
                                        </div>
                                    </dl>
                                </div>

                                <div>
                                    <h2 className="text-lg font-medium text-gray-900">URL</h2>
                                    <dl className="mt-2 space-y-2">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">公式サイト</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {technology.official_url ? (
                                                    <a
                                                        href={technology.official_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        {technology.official_url}
                                                    </a>
                                                ) : (
                                                    '未設定'
                                                )}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">リポジトリ</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {technology.repository_url ? (
                                                    <a
                                                        href={technology.repository_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        {technology.repository_url}
                                                    </a>
                                                ) : (
                                                    '未設定'
                                                )}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-lg font-medium text-gray-900">タグ</h2>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {technology.tags && technology.tags.length > 0 ? (
                                            technology.tags.map((tag) => (
                                                <span
                                                    key={tag.id}
                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                                                >
                                                    {tag.name}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-500">タグはありません</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-lg font-medium text-gray-900">メモ</h2>
                                    <div className="mt-2 text-sm text-gray-900 whitespace-pre-wrap">
                                        {technology.notes || 'メモはありません'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 