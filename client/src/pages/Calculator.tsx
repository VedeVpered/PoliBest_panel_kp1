import { useState, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';
import { nanoid } from 'nanoid';
import { Sparkles, Layers, PaintBucket, Palette, Send, Save, FileText, Copy, ChevronDown, Calendar } from 'lucide-react';

type ProductType = 'floki' | 'grunt' | 'emal' | 'farba';
type LacType = 'glossy' | 'matte';

const productTypes = [
  { id: 'floki' as ProductType, label: 'ФЛОКИ', icon: Sparkles, emoji: '✨' },
  { id: 'grunt' as ProductType, label: 'ҐРУНТ', icon: Layers, emoji: '🧱' },
  { id: 'emal' as ProductType, label: 'ЕМАЛЬ', icon: PaintBucket, emoji: '🪣' },
  { id: 'farba' as ProductType, label: 'ФАРБА', icon: Palette, emoji: '🎨' },
];

export default function Calculator() {
  const { settings, addCalculation, addDocument } = useApp();
  const [productType, setProductType] = useState<ProductType | null>(null);
  const [lacType, setLacType] = useState<LacType>('glossy');
  const [area, setArea] = useState<number>(0);
  const [clientName, setClientName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [source, setSource] = useState('');
  const [instructionsOpen, setInstructionsOpen] = useState(false);

  const calculation = useMemo(() => {
    if (!productType || area <= 0) return null;

    const { prices } = settings;
    const items: { name: string; quantity: number; pricePerKg: number; total: number }[] = [];

    if (productType === 'floki') {
      // Емаль: 0.2 кг/м²
      const emalQty = area * 0.2;
      items.push({ name: 'Емаль', quantity: emalQty, pricePerKg: prices.emal, total: emalQty * prices.emal });
      
      // Флоки: 0.025 кг/м²
      const flokiQty = area * 0.025;
      items.push({ name: 'Флоки', quantity: flokiQty, pricePerKg: prices.floki, total: flokiQty * prices.floki });
      
      // Лак: 0.12 кг/м²
      const lacQty = area * 0.12;
      const lacPrice = lacType === 'glossy' ? prices.lacGlossy : prices.lacMatte;
      const lacName = lacType === 'glossy' ? 'Лак глянц.' : 'Лак матов.';
      items.push({ name: lacName, quantity: lacQty, pricePerKg: lacPrice, total: lacQty * lacPrice });
    } else if (productType === 'grunt') {
      const qty = area * 0.15;
      items.push({ name: 'Ґрунтівка', quantity: qty, pricePerKg: prices.gruntivka, total: qty * prices.gruntivka });
    } else if (productType === 'emal') {
      const qty = area * 0.3;
      items.push({ name: 'Емаль', quantity: qty, pricePerKg: prices.emal, total: qty * prices.emal });
    } else if (productType === 'farba') {
      const qty = area * 0.2;
      items.push({ name: 'Фарба', quantity: qty, pricePerKg: prices.farba, total: qty * prices.farba });
    }

    const total = items.reduce((sum, item) => sum + item.total, 0);
    return { items, total };
  }, [productType, lacType, area, settings]);

  const handleSave = () => {
    if (!calculation || !productType) {
      toast.error('Введіть площу та оберіть тип покриття');
      return;
    }

    const calc = {
      id: nanoid(),
      clientName: clientName || 'Без імені',
      productType,
      lacType: productType === 'floki' ? lacType : undefined,
      area,
      date,
      source,
      total: calculation.total,
      includedInSum: true,
      items: calculation.items,
    };

    addCalculation(calc);
    toast.success('Розрахунок збережено');
  };

  const handleCreateDocument = () => {
    if (!calculation || !productType) {
      toast.error('Введіть площу та оберіть тип покриття');
      return;
    }

    const productName = productTypes.find(p => p.id === productType)?.label || productType;
    const doc = {
      id: nanoid(),
      name: `КП - ${productName} - ${area}м²`,
      type: productName,
      area,
      date: new Date().toISOString(),
      content: JSON.stringify({ clientName, productType, lacType, area, items: calculation.items, total: calculation.total }),
    };

    addDocument(doc);
    toast.success('Документ створено');
  };

  const handleCopy = () => {
    if (!calculation) return;
    
    const text = calculation.items
      .map(item => `${item.name}: ${item.quantity.toFixed(1)} кг × ${item.pricePerKg} = ${item.total.toLocaleString('uk-UA')} грн`)
      .join('\n') + `\n\nРАЗОМ: ${calculation.total.toLocaleString('uk-UA')} грн`;
    
    navigator.clipboard.writeText(text);
    toast.success('Скопійовано в буфер обміну');
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <h1 className="text-xl lg:text-2xl font-bold text-white">КАЛЬКУЛЯТОР</h1>

      {/* Product Type Selection - 2 columns on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4">
        {productTypes.map((type) => (
          <Button
            key={type.id}
            variant={productType === type.id ? 'default' : 'outline'}
            className={`h-16 lg:h-20 flex flex-col gap-1 lg:gap-2 ${
              productType === type.id 
                ? 'bg-red-600 hover:bg-red-700 border-red-600' 
                : 'bg-card hover:bg-secondary border-border'
            }`}
            onClick={() => setProductType(type.id)}
          >
            <span className="text-xl lg:text-2xl">{type.emoji}</span>
            <span className="font-semibold text-xs lg:text-sm">{type.label}</span>
          </Button>
        ))}
      </div>

      {/* Main Content - stacked on mobile, side by side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Left Column - Inputs */}
        <div className="space-y-4 order-1">
          {/* Area Input */}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm">ПЛОЩА (М²)</Label>
            <Input
              type="number"
              placeholder="0"
              value={area || ''}
              onChange={(e) => setArea(Number(e.target.value))}
              className="bg-input border-border text-white text-lg h-12"
            />
          </div>

          {/* Lac Type (only for Floki) */}
          {productType === 'floki' && (
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm">ТИП ЛАКУ</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={lacType === 'glossy' ? 'default' : 'outline'}
                  className={`h-10 lg:h-auto ${lacType === 'glossy' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-card'}`}
                  onClick={() => setLacType('glossy')}
                >
                  ГЛЯНЦЕВИЙ
                </Button>
                <Button
                  variant={lacType === 'matte' ? 'default' : 'outline'}
                  className={`h-10 lg:h-auto ${lacType === 'matte' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-card'}`}
                  onClick={() => setLacType('matte')}
                >
                  МАТОВИЙ
                </Button>
              </div>
            </div>
          )}

          {/* Client Name */}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm">ДЛЯ КОГО (КЛІЄНТ)</Label>
            <Input
              type="text"
              placeholder="Введіть ім'я клієнта"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="bg-input border-border text-white"
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm">ДАТА</Label>
            <div className="relative">
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-input border-border text-white"
              />
            </div>
          </div>

          {/* Source */}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm">ЗВІДКИ ЗАМОВЛЕННЯ</Label>
            <Input
              type="text"
              placeholder="OLX, сайт, дзвінок..."
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="bg-input border-border text-white"
            />
          </div>
        </div>

        {/* Right Column - Calculation Result */}
        <div className="space-y-4 order-2">
          {calculation ? (
            <Card className="bg-card border-border">
              <CardContent className="p-3 lg:p-4 space-y-3 lg:space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(date).toLocaleDateString('uk-UA')}</span>
                </div>

                <div className="space-y-2">
                  {calculation.items.map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-border last:border-0 gap-1">
                      <span className="text-white text-sm lg:text-base">{item.name}</span>
                      <div className="text-right">
                        <span className="text-muted-foreground text-xs lg:text-sm">
                          {item.quantity.toFixed(1)} кг × {item.pricePerKg.toLocaleString('uk-UA')}
                        </span>
                        <span className="text-white ml-2 lg:ml-4 text-sm lg:text-base">
                          {item.total.toLocaleString('uk-UA')} грн
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-3 lg:pt-4 border-t border-border">
                  <span className="text-base lg:text-lg font-semibold text-white">РАЗОМ</span>
                  <span className="text-xl lg:text-2xl font-bold text-green-400">
                    {calculation.total.toLocaleString('uk-UA')} грн
                  </span>
                </div>

                <div className="text-muted-foreground text-xs lg:text-sm">
                  Ціна за м²: {(calculation.total / area).toFixed(0)} грн
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-card border-border">
              <CardContent className="p-6 lg:p-8 text-center">
                <p className="text-muted-foreground text-sm lg:text-base">
                  {!productType ? 'Оберіть тип покриття' : 'Введіть площу'}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Messenger Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <Button className="bg-[#0088cc] hover:bg-[#0077b5] text-white text-xs lg:text-sm px-2 lg:px-4">
                <Send className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Telegram</span>
                <span className="sm:hidden">TG</span>
              </Button>
              <Button className="bg-[#7360f2] hover:bg-[#6050e0] text-white text-xs lg:text-sm px-2 lg:px-4">
                <Send className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                Viber
              </Button>
              <Button className="bg-[#25d366] hover:bg-[#20bd5a] text-white text-xs lg:text-sm px-2 lg:px-4">
                <Send className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">WhatsApp</span>
                <span className="sm:hidden">WA</span>
              </Button>
            </div>

            {/* Other Action Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <Button variant="secondary" onClick={handleSave} className="text-xs lg:text-sm px-2 lg:px-4">
                <Save className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                Зберегти
              </Button>
              <Button variant="secondary" onClick={handleCreateDocument} className="text-xs lg:text-sm px-2 lg:px-4">
                <FileText className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                Документ
              </Button>
              <Button variant="secondary" onClick={handleCopy} className="text-xs lg:text-sm px-2 lg:px-4">
                <Copy className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                Копіювати
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <Collapsible open={instructionsOpen} onOpenChange={setInstructionsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between bg-card text-sm">
            ІНСТРУКЦІЯ
            <ChevronDown className={`w-4 h-4 transition-transform ${instructionsOpen ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="mt-2 bg-card border-border">
            <CardContent className="p-3 lg:p-4 text-muted-foreground space-y-2 text-sm">
              <p>1. Оберіть тип покриття (Флоки, Ґрунт, Емаль або Фарба)</p>
              <p>2. Введіть площу приміщення в квадратних метрах</p>
              <p>3. Для флоків оберіть тип лаку (глянцевий або матовий)</p>
              <p>4. Заповніть дані клієнта (опціонально)</p>
              <p>5. Збережіть розрахунок або створіть документ</p>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
