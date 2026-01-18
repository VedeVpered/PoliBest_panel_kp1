import { useState, useEffect, useMemo } from 'react';
import { useParams, useLocation } from 'wouter';
import { useApp, defaultCompanyDetails, defaultAdvantages, defaultTechnicalParams } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { nanoid } from 'nanoid';
import { ChevronLeft, Plus, Trash2, Eye } from 'lucide-react';
import type { KP, Room, Material } from '@/contexts/AppContext';
import PhotoLibrary from '@/components/PhotoLibrary';

const steps = [
  { id: 1, label: 'ДАНІ КП' },
  { id: 2, label: 'НАЛАШТУВАННЯ' },
  { id: 3, label: 'ПРИМІЩЕННЯ' },
  { id: 4, label: 'ДОДАТКОВО' },
  { id: 5, label: 'ФОТО' },
];

const materialOptions = [
  'PoliBest 911 ґрунтівка (захисна епоксидна глибокопроникна)',
  'PoliBest 911 (захисна епоксидна емаль, колір за погодженням)',
  'PoliBest 911 флоки (декоративне покриття)',
  'PoliBest 911 лак (захисний фінішний шар)',
];

export default function KPEditor() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { getKP, addKP, updateKP } = useApp();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [kp, setKP] = useState<KP>(() => {
    if (id) {
      const existing = getKP(id);
      if (existing) return existing;
    }
    return {
      id: nanoid(),
      name: '',
      client: '',
      location: 'Україна',
      date: new Date().toISOString().split('T')[0],
      status: 'draft',
      currency: 'UAH',
      vatEnabled: true,
      discount: 20,
      productionTime: 'до 9 календарних днів, після 100% оплати',
      warranty: '7 років гарантії на матеріали',
      rooms: [{
        id: nanoid(),
        name: 'Приміщення 1',
        area: 100,
        materials: [
          { id: nanoid(), name: 'PoliBest 911 ґрунтівка (захисна епоксидна глибокопроникна)', consumption: 0.15, layers: 2, pricePerKg: 864 },
          { id: nanoid(), name: 'PoliBest 911 (захисна епоксидна емаль, колір за погодженням)', consumption: 0.30, layers: 3, pricePerKg: 1512 },
        ],
      }],
      companyDetails: defaultCompanyDetails,
      description: 'Полімерні матеріали для захисного полімерного покриття PoliBest 911 (без розчинників).',
      advantages: defaultAdvantages,
      technicalParams: defaultTechnicalParams,
      managerContact: {
        position: 'Менеджер',
        name: '',
        phone: '073-485-92-09',
        email: '',
      },
      photos: [],
      photosPosition: 'end',
      total: 0,
    };
  });

  // Calculate total
  const total = useMemo(() => {
    let sum = 0;
    kp.rooms.forEach(room => {
      room.materials.forEach(mat => {
        const qty = room.area * mat.consumption * mat.layers;
        const materialSum = qty * mat.pricePerKg;
        sum += materialSum;
      });
    });
    if (kp.vatEnabled) {
      sum = sum * 1.2;
    }
    sum = sum * (1 - kp.discount / 100);
    return Math.round(sum);
  }, [kp.rooms, kp.vatEnabled, kp.discount]);

  useEffect(() => {
    setKP(prev => ({ ...prev, total }));
  }, [total]);

  const handleSave = () => {
    if (id) {
      updateKP(id, kp);
    } else {
      addKP(kp);
    }
    toast.success('КП збережено');
    navigate('/commercial');
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSave();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addRoom = () => {
    const newRoom: Room = {
      id: nanoid(),
      name: `Приміщення ${kp.rooms.length + 1}`,
      area: 100,
      materials: [
        { id: nanoid(), name: 'PoliBest 911 ґрунтівка (захисна епоксидна глибокопроникна)', consumption: 0.15, layers: 2, pricePerKg: 864 },
        { id: nanoid(), name: 'PoliBest 911 (захисна епоксидна емаль, колір за погодженням)', consumption: 0.30, layers: 3, pricePerKg: 1512 },
      ],
    };
    setKP({ ...kp, rooms: [...kp.rooms, newRoom] });
  };

  const removeRoom = (roomId: string) => {
    if (kp.rooms.length <= 1) {
      toast.error('Потрібно мати хоча б одне приміщення');
      return;
    }
    setKP({ ...kp, rooms: kp.rooms.filter(r => r.id !== roomId) });
  };

  const updateRoom = (roomId: string, updates: Partial<Room>) => {
    setKP({
      ...kp,
      rooms: kp.rooms.map(r => r.id === roomId ? { ...r, ...updates } : r),
    });
  };

  const addMaterial = (roomId: string) => {
    const newMaterial: Material = {
      id: nanoid(),
      name: 'PoliBest 911 ґрунтівка (захисна епоксидна глибокопроникна)',
      consumption: 0.15,
      layers: 1,
      pricePerKg: 864,
    };
    setKP({
      ...kp,
      rooms: kp.rooms.map(r => 
        r.id === roomId 
          ? { ...r, materials: [...r.materials, newMaterial] }
          : r
      ),
    });
  };

  const removeMaterial = (roomId: string, materialId: string) => {
    setKP({
      ...kp,
      rooms: kp.rooms.map(r => 
        r.id === roomId 
          ? { ...r, materials: r.materials.filter(m => m.id !== materialId) }
          : r
      ),
    });
  };

  const updateMaterial = (roomId: string, materialId: string, updates: Partial<Material>) => {
    setKP({
      ...kp,
      rooms: kp.rooms.map(r => 
        r.id === roomId 
          ? { ...r, materials: r.materials.map(m => m.id === materialId ? { ...m, ...updates } : m) }
          : r
      ),
    });
  };

  const addAdvantage = () => {
    setKP({ ...kp, advantages: [...kp.advantages, ''] });
  };

  const removeAdvantage = (index: number) => {
    setKP({ ...kp, advantages: kp.advantages.filter((_, i) => i !== index) });
  };

  const updateAdvantage = (index: number, value: string) => {
    const newAdvantages = [...kp.advantages];
    newAdvantages[index] = value;
    setKP({ ...kp, advantages: newAdvantages });
  };

  const addTechnicalParam = () => {
    setKP({ ...kp, technicalParams: [...kp.technicalParams, { param: '', value: '' }] });
  };

  const removeTechnicalParam = (index: number) => {
    setKP({ ...kp, technicalParams: kp.technicalParams.filter((_, i) => i !== index) });
  };

  const updateTechnicalParam = (index: number, field: 'param' | 'value', value: string) => {
    const newParams = [...kp.technicalParams];
    newParams[index] = { ...newParams[index], [field]: value };
    setKP({ ...kp, technicalParams: newParams });
  };

  // Step 1: ДАНІ КП
  const renderStep1 = () => (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white border-b border-[#333] pb-2">ДАНІ КП</h2>
      
      <div className="space-y-1">
        <Label className="text-gray-400 text-xs">Назва КП / Проект</Label>
        <Input
          value={kp.name}
          onChange={(e) => setKP({ ...kp, name: e.target.value })}
          placeholder="Введіть назву проекту"
          className="bg-[#1a1a1a] border-[#333] text-white"
        />
      </div>
      
      <div className="space-y-1">
        <Label className="text-gray-400 text-xs">Клієнт</Label>
        <Input
          value={kp.client}
          onChange={(e) => setKP({ ...kp, client: e.target.value })}
          placeholder="Ім'я клієнта"
          className="bg-[#1a1a1a] border-[#333] text-white"
        />
      </div>
      
      <div className="space-y-1">
        <Label className="text-gray-400 text-xs">Локація</Label>
        <Input
          value={kp.location}
          onChange={(e) => setKP({ ...kp, location: e.target.value })}
          placeholder="Україна, Київ"
          className="bg-[#1a1a1a] border-[#333] text-white"
        />
      </div>
      
      <div className="space-y-1">
        <Label className="text-gray-400 text-xs">Дата КП</Label>
        <Input
          type="date"
          value={kp.date}
          onChange={(e) => setKP({ ...kp, date: e.target.value })}
          className="bg-[#1a1a1a] border-[#333] text-white"
        />
      </div>
    </div>
  );

  // Step 2: НАЛАШТУВАННЯ
  const renderStep2 = () => (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white border-b border-[#333] pb-2">НАЛАШТУВАННЯ РОЗРАХУНКУ</h2>
      
      <div className="space-y-1">
        <Label className="text-gray-400 text-xs">Валюта</Label>
        <Select value={kp.currency} onValueChange={(v) => setKP({ ...kp, currency: v })}>
          <SelectTrigger className="bg-[#1a1a1a] border-[#333] text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="UAH">UAH (₴)</SelectItem>
            <SelectItem value="USD">USD ($)</SelectItem>
            <SelectItem value="EUR">EUR (€)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center justify-between py-3 border-b border-[#333]">
        <Label className="text-white">ПДВ (20%)</Label>
        <Switch
          checked={kp.vatEnabled}
          onCheckedChange={(v) => setKP({ ...kp, vatEnabled: v })}
          className="data-[state=checked]:bg-[#c62828]"
        />
      </div>
      
      <div className="space-y-1">
        <Label className="text-gray-400 text-xs">Дилерська знижка (%)</Label>
        <Input
          type="number"
          value={kp.discount}
          onChange={(e) => setKP({ ...kp, discount: Number(e.target.value) })}
          className="bg-[#1a1a1a] border-[#333] text-white"
        />
      </div>
      
      <div className="space-y-1">
        <Label className="text-gray-400 text-xs">Термін виготовлення</Label>
        <Input
          value={kp.productionTime}
          onChange={(e) => setKP({ ...kp, productionTime: e.target.value })}
          className="bg-[#1a1a1a] border-[#333] text-white"
        />
      </div>
      
      <div className="space-y-1">
        <Label className="text-gray-400 text-xs">Гарантія</Label>
        <Input
          value={kp.warranty}
          onChange={(e) => setKP({ ...kp, warranty: e.target.value })}
          className="bg-[#1a1a1a] border-[#333] text-white"
        />
      </div>
    </div>
  );

  // Step 3: ПРИМІЩЕННЯ - точно как на скриншоте
  const renderStep3 = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">ПРИМІЩЕННЯ</h2>
        <Button 
          onClick={addRoom}
          className="bg-[#c62828] hover:bg-[#b71c1c] text-white gap-2 px-4"
        >
          <Plus className="w-4 h-4" />
          Додати
        </Button>
      </div>

      {kp.rooms.map((room) => {
        const totalLayers = room.materials.reduce((sum, m) => sum + m.layers, 0);
        const roomCost = room.materials.reduce((sum, mat) => {
          const qty = room.area * mat.consumption * mat.layers;
          return sum + qty * mat.pricePerKg;
        }, 0);
        const roomCostWithVat = kp.vatEnabled ? roomCost * 1.2 : roomCost;
        const roomDiscount = roomCostWithVat * (kp.discount / 100);
        const roomFinal = roomCostWithVat - roomDiscount;

        return (
          <div key={room.id} className="bg-[#0a0a0a] border border-[#222] p-6 space-y-6">
            {/* Room name input - wide, with delete button */}
            <div className="flex items-center gap-4">
              <Input
                value={room.name}
                onChange={(e) => updateRoom(room.id, { name: e.target.value })}
                className="bg-[#1a1a1a] border-[#333] text-white text-lg font-medium max-w-md h-12"
              />
              <Button
                variant="ghost"
                className="text-gray-500 hover:text-red-400 h-10 w-10 p-0"
                onClick={() => removeRoom(room.id)}
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Area input */}
            <div className="space-y-2">
              <Label className="text-gray-400 text-sm">Площа (м²)</Label>
              <Input
                type="number"
                value={room.area}
                onChange={(e) => updateRoom(room.id, { area: Number(e.target.value) })}
                className="bg-[#1a1a1a] border-[#333] text-white w-40 h-10"
              />
            </div>

            {/* Materials section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-white text-base font-medium">Матеріали</Label>
                <Button
                  variant="ghost"
                  onClick={() => addMaterial(room.id)}
                  className="text-[#c62828] hover:text-[#ef5350] gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Додати
                </Button>
              </div>

              {/* Materials table header */}
              <div className="grid grid-cols-[minmax(200px,2fr)_100px_80px_100px_80px_140px_40px] gap-3 text-xs text-gray-500 uppercase tracking-wide border-b border-[#333] pb-2">
                <span>МАТЕРІАЛ</span>
                <span>ВИТРАТА</span>
                <span className="text-center">ШАРИ</span>
                <span>ЦІНА/КГ</span>
                <span className="text-center">КГ</span>
                <span className="text-right">СУМА</span>
                <span></span>
              </div>

              {/* Materials rows */}
              {room.materials.map((mat) => {
                const qty = room.area * mat.consumption * mat.layers;
                const matTotal = qty * mat.pricePerKg;

                return (
                  <div key={mat.id} className="grid grid-cols-[minmax(200px,2fr)_100px_80px_100px_80px_140px_40px] gap-3 items-center">
                    {/* Material select */}
                    <Select 
                      value={mat.name} 
                      onValueChange={(v) => updateMaterial(room.id, mat.id, { name: v })}
                    >
                      <SelectTrigger className="bg-[#1a1a1a] border-[#333] text-white text-sm h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {materialOptions.map(opt => (
                          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {/* Consumption input */}
                    <Input
                      type="number"
                      step="0.01"
                      value={mat.consumption}
                      onChange={(e) => updateMaterial(room.id, mat.id, { consumption: Number(e.target.value) })}
                      className="bg-[#1a1a1a] border-[#333] text-white text-sm h-10"
                    />
                    
                    {/* Layers - red number */}
                    <div className="text-center text-[#c62828] font-bold text-lg">{mat.layers}</div>
                    
                    {/* Price per kg input */}
                    <Input
                      type="number"
                      value={mat.pricePerKg}
                      onChange={(e) => updateMaterial(room.id, mat.id, { pricePerKg: Number(e.target.value) })}
                      className="bg-[#1a1a1a] border-[#333] text-white text-sm h-10"
                    />
                    
                    {/* Kg - calculated */}
                    <div className="text-center text-gray-300">{qty.toFixed(1)}</div>
                    
                    {/* Sum - red */}
                    <div className="text-right text-[#c62828] font-medium">
                      {matTotal.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₴
                    </div>
                    
                    {/* Delete button */}
                    <Button
                      variant="ghost"
                      className="text-gray-500 hover:text-red-400 h-10 w-10 p-0"
                      onClick={() => removeMaterial(room.id, mat.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>

            {/* Room totals - bottom section */}
            <div className="border-t border-[#333] pt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">
                  Всього шарів: <span className="text-[#c62828] font-medium">{totalLayers}</span>
                </span>
                <span className="text-gray-300">
                  Вартість: <span className="text-white">{roomCost.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₴</span>
                </span>
              </div>
              
              {kp.vatEnabled && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">З ПДВ (20%):</span>
                  <span className="text-white">{roomCostWithVat.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₴</span>
                </div>
              )}
              
              {kp.discount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-[#c62828]">Знижка ({kp.discount}%):</span>
                  <span className="text-[#c62828]">-{roomDiscount.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₴</span>
                </div>
              )}
              
              <div className="flex justify-between items-center pt-2 border-t border-[#333]">
                <span className="text-white font-medium">Разом по приміщенню:</span>
                <span className="text-[#c62828] font-bold text-xl">{roomFinal.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₴</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  // Step 4: ДОДАТКОВО
  const renderStep4 = () => (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-white border-b border-[#333] pb-2">РЕКВІЗИТИ ТА ДОДАТКОВІ БЛОКИ</h2>
      
      {/* Company details */}
      <div className="border border-[#333] p-4 space-y-3">
        <h3 className="text-red-500 font-medium text-sm">РЕКВІЗИТИ КОМПАНІЇ (ШАПКА КП)</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-gray-400 text-xs">Назва компанії</Label>
            <Input
              value={kp.companyDetails.name}
              onChange={(e) => setKP({ ...kp, companyDetails: { ...kp.companyDetails, name: e.target.value } })}
              className="bg-[#1a1a1a] border-[#333] text-white"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-gray-400 text-xs">Телефони</Label>
            <Input
              value={kp.companyDetails.phones}
              onChange={(e) => setKP({ ...kp, companyDetails: { ...kp.companyDetails, phones: e.target.value } })}
              className="bg-[#1a1a1a] border-[#333] text-white"
            />
          </div>
        </div>
        
        <div className="space-y-1">
          <Label className="text-gray-400 text-xs">Адреса</Label>
          <Input
            value={kp.companyDetails.address}
            onChange={(e) => setKP({ ...kp, companyDetails: { ...kp.companyDetails, address: e.target.value } })}
            className="bg-[#1a1a1a] border-[#333] text-white"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-gray-400 text-xs">ЄДРПОУ</Label>
            <Input
              value={kp.companyDetails.edrpou}
              onChange={(e) => setKP({ ...kp, companyDetails: { ...kp.companyDetails, edrpou: e.target.value } })}
              className="bg-[#1a1a1a] border-[#333] text-white"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-gray-400 text-xs">ІПН</Label>
            <Input
              value={kp.companyDetails.ipn}
              onChange={(e) => setKP({ ...kp, companyDetails: { ...kp.companyDetails, ipn: e.target.value } })}
              className="bg-[#1a1a1a] border-[#333] text-white"
            />
          </div>
        </div>
        
        <div className="space-y-1">
          <Label className="text-gray-400 text-xs">IBAN</Label>
          <Input
            value={kp.companyDetails.iban}
            onChange={(e) => setKP({ ...kp, companyDetails: { ...kp.companyDetails, iban: e.target.value } })}
            className="bg-[#1a1a1a] border-[#333] text-white"
          />
        </div>
        
        <div className="space-y-1">
          <Label className="text-gray-400 text-xs">Банк</Label>
          <Input
            value={kp.companyDetails.bank}
            onChange={(e) => setKP({ ...kp, companyDetails: { ...kp.companyDetails, bank: e.target.value } })}
            className="bg-[#1a1a1a] border-[#333] text-white"
          />
        </div>
        
        <div className="space-y-1">
          <Label className="text-gray-400 text-xs">ПДВ номер</Label>
          <Input
value={kp.companyDetails.vatNumber}
              onChange={(e) => setKP({ ...kp, companyDetails: { ...kp.companyDetails, vatNumber: e.target.value } })}
            className="bg-[#1a1a1a] border-[#333] text-white"
          />
        </div>
      </div>

      {/* Description */}
      <div className="border border-[#333] p-4 space-y-3">
        <h3 className="text-red-500 font-medium text-sm">ОПИС (ТЕКСТ ПІД ЗАГОЛОВКОМ)</h3>
        <Textarea
          value={kp.description}
          onChange={(e) => setKP({ ...kp, description: e.target.value })}
          className="bg-[#1a1a1a] border-[#333] text-white min-h-[150px]"
        />
      </div>

      {/* Advantages */}
      <div className="border border-[#333] p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-red-500 font-medium text-sm">ПЕРЕВАГИ</h3>
          <Button
            size="sm"
            variant="ghost"
            onClick={addAdvantage}
            className="text-[#c62828] hover:text-[#ef5350] gap-1"
          >
            <Plus className="w-3 h-3" />
            Додати
          </Button>
        </div>
        
        {kp.advantages.map((adv, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <Input
              value={adv}
              onChange={(e) => updateAdvantage(idx, e.target.value)}
              className="bg-[#1a1a1a] border-[#333] text-white flex-1"
            />
            <Button
              size="sm"
              variant="ghost"
              className="text-gray-500 hover:text-red-400"
              onClick={() => removeAdvantage(idx)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Technical params */}
      <div className="border border-[#333] p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-red-500 font-medium text-sm">ТЕХНІЧНІ ПАРАМЕТРИ</h3>
          <Button
            size="sm"
            variant="ghost"
            onClick={addTechnicalParam}
            className="text-[#c62828] hover:text-[#ef5350] gap-1"
          >
            <Plus className="w-3 h-3" />
            Додати
          </Button>
        </div>
        
        {kp.technicalParams.map((param, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <Input
              value={param.param}
              onChange={(e) => updateTechnicalParam(idx, 'param', e.target.value)}
              placeholder="Параметр"
              className="bg-[#1a1a1a] border-[#333] text-white flex-1"
            />
            <Input
              value={param.value}
              onChange={(e) => updateTechnicalParam(idx, 'value', e.target.value)}
              placeholder="Значення"
              className="bg-[#1a1a1a] border-[#333] text-white flex-1"
            />
            <Button
              size="sm"
              variant="ghost"
              className="text-gray-500 hover:text-red-400"
              onClick={() => removeTechnicalParam(idx)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Manager contact */}
      <div className="border border-[#333] p-4 space-y-3">
        <h3 className="text-red-500 font-medium text-sm">КОНТАКТ МЕНЕДЖЕРА (ФУТЕР КП)</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-gray-400 text-xs">Посада</Label>
            <Input
              value={kp.managerContact.position}
              onChange={(e) => setKP({ ...kp, managerContact: { ...kp.managerContact, position: e.target.value } })}
              className="bg-[#1a1a1a] border-[#333] text-white"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-gray-400 text-xs">Ім'я</Label>
            <Input
              value={kp.managerContact.name}
              onChange={(e) => setKP({ ...kp, managerContact: { ...kp.managerContact, name: e.target.value } })}
              className="bg-[#1a1a1a] border-[#333] text-white"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-gray-400 text-xs">Телефон</Label>
            <Input
              value={kp.managerContact.phone}
              onChange={(e) => setKP({ ...kp, managerContact: { ...kp.managerContact, phone: e.target.value } })}
              className="bg-[#1a1a1a] border-[#333] text-white"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-gray-400 text-xs">Email</Label>
            <Input
              value={kp.managerContact.email}
              onChange={(e) => setKP({ ...kp, managerContact: { ...kp.managerContact, email: e.target.value } })}
              className="bg-[#1a1a1a] border-[#333] text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Step 5: ФОТО
  const handlePhotoSelect = (photoId: string) => {
    if (kp.photos.includes(photoId)) {
      setKP({ ...kp, photos: kp.photos.filter(id => id !== photoId) });
    } else if (kp.photos.length < 3) {
      setKP({ ...kp, photos: [...kp.photos, photoId] });
    }
  };

  const renderStep5 = () => (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-white border-b border-[#333] pb-2">ФОТО</h2>
      
      <div className="space-y-1">
        <Label className="text-gray-400 text-xs">Позиція фото в документі</Label>
        <Select value={kp.photosPosition} onValueChange={(v: 'start' | 'end') => setKP({ ...kp, photosPosition: v })}>
          <SelectTrigger className="bg-[#1a1a1a] border-[#333] text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="start">На початку (після опису)</SelectItem>
            <SelectItem value="end">В кінці (перед підписом)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4">
        <h3 className="text-white font-medium mb-4">Виберіть до 3 фото з бібліотеки</h3>
        <PhotoLibrary
          selectedPhotos={kp.photos}
          onSelectPhoto={handlePhotoSelect}
          maxSelection={3}
          mode="select"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">РЕДАГУВАННЯ КП</h1>
        <Button 
          onClick={() => navigate(`/commercial/kp/preview/${kp.id}`)}
          className="bg-[#c62828] hover:bg-[#b71c1c] text-white gap-2"
        >
          <Eye className="w-4 h-4" />
          Переглянути
        </Button>
      </div>

      {/* Steps navigation */}
      <div className="flex items-center justify-between border-b border-[#333] pb-4">
        {steps.map((step, idx) => (
          <button
            key={step.id}
            onClick={() => setCurrentStep(step.id)}
            className={`flex items-center gap-2 px-4 py-2 transition-colors ${
              currentStep === step.id 
                ? 'text-[#c62828] border-b-2 border-[#c62828]' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <span className={`w-6 h-6 flex items-center justify-center text-sm ${
              currentStep === step.id 
                ? 'bg-[#c62828] text-white' 
                : 'bg-[#333] text-gray-400'
            }`}>
              {step.id}
            </span>
            <span className="text-sm font-medium">{step.label}</span>
          </button>
        ))}
      </div>

      {/* Step content */}
      <div className="min-h-[400px]">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderStep5()}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-[#333]">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={currentStep === 1}
          className="text-gray-400 hover:text-white gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          НАЗАД
        </Button>
        <Button
          onClick={handleNext}
          className="bg-[#c62828] hover:bg-[#b71c1c] text-white"
        >
          {currentStep === 5 ? 'Зберегти' : 'Далі'}
        </Button>
      </div>
    </div>
  );
}
