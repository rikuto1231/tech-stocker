import { Technology } from '@/types';
import { Link } from '@inertiajs/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface Props {
    typeDistribution: {
        type: string;
        count: number;
    }[];
    statusDistribution: {
        status: string;
        count: number;
    }[];
    statistics: {
        total_technologies: number;
        total_active: number;
        total_deprecated: number;
        recently_added: Technology[];
    };
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function Index({ typeDistribution, statusDistribution, statistics }: Props) {
    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-8">
                                <h1 className="text-3xl font-bold text-gray-100">技術スタックダッシュボード</h1>
                                <Link
                                    href={route('technologies.index')}
                                    className="inline-flex items-center px-4 py-2 bg-gray-700 border border-transparent rounded-md font-semibold text-xs text-gray-100 uppercase tracking-widest hover:bg-gray-600 focus:bg-gray-600 active:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    技術一覧に戻る
                                </Link>
                            </div>

                            {/* 概要統計 */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
                                    <h2 className="text-lg font-semibold mb-2 text-gray-300">総技術要素数</h2>
                                    <p className="text-4xl font-bold text-blue-400">{statistics.total_technologies}</p>
                                </div>
                                <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
                                    <h2 className="text-lg font-semibold mb-2 text-gray-300">アクティブな技術</h2>
                                    <p className="text-4xl font-bold text-green-400">{statistics.total_active}</p>
                                </div>
                                <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
                                    <h2 className="text-lg font-semibold mb-2 text-gray-300">非推奨の技術</h2>
                                    <p className="text-4xl font-bold text-yellow-400">{statistics.total_deprecated}</p>
                                </div>
                            </div>

                            {/* グラフセクション */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                {/* 種類分布 */}
                                <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
                                    <h2 className="text-xl font-semibold mb-4 text-gray-300">技術種類の分布</h2>
                                    <div className="h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={typeDistribution}
                                                    dataKey="count"
                                                    nameKey="type"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={80}
                                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                                >
                                                    {typeDistribution.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip 
                                                    contentStyle={{ 
                                                        backgroundColor: '#1F2937',
                                                        border: '1px solid #4B5563',
                                                        borderRadius: '0.375rem',
                                                        color: '#F3F4F6'
                                                    }}
                                                />
                                                <Legend 
                                                    wrapperStyle={{
                                                        color: '#F3F4F6'
                                                    }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* ステータス分布 */}
                                <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
                                    <h2 className="text-xl font-semibold mb-4 text-gray-300">技術ステータスの分布</h2>
                                    <div className="h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={statusDistribution}
                                                    dataKey="count"
                                                    nameKey="status"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={80}
                                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                                >
                                                    {statusDistribution.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip 
                                                    contentStyle={{ 
                                                        backgroundColor: '#1F2937',
                                                        border: '1px solid #4B5563',
                                                        borderRadius: '0.375rem',
                                                        color: '#F3F4F6'
                                                    }}
                                                />
                                                <Legend 
                                                    wrapperStyle={{
                                                        color: '#F3F4F6'
                                                    }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            {/* 最近追加された技術 */}
                            <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
                                <h2 className="text-xl font-semibold mb-4 text-gray-300">最近追加された技術</h2>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-600">
                                        <thead className="bg-gray-800">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    技術名
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    種類
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    ステータス
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    タグ
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-gray-700 divide-y divide-gray-600">
                                            {statistics.recently_added.map((tech) => (
                                                <tr key={tech.id} className="hover:bg-gray-600 transition-colors duration-150">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <Link
                                                            href={route('technologies.show', { technology: tech.id })}
                                                            className="text-blue-400 hover:text-blue-300"
                                                        >
                                                            {tech.name}
                                                        </Link>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{tech.type}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            tech.status === 'アクティブ' ? 'bg-green-900 text-green-300' :
                                                            tech.status === '非推奨' ? 'bg-yellow-900 text-yellow-300' :
                                                            'bg-gray-900 text-gray-300'
                                                        }`}>
                                                            {tech.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex flex-wrap gap-2">
                                                            {tech.tags.map((tag) => (
                                                                <span
                                                                    key={tag.id}
                                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-600 text-gray-300"
                                                                >
                                                                    {tag.name}
                                                                </span>
                                                            ))}
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
            </div>
        </div>
    );
} 