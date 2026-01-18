import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Trash2, Edit2, Check, X, Eye, EyeOff, ChevronDown, ChevronUp, Copy, Send, MessageCircle, Phone } from 'lucide-react';

export default function Calculations() {
  const { calculations, getTotalSum, toggleCalculationInSum, updateCalculation, deleteCalculation } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleStartEdit = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(id);
    setEditName(name);
  };

  const handleSaveEdit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    updateCalculation(id, { clientName: editName });
    setEditingId(null);
    toast.success('Ім\'я клієнта оновлено');
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
    setEditName('');
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteCalculation(id);
    toast.success('Розрахунок видалено');
  };

  const handleToggleSum = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleCalculationInSum(id);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getProductLabel = (type: string) => {
    switch (type) {
      case 'floki': return 'Флоки';
      case 'grunt': return 'Ґрунт';
      case 'emal': return 'Емаль';
      case 'farba': return 'Фарба';
      default: return type;
    }
  };

  const handleCopyText = (calc: typeof calculations[0], e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `${calc.clientName}\n${getProductLabel(calc.productType)}\n${calc.area} м²\n\n` +
      calc.items.map(item => `${item.name}: ${item.quantity.toFixed(1)} кг × ${item.pricePerKg.toLocaleString('uk-UA')} = ${item.total.toLocaleString('uk-UA')} грн`).join('\n') +
      `\n\nРАЗОМ: ${calc.total.toLocaleString('uk-UA')} грн`;
    navigator.clipboard.writeText(text);
    toast.success('Скопійовано в буфер обміну');
  };

  const handleShareTelegram = (calc: typeof calculations[0], e: React.MouseEvent) => {
    e.stopPropagation();
    const text = encodeURIComponent(`${calc.clientName}\n${getProductLabel(calc.productType)} - ${calc.area} м²\nРАЗОМ: ${calc.total.toLocaleString('uk-UA')} грн`);
    window.open(`https://t.me/share/url?text=${text}`, '_blank');
  };

  const handleShareViber = (calc: typeof calculations[0], e: React.MouseEvent) => {
    e.stopPropagation();
    const text = encodeURIComponent(`${calc.clientName}\n${getProductLabel(calc.productType)} - ${calc.area} м²\nРАЗОМ: ${calc.total.toLocaleString('uk-UA')} грн`);
    window.open(`viber://forward?text=${text}`, '_blank');
  };

  const handleShareWhatsApp = (calc: typeof calculations[0], e: React.MouseEvent) => {
    e.stopPropagation();
    const text = encodeURIComponent(`${calc.clientName}\n${getProductLabel(calc.productType)} - ${calc.area} м²\nРАЗОМ: ${calc.total.toLocaleString('uk-UA')} грн`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl lg:text-2xl font-bold text-white">РОЗРАХУНКИ</h1>
        <Button 
          className="bg-[#c62828] hover:bg-[#b71c1c] text-white text-sm lg:text-base px-3 lg:px-4"
          onClick={() => window.location.href = '/calculator'}
        >
          + НОВИЙ
        </Button>
      </div>

      {/* Total Sum Card */}
      <Card className="bg-[#1a1a1a] border-[#333]">
        <CardContent className="p-3 lg:p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] lg:text-xs text-muted-foreground block">ЗАГАЛЬНА СУМА</span>
            <span className="text-2xl lg:text-3xl font-bold text-[#c62828]">
              {getTotalSum().toLocaleString('uk-UA')} <span className="text-sm lg:text-lg">грн</span>
            </span>
          </div>
          <span className="text-muted-foreground text-xs lg:text-sm">{calculations.filter(c => c.includedInSum).length} з {calculations.length}</span>
        </CardContent>
      </Card>

      {/* Calculations List */}
      {calculations.length === 0 ? (
        <Card className="bg-[#1a1a1a] border-[#333]">
          <CardContent className="p-6 lg:p-8 text-center">
            <p className="text-muted-foreground text-sm lg:text-base">Немає збережених розрахунків</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {calculations.map((calc) => (
            <Card 
              key={calc.id} 
              className={`bg-[#1a1a1a] border-[#333] cursor-pointer transition-all ${expandedId === calc.id ? 'border-[#c62828]' : ''}`}
              onClick={() => toggleExpand(calc.id)}
            >
              <CardContent className="p-3 lg:p-4">
                {/* Main Row - Mobile */}
                <div className="lg:hidden">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-yellow-400 flex-shrink-0">👤</span>
                      
                      {editingId === calc.id ? (
                        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-28 h-7 text-sm bg-[#2a2a2a] border-[#444]"
                            autoFocus
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => handleSaveEdit(calc.id, e)}
                            className="h-7 w-7 p-0 text-green-400"
                          >
                            <Check className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleCancelEdit}
                            className="h-7 w-7 p-0 text-red-400"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 min-w-0">
                          <span className="text-yellow-400 font-medium text-sm truncate">
                            {calc.clientName || 'Без імені'}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => handleStartEdit(calc.id, calc.clientName, e)}
                            className="h-5 w-5 p-0 text-muted-foreground flex-shrink-0"
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => handleToggleSum(calc.id, e)}
                        className={`h-6 w-6 p-0 ${calc.includedInSum ? 'text-green-400' : 'text-muted-foreground'}`}
                      >
                        {calc.includedInSum ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      </Button>
                      <span className={`text-base font-bold ${calc.includedInSum ? 'text-[#c62828]' : 'text-muted-foreground'}`}>
                        {calc.total.toLocaleString('uk-UA')}
                      </span>
                      <span className="text-xs text-muted-foreground">грн</span>
                      {expandedId === calc.id ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {/* Product Type and Details Row - Mobile */}
                  <div className="mt-1 text-xs flex flex-wrap gap-x-2">
                    <span className="text-white font-medium">{getProductLabel(calc.productType)}</span>
                    <span className="text-muted-foreground">
                      {new Date(calc.date).toLocaleDateString('uk-UA', { 
                        day: '2-digit', 
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="text-muted-foreground">{calc.area} м²</span>
                    {calc.source && (
                      <span className="text-yellow-400">📍 {calc.source}</span>
                    )}
                  </div>
                </div>

                {/* Main Row - Desktop */}
                <div className="hidden lg:block">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-yellow-400">👤</span>
                      
                      {editingId === calc.id ? (
                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-40 h-8 bg-[#2a2a2a] border-[#444]"
                            autoFocus
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => handleSaveEdit(calc.id, e)}
                            className="h-8 w-8 p-0 text-green-400 hover:text-green-300"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleCancelEdit}
                            className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <span className="text-yellow-400 font-medium">
                            {calc.clientName || 'Без імені'}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => handleStartEdit(calc.id, calc.clientName, e)}
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-white"
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => handleToggleSum(calc.id, e)}
                        className={`h-8 w-8 p-0 ${calc.includedInSum ? 'text-green-400' : 'text-muted-foreground'}`}
                        title={calc.includedInSum ? 'Включено в суму' : 'Виключено з суми'}
                      >
                        {calc.includedInSum ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                      <span className={`text-xl font-bold ${calc.includedInSum ? 'text-[#c62828]' : 'text-muted-foreground'}`}>
                        {calc.total.toLocaleString('uk-UA')}
                      </span>
                      <span className={`text-sm ${calc.includedInSum ? 'text-muted-foreground' : 'text-muted-foreground/50'}`}>грн</span>
                      {expandedId === calc.id ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {/* Product Type and Details Row - Desktop */}
                  <div className="mt-1 text-sm">
                    <span className="text-white font-medium">{getProductLabel(calc.productType)}</span>
                    <span className="text-muted-foreground ml-3">
                      {new Date(calc.date).toLocaleDateString('uk-UA', { 
                        day: '2-digit', 
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="text-muted-foreground"> • </span>
                    <span className="text-muted-foreground">{calc.area} м²</span>
                    {calc.source && (
                      <>
                        <span className="text-muted-foreground"> • </span>
                        <span className="text-yellow-400">📍 {calc.source}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedId === calc.id && (
                  <div className="mt-3 lg:mt-4 pt-3 lg:pt-4 border-t border-[#333]">
                    {/* Materials List */}
                    <div className="space-y-2 mb-3 lg:mb-4">
                      {calc.items.map((item, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 border-b border-[#2a2a2a] last:border-0 gap-1">
                          <div className="flex flex-wrap items-baseline gap-x-2">
                            <span className="text-white font-medium text-sm lg:text-base">{item.name}</span>
                            <span className="text-muted-foreground text-xs lg:text-sm">
                              {item.quantity.toFixed(1)} кг × {item.pricePerKg.toLocaleString('uk-UA')}
                            </span>
                          </div>
                          <span className="text-white font-medium text-sm lg:text-base">
                            {item.total.toLocaleString('uk-UA')} грн
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between py-2 lg:py-3 bg-[#2a2a2a] px-2 lg:px-3 rounded mb-3 lg:mb-4">
                      <span className="text-white font-bold text-sm lg:text-base">РАЗОМ</span>
                      <div className="text-right">
                        <span className="text-[#c62828] font-bold text-lg lg:text-xl">
                          {calc.total.toLocaleString('uk-UA')} грн
                        </span>
                        <div className="text-muted-foreground text-xs lg:text-sm">
                          Ціна за м²: {Math.round(calc.total / calc.area).toLocaleString('uk-UA')} грн/м²
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons - Mobile: 2 rows, Desktop: 1 row */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:flex-wrap">
                      <div className="grid grid-cols-3 sm:flex gap-2">
                        <Button
                          size="sm"
                          className="bg-[#0088cc] hover:bg-[#0077b5] text-white text-xs lg:text-sm px-2 lg:px-3"
                          onClick={(e) => handleShareTelegram(calc, e)}
                        >
                          <Send className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                          <span className="hidden sm:inline">Telegram</span>
                          <span className="sm:hidden">TG</span>
                        </Button>
                        <Button
                          size="sm"
                          className="bg-[#7360f2] hover:bg-[#6050e0] text-white text-xs lg:text-sm px-2 lg:px-3"
                          onClick={(e) => handleShareViber(calc, e)}
                        >
                          <Phone className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                          Viber
                        </Button>
                        <Button
                          size="sm"
                          className="bg-[#25d366] hover:bg-[#20bd5a] text-white text-xs lg:text-sm px-2 lg:px-3"
                          onClick={(e) => handleShareWhatsApp(calc, e)}
                        >
                          <MessageCircle className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                          <span className="hidden sm:inline">WhatsApp</span>
                          <span className="sm:hidden">WA</span>
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 sm:flex gap-2 sm:ml-auto">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-[#444] text-white hover:bg-[#2a2a2a] text-xs lg:text-sm px-2 lg:px-3"
                          onClick={(e) => handleCopyText(calc, e)}
                        >
                          <Copy className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                          Копіювати
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-[#444] text-red-400 hover:bg-red-400/10 hover:text-red-300 text-xs lg:text-sm px-2 lg:px-3"
                          onClick={(e) => handleDelete(calc.id, e)}
                        >
                          <Trash2 className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                          Видалити
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
