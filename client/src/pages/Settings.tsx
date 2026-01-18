import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Save, Plus, Edit2, Trash2, Copy } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  pricePerKg: number;
  consumption: number;
}

export default function Settings() {
  const { settings, updateSettings } = useApp();
  const [prices, setPrices] = useState(settings.prices);
  const [companyName, setCompanyName] = useState(settings.companyName);
  const [currency, setCurrency] = useState(settings.currency);
  const [units, setUnits] = useState(settings.units);
  
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Тестовое покрытие ПБ-911', pricePerKg: 750, consumption: 2 },
  ]);

  const handleSavePrices = () => {
    updateSettings({ prices });
    toast.success('Ціни збережено');
  };

  const handleSaveSettings = () => {
    updateSettings({ companyName, currency, units });
    toast.success('Налаштування збережено');
  };

  const handleAddProduct = () => {
    toast.info('Функція додавання продукту скоро буде доступна');
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <h1 className="text-xl lg:text-2xl font-bold text-white">НАЛАШТУВАННЯ</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Calculator Prices */}
        <Card className="bg-card border-border">
          <CardContent className="p-4 lg:p-6">
            <h2 className="text-base lg:text-lg font-semibold text-white mb-3 lg:mb-4 flex items-center gap-2">
              <span className="text-yellow-400">📋</span>
              ЦІНИ КАЛЬКУЛЯТОРА
            </h2>
            
            <div className="grid grid-cols-2 gap-3 lg:gap-4">
              <div className="space-y-1 lg:space-y-2">
                <Label className="text-muted-foreground text-[10px] lg:text-xs">ҐРУНТІВКА (ГРН/КГ)</Label>
                <Input
                  type="number"
                  value={prices.gruntivka}
                  onChange={(e) => setPrices({ ...prices, gruntivka: Number(e.target.value) })}
                  className="bg-input border-border h-9 lg:h-10"
                />
              </div>
              <div className="space-y-1 lg:space-y-2">
                <Label className="text-muted-foreground text-[10px] lg:text-xs">ФАРБА (ГРН/КГ)</Label>
                <Input
                  type="number"
                  value={prices.farba}
                  onChange={(e) => setPrices({ ...prices, farba: Number(e.target.value) })}
                  className="bg-input border-border h-9 lg:h-10"
                />
              </div>
              <div className="space-y-1 lg:space-y-2">
                <Label className="text-muted-foreground text-[10px] lg:text-xs">ЕМАЛЬ (ГРН/КГ)</Label>
                <Input
                  type="number"
                  value={prices.emal}
                  onChange={(e) => setPrices({ ...prices, emal: Number(e.target.value) })}
                  className="bg-input border-border h-9 lg:h-10"
                />
              </div>
              <div className="space-y-1 lg:space-y-2">
                <Label className="text-muted-foreground text-[10px] lg:text-xs">ФЛОКИ (ГРН/КГ)</Label>
                <Input
                  type="number"
                  value={prices.floki}
                  onChange={(e) => setPrices({ ...prices, floki: Number(e.target.value) })}
                  className="bg-input border-border h-9 lg:h-10"
                />
              </div>
              <div className="space-y-1 lg:space-y-2">
                <Label className="text-muted-foreground text-[10px] lg:text-xs">ЛАК ГЛЯНЦ. (ГРН/КГ)</Label>
                <Input
                  type="number"
                  value={prices.lacGlossy}
                  onChange={(e) => setPrices({ ...prices, lacGlossy: Number(e.target.value) })}
                  className="bg-input border-border h-9 lg:h-10"
                />
              </div>
              <div className="space-y-1 lg:space-y-2">
                <Label className="text-muted-foreground text-[10px] lg:text-xs">ЛАК МАТОВИЙ (ГРН/КГ)</Label>
                <Input
                  type="number"
                  value={prices.lacMatte}
                  onChange={(e) => setPrices({ ...prices, lacMatte: Number(e.target.value) })}
                  className="bg-input border-border h-9 lg:h-10"
                />
              </div>
            </div>

            <Button 
              onClick={handleSavePrices}
              className="w-full mt-3 lg:mt-4 bg-red-600 hover:bg-red-700 text-sm lg:text-base"
            >
              <Save className="w-4 h-4 mr-2" />
              ЗБЕРЕГТИ ЦІНИ
            </Button>
          </CardContent>
        </Card>

        {/* General Settings */}
        <Card className="bg-card border-border">
          <CardContent className="p-4 lg:p-6">
            <h2 className="text-base lg:text-lg font-semibold text-white mb-3 lg:mb-4">ЗАГАЛЬНІ НАЛАШТУВАННЯ</h2>
            
            <div className="space-y-3 lg:space-y-4">
              <div className="space-y-1 lg:space-y-2">
                <Label className="text-muted-foreground text-[10px] lg:text-xs">НАЗВА КОМПАНІЇ</Label>
                <Input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="bg-input border-border h-9 lg:h-10"
                />
              </div>
              
              <div className="space-y-1 lg:space-y-2">
                <Label className="text-muted-foreground text-[10px] lg:text-xs">ВАЛЮТА</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="bg-input border-border h-9 lg:h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UAH">Гривня (₴)</SelectItem>
                    <SelectItem value="USD">Долар ($)</SelectItem>
                    <SelectItem value="EUR">Євро (€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1 lg:space-y-2">
                <Label className="text-muted-foreground text-[10px] lg:text-xs">ОДИНИЦІ ВИМІРУ</Label>
                <Select value={units} onValueChange={setUnits}>
                  <SelectTrigger className="bg-input border-border h-9 lg:h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="m²">Квадратні метри (м²)</SelectItem>
                    <SelectItem value="ft²">Квадратні фути (ft²)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={handleSaveSettings}
              className="w-full mt-3 lg:mt-4 bg-red-600 hover:bg-red-700 text-sm lg:text-base"
            >
              <Save className="w-4 h-4 mr-2" />
              ЗБЕРЕГТИ НАЛАШТУВАННЯ
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Products */}
      <Card className="bg-card border-border">
        <CardContent className="p-4 lg:p-6">
          <div className="flex items-center justify-between mb-3 lg:mb-4">
            <h2 className="text-base lg:text-lg font-semibold text-white">ПРОДУКТИ</h2>
            <Button onClick={handleAddProduct} className="bg-orange-500 hover:bg-orange-600 text-sm">
              <Plus className="w-4 h-4 mr-1 lg:mr-2" />
              <span className="hidden sm:inline">ДОДАТИ</span>
              <span className="sm:hidden">+</span>
            </Button>
          </div>

          <div className="space-y-2 lg:space-y-3">
            {products.map((product) => (
              <div key={product.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 lg:p-4 bg-secondary rounded-lg gap-2">
                <div className="min-w-0">
                  <h3 className="text-white font-medium text-sm lg:text-base truncate">{product.name}</h3>
                  <p className="text-xs lg:text-sm text-muted-foreground">
                    {product.pricePerKg} грн/кг • {product.consumption} кг/м²
                  </p>
                </div>
                <div className="flex items-center gap-1 lg:gap-2 self-end sm:self-auto">
                  <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-white h-8 w-8 p-0">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-white h-8 w-8 p-0">
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300 h-8 w-8 p-0">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="bg-card border-border">
        <CardContent className="p-4 lg:p-6">
          <h2 className="text-base lg:text-lg font-semibold text-white mb-3 lg:mb-4">ПРО ДОДАТОК</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4 text-muted-foreground">
            <div>
              <p className="text-xs lg:text-sm text-gray-500">Версія</p>
              <p className="text-white text-sm lg:text-base">1.0.0</p>
            </div>
            <div>
              <p className="text-xs lg:text-sm text-gray-500">Розробник</p>
              <p className="text-white text-sm lg:text-base">PoliBest 911</p>
            </div>
            <div>
              <p className="text-xs lg:text-sm text-gray-500">Підтримка</p>
              <p className="text-white text-sm lg:text-base break-all">support@polibest911.com</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
