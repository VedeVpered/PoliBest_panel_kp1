import { Link } from 'wouter';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Calculator, FileText, TrendingUp, Plus, FolderOpen, LayoutGrid } from 'lucide-react';

// Colors from visual editor adjustments
const PRIMARY_COLOR = '#b8391a';
const ICON_BG_COLOR = '#812913';
const CARD_BG = '#121212';
const CARD_BORDER = '#262626';

export default function Dashboard() {
  const { calculations, documents, kps, getTotalSum } = useApp();

  const stats = [
    { label: 'ПРОДУКТІВ', value: kps.length, icon: LayoutGrid },
    { label: 'РОЗРАХУНКІВ', value: calculations.length, icon: FileText },
    { label: 'ДОКУМЕНТІВ', value: documents.length, icon: FileText },
    { label: 'СУМА (ГРН)', value: getTotalSum().toLocaleString('uk-UA'), icon: TrendingUp },
  ];

  const quickActions = [
    { label: 'НОВИЙ РОЗРАХУНОК', description: 'Створити розрахунок матеріалів', href: '/calculator', icon: Calculator, isMain: true },
    { label: 'ДОКУМЕНТИ', description: 'Переглянути документи', href: '/documents', icon: FolderOpen, isMain: false },
    { label: 'РОЗРАХУНКИ', description: 'Історія розрахунків', href: '/calculations', icon: FileText, isMain: false },
  ];

  const recentCalculations = calculations.slice(0, 5);

  const getProductLabel = (type: string) => {
    switch (type) {
      case 'floki': return 'Флоки';
      case 'grunt': return 'Ґрунт';
      case 'emal': return 'Емаль';
      case 'farba': return 'Фарба';
      default: return type;
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <h1 className="text-xl lg:text-2xl font-bold text-white">ПАНЕЛЬ</h1>

      {/* Stats Grid - 2 columns on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="bg-[#121212] border-[#262626]">
              <CardContent className="p-3 lg:p-5">
                <div className="flex items-center gap-3 lg:gap-4">
                  <div 
                    className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: ICON_BG_COLOR }}
                  >
                    <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg lg:text-2xl font-bold text-white truncate">{stat.value}</p>
                    <p className="text-[10px] lg:text-xs text-[#737373] truncate">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions - 1 column on mobile, 3 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.label} href={action.href}>
              <Card className="border-[#262626] hover:opacity-90 transition-opacity cursor-pointer h-full bg-[#121212]">
                <CardContent className="p-4 lg:p-5 flex items-center gap-3 lg:gap-4">
                  <div 
                    className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: action.isMain ? ICON_BG_COLOR : '#262626' }}
                  >
                    <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-white text-sm lg:text-base">{action.label}</p>
                    {action.description && (
                      <p className="text-xs lg:text-sm text-[#737373] truncate">{action.description}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Recent Calculations */}
      <Card className="bg-[#121212] border-[#262626]">
        <CardContent className="p-3 lg:p-4">
          <h2 className="text-base lg:text-lg font-semibold text-white mb-3 lg:mb-4">ОСТАННІ РОЗРАХУНКИ</h2>
          {recentCalculations.length === 0 ? (
            <p className="text-[#737373] text-center py-6 lg:py-8 text-sm">Немає розрахунків</p>
          ) : (
            <div className="space-y-2">
              {recentCalculations.map((calc) => (
                <div
                  key={calc.id}
                  className="p-3 bg-[#0a0a0a] hover:bg-[#1a1a1a] transition-colors"
                >
                  {/* Mobile layout - stacked */}
                  <div className="lg:hidden">
                    <div className="flex items-center justify-between mb-1">
                      <span style={{ color: PRIMARY_COLOR }} className="font-medium text-sm">
                        {calc.clientName || 'Без імені'}
                      </span>
                      <span className="text-[#4ade80] font-semibold text-sm">
                        {calc.total.toLocaleString('uk-UA')} грн
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#737373] flex-wrap">
                      <span>{getProductLabel(calc.productType)}</span>
                      <span>•</span>
                      <span>{new Date(calc.date).toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit' })}</span>
                      <span>•</span>
                      <span>{calc.area} м²</span>
                    </div>
                  </div>
                  
                  {/* Desktop layout - horizontal */}
                  <div className="hidden lg:flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span style={{ color: PRIMARY_COLOR }} className="font-medium">
                        {calc.clientName || 'Без імені'}
                      </span>
                      <span className="text-[#737373]">•</span>
                      <span className="text-[#737373] capitalize">
                        {getProductLabel(calc.productType)}
                      </span>
                      <span className="text-[#737373]">•</span>
                      <span className="text-[#737373]">
                        {new Date(calc.date).toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit' })}
                      </span>
                      <span className="text-[#737373]">•</span>
                      <span className="text-[#737373]">{calc.area} м²</span>
                    </div>
                    <span className="text-[#4ade80] font-semibold">
                      {calc.total.toLocaleString('uk-UA')} грн
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
