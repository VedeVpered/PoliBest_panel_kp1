import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { FileText, Eye, Pencil, Download, Trash2 } from 'lucide-react';
import { nanoid } from 'nanoid';
import { defaultCompanyDetails, defaultAdvantages, defaultTechnicalParams } from '@/contexts/AppContext';

type KPStatus = 'all' | 'draft' | 'sent' | 'paid' | 'cancelled';

export default function Commercial() {
  const [, navigate] = useLocation();
  const { kps, addKP, deleteKP, updateKP } = useApp();
  const [filter, setFilter] = useState<KPStatus>('all');

  const filteredKPs = kps.filter(kp => {
    if (filter === 'all') return true;
    return kp.status === filter;
  });

  const draftCount = kps.filter(kp => kp.status === 'draft').length;
  const sentCount = kps.filter(kp => kp.status === 'sent').length;
  const paidCount = kps.filter(kp => kp.status === 'paid').length;
  const cancelledCount = kps.filter(kp => kp.status === 'cancelled').length;
  
  const totalSum = kps.reduce((sum, kp) => sum + (kp.total || 0), 0);
  const sentPercent = kps.length > 0 ? Math.round((sentCount / kps.length) * 100) : 0;
  const paidPercent = kps.length > 0 ? Math.round((paidCount / kps.length) * 100) : 0;

  const handleCreateKP = () => {
    // Сразу переходим на страницу создания КП без промежуточных шагов
    navigate('/commercial/kp/new');
  };

  const handleStatusChange = (kpId: string, newStatus: string) => {
    updateKP(kpId, { status: newStatus as 'draft' | 'sent' | 'paid' | 'cancelled' });
    toast.success('Статус оновлено');
  };

  const handleDelete = (id: string) => {
    deleteKP(id);
    toast.success('КП видалено');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <span className="px-2 py-0.5 text-xs font-medium bg-red-600 text-white">ЧЕРНЕТКА</span>;
      case 'sent':
        return <span className="px-2 py-0.5 text-xs font-medium bg-yellow-500 text-black">ВІДПРАВЛЕНО</span>;
      case 'paid':
        return <span className="px-2 py-0.5 text-xs font-medium bg-green-600 text-white">ОПЛАЧЕНО</span>;
      case 'cancelled':
        return <span className="px-2 py-0.5 text-xs font-medium bg-yellow-500 text-black">СКАСОВАНО</span>;
      default:
        return null;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear().toString().slice(-2)}`;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl lg:text-2xl font-bold text-white">КОМЕРЦІЙНЕ</h1>
        <Button 
          onClick={handleCreateKP}
          className="bg-green-600 hover:bg-green-700 text-white gap-2 text-sm lg:text-base"
        >
          <FileText className="w-4 h-4" />
          КП
        </Button>
      </div>

      {/* Stats Row - Mobile: 2x2 grid, Desktop: horizontal */}
      <div className="grid grid-cols-2 lg:flex lg:items-center gap-3 lg:gap-4">
        {/* Draft */}
        <div className="flex items-center gap-2">
          <span className="text-2xl lg:text-3xl font-bold text-white">{draftCount}</span>
          <div className="text-xs text-gray-400">
            <div>ЧЕРНЕТКА</div>
          </div>
        </div>

        {/* Sent */}
        <div className="flex items-center gap-2 lg:border-l lg:border-[#333] lg:pl-4">
          <span className="text-2xl lg:text-3xl font-bold text-yellow-400">{sentCount}</span>
          <div className="text-xs">
            <div className="text-gray-400">ВІДПРАВЛЕНО</div>
            <div className="text-yellow-400">{sentPercent}%</div>
          </div>
        </div>

        {/* Paid */}
        <div className="flex items-center gap-2 lg:border-l lg:border-[#333] lg:pl-4">
          <span className="text-2xl lg:text-3xl font-bold text-green-400">{paidCount}</span>
          <div className="text-xs">
            <div className="text-gray-400">ОПЛАЧЕНО</div>
            <div className="text-green-400">{paidPercent}%</div>
          </div>
        </div>

        {/* Totals */}
        <div className="lg:ml-auto text-right">
          <div className="text-xs text-gray-500">
            Всього: {kps.length} КП • <span className="text-gray-500">Скасовано: {cancelledCount}</span>
          </div>
          <div className="text-lg lg:text-xl font-bold text-green-400">
            {totalSum.toLocaleString('uk-UA')} ₴
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center justify-between border-t border-[#222] pt-4">
        <div className="flex items-center gap-2">
          <span className="text-gray-500">▼</span>
          <Select value={filter} onValueChange={(v) => setFilter(v as KPStatus)}>
            <SelectTrigger className="w-[130px] lg:w-[150px] bg-transparent border-0 text-white text-sm">
              <SelectValue placeholder="Всі статуси" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Всі статуси</SelectItem>
              <SelectItem value="draft">Чернетка</SelectItem>
              <SelectItem value="sent">Відправлено</SelectItem>
              <SelectItem value="paid">Оплачено</SelectItem>
              <SelectItem value="cancelled">Скасовано</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <span className="text-xs text-gray-500">{filteredKPs.length} КП</span>
      </div>

      {/* KP List */}
      <div className="space-y-3">
        {filteredKPs.length === 0 ? (
          <div className="text-center text-gray-500 py-8 lg:py-12 text-sm lg:text-base">
            Немає комерційних пропозицій
          </div>
        ) : (
          filteredKPs.map((kp) => (
            <div
              key={kp.id}
              className="bg-[#141414] border border-[#222] p-3 lg:p-4"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                {/* Left side - KP info */}
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-white text-sm lg:text-base">{kp.name}</span>
                      {getStatusBadge(kp.status)}
                    </div>
                    <div className="text-xs lg:text-sm text-gray-500 mt-1">
                      {formatDate(kp.date)} • {kp.client || '—'}
                    </div>
                    <div className="text-base lg:text-lg font-semibold text-yellow-400 mt-1">
                      {(kp.total || 0).toLocaleString('uk-UA')} ₴
                    </div>
                  </div>
                </div>

                {/* Right side - Status dropdown */}
                <div className="flex items-center gap-2 self-end lg:self-start">
                  <Select 
                    value={kp.status} 
                    onValueChange={(v) => handleStatusChange(kp.id, v)}
                  >
                    <SelectTrigger className="w-[100px] h-8 text-xs bg-transparent border-[#333]">
                      <SelectValue placeholder="Статус" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Чернетка</SelectItem>
                      <SelectItem value="sent">Відправлено</SelectItem>
                      <SelectItem value="paid">Оплачено</SelectItem>
                      <SelectItem value="cancelled">Скасовано</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Action buttons - Mobile: 2 rows, Desktop: 1 row */}
              <div className="flex flex-wrap items-center gap-1 lg:gap-2 mt-3 pt-3 border-t border-[#222]">
                <Link href={`/commercial/kp/preview/${kp.id}`}>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white gap-1 text-xs lg:text-sm px-2 lg:px-3">
                    <Eye className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span className="hidden sm:inline">Перегляд</span>
                    <span className="sm:hidden">Вигляд</span>
                  </Button>
                </Link>
                <Link href={`/commercial/kp/edit/${kp.id}`}>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white gap-1 text-xs lg:text-sm px-2 lg:px-3">
                    <Pencil className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span className="hidden sm:inline">Редагувати</span>
                    <span className="sm:hidden">Ред.</span>
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white gap-1 text-xs lg:text-sm px-2 lg:px-3">
                  <Download className="w-3 h-3 lg:w-4 lg:h-4" />
                  PDF
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-400 hover:text-red-400 gap-1 ml-auto text-xs lg:text-sm px-2 lg:px-3"
                  onClick={() => handleDelete(kp.id)}
                >
                  <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
                  <span className="hidden sm:inline">Видалити</span>
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
