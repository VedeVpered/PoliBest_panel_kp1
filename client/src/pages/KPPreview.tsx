import { useState, useRef } from 'react';
import { useParams, useLocation } from 'wouter';
import { useApp, PhotoLibraryItem } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { ChevronLeft, Pencil, Download, Printer, Check, Clock } from 'lucide-react';

export default function KPPreview() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { getKP, photoLibrary } = useApp();
  const printRef = useRef<HTMLDivElement>(null);
  
  const kp = getKP(id || '');
  const [selectedRooms, setSelectedRooms] = useState<string[]>(kp?.rooms.map(r => r.id) || []);

  if (!kp) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">КП не знайдено</p>
        <Button onClick={() => navigate('/commercial')} className="mt-4">
          Повернутися
        </Button>
      </div>
    );
  }

  const toggleRoom = (roomId: string) => {
    setSelectedRooms(prev => 
      prev.includes(roomId) 
        ? prev.filter(id => id !== roomId)
        : [...prev, roomId]
    );
  };

  const selectedRoomsData = kp.rooms.filter(r => selectedRooms.includes(r.id));
  
  const calculateRoomTotal = (room: typeof kp.rooms[0]) => {
    let sum = room.materials.reduce((acc, mat) => {
      const qty = room.area * mat.consumption * mat.layers;
      return acc + qty * mat.pricePerKg;
    }, 0);
    if (kp.vatEnabled) sum *= 1.2;
    const discount = sum * (kp.discount / 100);
    return { withVat: sum, discount, final: sum - discount };
  };

  const grandTotal = selectedRoomsData.reduce((sum, room) => {
    return sum + calculateRoomTotal(room).final;
  }, 0);

  const totalArea = selectedRoomsData.reduce((sum, room) => sum + room.area, 0);

  // Get selected photos from library
  const getPhotoById = (photoId: string): PhotoLibraryItem | undefined => {
    return photoLibrary.find(p => p.id === photoId);
  };

  const selectedPhotos = kp.photos
    .map(id => getPhotoById(id))
    .filter((p): p is PhotoLibraryItem => p !== undefined);

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    toast.info('Відкриваємо діалог друку. Виберіть "Зберегти як PDF" для збереження.');
    
    // Add print-specific styles
    const style = document.createElement('style');
    style.id = 'print-styles';
    style.innerHTML = `
      @media print {
        body * {
          visibility: hidden;
        }
        #kp-document, #kp-document * {
          visibility: visible;
        }
        #kp-document {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        .no-print {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
      window.print();
      // Remove styles after print dialog closes
      setTimeout(() => {
        const printStyle = document.getElementById('print-styles');
        if (printStyle) printStyle.remove();
      }, 1000);
    }, 100);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const months = ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 
                    'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} р.`;
  };

  const formatNumber = (num: number) => {
    return Math.round(num).toLocaleString('uk-UA').replace(/,/g, ' ');
  };



  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1a1a1a', padding: '16px 0' }}>
      {/* Header Controls */}
      <div style={{ maxWidth: '850px', margin: '0 auto', padding: '0 12px', marginBottom: '16px' }} className="print:hidden">
        {/* Mobile: stacked layout */}
        <div className="flex flex-col gap-3 lg:hidden">
          <Button 
            variant="ghost" 
            style={{ color: '#9ca3af' }}
            onClick={() => navigate('/commercial')}
            className="self-start"
          >
            <ChevronLeft style={{ width: '16px', height: '16px', marginRight: '8px' }} />
            Назад
          </Button>
          <div className="grid grid-cols-3 gap-2">
            <Button 
              variant="outline" 
              className="bg-transparent border-[#333] text-white text-xs px-2"
              onClick={() => navigate(`/commercial/kp/edit/${id}`)}
            >
              <Pencil className="w-3 h-3 mr-1" />
              Редаг.
            </Button>
            <Button 
              className="bg-[#dc2626] text-white text-xs px-2"
              onClick={handleExportPDF}
            >
              <Download className="w-3 h-3 mr-1" />
              PDF
            </Button>
            <Button 
              variant="outline" 
              className="bg-transparent border-[#333] text-white text-xs px-2"
              onClick={handlePrint}
            >
              <Printer className="w-3 h-3 mr-1" />
              Друк
            </Button>
          </div>
        </div>
        {/* Desktop: horizontal layout */}
        <div className="hidden lg:flex items-center justify-between">
          <Button 
            variant="ghost" 
            style={{ color: '#9ca3af' }}
            onClick={() => navigate('/commercial')}
          >
            <ChevronLeft style={{ width: '16px', height: '16px', marginRight: '8px' }} />
            До комерційного
          </Button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button 
              variant="outline" 
              style={{ backgroundColor: 'transparent', borderColor: '#333', color: 'white' }}
              onClick={() => navigate(`/commercial/kp/edit/${id}`)}
            >
              <Pencil style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              РЕДАГУВАТИ
            </Button>
            <Button 
              style={{ backgroundColor: '#dc2626', color: 'white' }}
              onClick={handleExportPDF}
            >
              <Download style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              СКАЧАТИ PDF
            </Button>
            <Button 
              variant="outline" 
              style={{ backgroundColor: 'transparent', borderColor: '#333', color: 'white' }}
              onClick={handlePrint}
            >
              <Printer style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              ДРУК
            </Button>
          </div>
        </div>
      </div>

      {/* Room Selection Panel */}
      <div style={{ maxWidth: '850px', margin: '0 auto', marginBottom: '16px' }} className="print:hidden px-3 lg:px-4">
        <div style={{ backgroundColor: '#111', border: '1px solid #333' }} className="p-3 lg:p-4">
          <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#9ca3af', marginBottom: '12px' }}>ВИБІР ПРИМІЩЕНЬ:</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {kp.rooms.map((room) => {
              const roomCalc = calculateRoomTotal(room);
              return (
                <label
                  key={room.id}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Checkbox
                      checked={selectedRooms.includes(room.id)}
                      onCheckedChange={() => toggleRoom(room.id)}
                      className="border-red-500 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
                    />
                    <span style={{ color: 'white', fontWeight: '500' }}>{room.name}</span>
                    <span style={{ color: '#6b7280' }}>({room.area} м²)</span>
                  </div>
                  <span style={{ color: '#facc15', fontWeight: '600' }}>
                    {formatNumber(roomCalc.final)} грн
                  </span>
                </label>
              );
            })}
          </div>
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#9ca3af' }}>ЗАГАЛЬНА СУМА:</span>
            <span style={{ fontSize: '24px', fontWeight: '700', color: 'white' }}>
              {formatNumber(grandTotal)} грн
            </span>
          </div>
        </div>
      </div>

      {/* A4 Document Container */}
      <div className="flex justify-center px-2 lg:px-4 overflow-x-auto">
        <div 
          ref={printRef} 
          id="kp-document" 
          className="w-full lg:w-[210mm] min-h-[297mm] font-sans bg-white text-[#1a1a1a] shadow-2xl"
          style={{ 
            maxWidth: '100%',
            fontFamily: 'Arial, sans-serif'
          }}
        >
          {/* DARK Company Header */}
          <div style={{ backgroundColor: '#1a1a1a', color: 'white', padding: '20px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  backgroundColor: 'white', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '18px',
                  color: '#c62828'
                }}>
                  ВВ
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: '700' }}>{kp.companyDetails.name}</div>
                  <div style={{ fontSize: '14px', color: '#d6d6d6' }}>Полімерні покриття преміум класу</div>
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '14px' }}>
                <div style={{ fontWeight: '600' }}>{kp.companyDetails.phones}</div>
                <div style={{ color: '#d6d6d6' }}>{kp.companyDetails.address}</div>
              </div>
            </div>
          </div>

          {/* Gray line separator between header and details */}
          <div style={{ height: '1px', backgroundColor: '#333333' }}></div>

          {/* Company Details Row - DARK background */}
          <div style={{ backgroundColor: '#1a1a1a', padding: '16px 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', fontSize: '12px' }}>
              <div>
                <div style={{ color: '#d6d6d6', fontSize: '10px', textTransform: 'uppercase' }}>ЄДРПОУ</div>
                <div style={{ fontWeight: '300', color: '#ffffff' }}>{kp.companyDetails.edrpou}</div>
              </div>
              <div>
                <div style={{ color: '#d6d6d6', fontSize: '10px', textTransform: 'uppercase' }}>ІПН</div>
                <div style={{ fontWeight: '300', color: '#ffffff' }}>{kp.companyDetails.ipn}</div>
              </div>
              <div>
                <div style={{ color: '#d6d6d6', fontSize: '10px', textTransform: 'uppercase' }}>ПДВ</div>
                <div style={{ fontWeight: '300', color: '#ffffff' }}>№{kp.companyDetails.vatNumber}</div>
              </div>
              <div>
                <div style={{ color: '#d6d6d6', fontSize: '10px', textTransform: 'uppercase' }}>IBAN</div>
                <div style={{ fontWeight: '300', color: '#ffffff', fontSize: '10px' }}>{kp.companyDetails.iban}</div>
              </div>
            </div>
            <div style={{ fontSize: '10px', color: '#d6d6d6', marginTop: '8px' }}>
              {kp.companyDetails.bank}
            </div>
          </div>

          {/* KP Title - Centered */}
          <div style={{ padding: '40px 24px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#212121', letterSpacing: '1px', margin: 0 }}>
              КОМЕРЦІЙНА ПРОПОЗИЦІЯ
            </h2>
            <p style={{ marginTop: '12px', fontSize: '16px', color: '#616161' }}>
              Полімерні матеріали для захисного покриття{' '}
              <span style={{ color: '#c62828', fontWeight: '600' }}>PoliBest 911</span>
            </p>
            <p style={{ marginTop: '8px', color: '#757575', fontSize: '14px' }}>
              на бетонній підлозі площею <strong style={{ color: '#212121' }}>{totalArea} м²</strong> • {kp.location}
            </p>
            {/* Red line separator under title */}
            <div style={{ height: '3px', backgroundColor: '#c62828', margin: '24px auto 0', width: '100%' }}></div>
          </div>

          {/* Client Info with RED left border */}
          <div style={{ 
            margin: '0 24px', 
            borderLeft: '4px solid #c62828', 
            paddingLeft: '24px', 
            paddingTop: '16px', 
            paddingBottom: '16px',
            backgroundColor: '#fafafa'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
              <div>
                <div style={{ fontSize: '10px', color: '#9e9e9e', textTransform: 'uppercase' }}>КЛІЄНТ</div>
                <div style={{ fontWeight: '600', color: '#212121' }}>{kp.client || '—'}</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: '#9e9e9e', textTransform: 'uppercase' }}>ПРОЕКТ</div>
                <div style={{ fontWeight: '600', color: '#212121' }}>{kp.name || '—'}</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: '#9e9e9e', textTransform: 'uppercase' }}>ДАТА КП</div>
                <div style={{ fontWeight: '600', color: '#212121' }}>{formatDate(kp.date)}</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div style={{ padding: '24px', fontSize: '14px', color: '#424242' }}>
            <p style={{ margin: 0 }}>{kp.description}</p>
          </div>

          {/* Purposes List */}
          <div style={{ padding: '0 24px 24px', fontSize: '14px' }}>
            <p style={{ color: '#424242', marginBottom: '8px' }}>Призначене для:</p>
            <ul style={{ margin: 0, paddingLeft: '0', listStyle: 'none' }}>
              <li style={{ color: '#424242', marginBottom: '4px' }}>• Виробничих цехів та приміщень</li>
              <li style={{ color: '#424242', marginBottom: '4px' }}>• Складських комплексів</li>
              <li style={{ color: '#424242', marginBottom: '4px' }}>• Паркінгів та автосервісів</li>
              <li style={{ color: '#424242', marginBottom: '4px' }}>• Торгових площ</li>
              <li style={{ color: '#424242', marginBottom: '4px' }}>• Харчових виробництв</li>
              <li style={{ color: '#424242', marginBottom: '4px' }}>• Фармацевтичних підприємств</li>
            </ul>
          </div>

          {/* Rooms Tables */}
          {selectedRoomsData.map((room) => {
            const roomCalc = calculateRoomTotal(room);
            const totalLayers = room.materials.reduce((sum, m) => sum + m.layers, 0);
            
            return (
              <div key={room.id} style={{ margin: '0 24px 20px' }}>
                {/* Room Header - DARK background */}
                <div style={{ 
                  backgroundColor: '#333333', 
                  padding: '10px 16px', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center'
                }}>
                  <h3 style={{ fontWeight: '700', color: '#ffffff', margin: 0, fontSize: '14px' }}>
                    {room.name} — {room.area} м²
                  </h3>
                  <span style={{ color: '#ffffff', fontWeight: '400', fontSize: '13px' }}>{totalLayers} шарів</span>
                </div>
                
                {/* Materials Table */}
                <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                      <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: '500', color: '#616161', width: '50px', borderRight: '1px solid #e0e0e0' }}>№</th>
                      <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '500', color: '#616161', borderRight: '1px solid #e0e0e0' }}>Матеріал</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: '500', color: '#616161', width: '70px', borderRight: '1px solid #e0e0e0' }}>Шари</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: '500', color: '#616161', width: '80px', borderRight: '1px solid #e0e0e0' }}>Витрата<br/>кг/м²</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: '500', color: '#616161', width: '70px', borderRight: '1px solid #e0e0e0' }}>К-сть<br/>кг</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: '500', color: '#616161', width: '80px', borderRight: '1px solid #e0e0e0' }}>Ціна/кг<br/>з ПДВ</th>
                      <th style={{ padding: '10px 12px', textAlign: 'right', fontWeight: '500', color: '#616161', width: '100px' }}>Сума<br/>з ПДВ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {room.materials.map((mat, idx) => {
                      const qty = room.area * mat.consumption * mat.layers;
                      const matTotal = qty * mat.pricePerKg * (kp.vatEnabled ? 1.2 : 1);
                      return (
                        <tr key={mat.id} style={{ borderBottom: '1px solid #e8e8e8' }}>
                          <td style={{ padding: '12px 12px', textAlign: 'center', color: '#616161', borderRight: '1px solid #e8e8e8' }}>{idx + 1}</td>
                          <td style={{ padding: '12px 12px', color: '#212121', borderRight: '1px solid #e8e8e8' }}>{mat.name}</td>
                          <td style={{ padding: '12px 12px', textAlign: 'center', color: '#c62828', fontWeight: '700', borderRight: '1px solid #e8e8e8' }}>{mat.layers}</td>
                          <td style={{ padding: '12px 12px', textAlign: 'center', color: '#424242', borderRight: '1px solid #e8e8e8' }}>{mat.consumption.toFixed(2)}</td>
                          <td style={{ padding: '12px 12px', textAlign: 'center', color: '#424242', borderRight: '1px solid #e8e8e8' }}>{Math.round(qty)}</td>
                          <td style={{ padding: '12px 12px', textAlign: 'center', color: '#424242', borderRight: '1px solid #e8e8e8' }}>{formatNumber(mat.pricePerKg * (kp.vatEnabled ? 1.2 : 1))}</td>
                          <td style={{ padding: '12px 12px', textAlign: 'right', fontWeight: '700', color: '#212121' }}>{formatNumber(matTotal)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Room Totals */}
                <div style={{ padding: '12px 8px', borderBottom: '1px solid #e0e0e0' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '40px', fontSize: '13px' }}>
                    <div>
                      <span style={{ color: '#424242' }}>Вартість з ПДВ: </span>
                      <span style={{ fontWeight: '700', color: '#212121' }}>{formatNumber(roomCalc.withVat)} грн</span>
                    </div>
                    {kp.discount > 0 && (
                      <div>
                        <span style={{ color: '#16a34a' }}>Знижка {kp.discount}%: </span>
                        <span style={{ fontWeight: '700', color: '#16a34a' }}>-{formatNumber(roomCalc.discount)} грн</span>
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <span style={{ color: '#212121', fontWeight: '700', fontSize: '14px' }}>
                      РАЗОМ: <span style={{ color: '#c62828' }}>{formatNumber(roomCalc.final)} грн</span>
                    </span>
                  </div>
                </div>

                {/* Production time and warranty */}
                <div style={{ 
                  borderLeft: '3px solid #e0e0e0', 
                  paddingLeft: '12px', 
                  marginTop: '12px', 
                  display: 'flex', 
                  gap: '32px', 
                  fontSize: '12px', 
                  color: '#616161' 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock style={{ width: '12px', height: '12px' }} />
                    <span>{kp.productionTime}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Check style={{ width: '12px', height: '12px' }} />
                    <span>{kp.warranty}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Grand Total - RED background */}
          <div style={{ 
            margin: '0 24px 16px', 
            backgroundColor: '#ac0c0c', 
            color: 'white', 
            padding: '12px 24px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center'
          }}>
            <div>
              <p style={{ fontSize: '13px', fontWeight: '700', margin: 0 }}>ЗАГАЛЬНА ВАРТІСТЬ З ПДВ</p>
              <p style={{ fontSize: '11px', opacity: 0.8, margin: '2px 0 0 0' }}>з урахуванням знижки</p>
            </div>
            <p style={{ fontSize: '28px', fontWeight: '700', margin: 0 }}>{formatNumber(grandTotal)} грн</p>
          </div>

          {/* Advantages & Tech Params */}
          {/* Advantages and Technical Params - Two Columns */}
          <div style={{ 
            padding: '24px', 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '48px'
          }}>
            {/* Advantages */}
            <div>
              <h4 style={{ 
                fontWeight: '700', 
                fontSize: '14px', 
                textTransform: 'uppercase', 
                marginBottom: '0', 
                color: '#1a1a1a',
                letterSpacing: '0.5px'
              }}>
                ПЕРЕВАГИ POLIBEST 911
              </h4>
              <div style={{ height: '3px', backgroundColor: '#c62828', marginTop: '8px', marginBottom: '20px' }} />
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {kp.advantages.map((adv, idx) => (
                  <li key={idx} style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '10px', 
                    marginBottom: '12px', 
                    fontSize: '13px',
                    lineHeight: '1.5'
                  }}>
                    <Check style={{ 
                      width: '18px', 
                      height: '18px', 
                      color: '#c62828', 
                      flexShrink: 0, 
                      marginTop: '1px' 
                    }} />
                    <span style={{ color: '#333333' }}>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technical Params */}
            <div>
              <h4 style={{ 
                fontWeight: '700', 
                fontSize: '14px', 
                textTransform: 'uppercase', 
                marginBottom: '0', 
                color: '#1a1a1a',
                letterSpacing: '0.5px'
              }}>
                ТЕХНІЧНІ ПАРАМЕТРИ
              </h4>
              <div style={{ height: '3px', backgroundColor: '#c62828', marginTop: '8px', marginBottom: '20px' }} />
              <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                <tbody>
                  {kp.technicalParams.map((param, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #e0e0e0' }}>
                      <td style={{ 
                        padding: '12px 0', 
                        color: '#333333',
                        fontWeight: '400'
                      }}>
                        {param.param}
                      </td>
                      <td style={{ 
                        padding: '12px 0', 
                        textAlign: 'right', 
                        fontWeight: '600', 
                        color: '#1a1a1a'
                      }}>
                        {param.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Photos Section */}
          {selectedPhotos.length > 0 && (
            <>
              <div style={{ 
                backgroundColor: '#333333', 
                padding: '24px 24px 32px',
                marginTop: '0'
              }}>
                <h4 style={{ 
                  fontSize: '14px', 
                  fontWeight: '700', 
                  marginBottom: '24px',
                  color: '#ffffff',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}>
                  ПРИКЛАДИ ВИКОНАНИХ РОБІТ
                </h4>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(3, 1fr)', 
                  gap: '16px'
                }}>
                  {selectedPhotos.slice(0, 3).map((photo, idx) => (
                    <div key={photo.id} style={{ 
                      aspectRatio: '4/3', 
                      backgroundColor: '#ffffff', 
                      borderRadius: '6px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
                      padding: '5px'
                    }}>
                      <img 
                        src={photo.data} 
                        alt={photo.name || `Фото ${idx + 1}`} 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          borderRadius: '3px'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              {/* Gray separator line after photos */}
              <div style={{ 
                height: '1px', 
                backgroundColor: '#cccccc',
                margin: '0'
              }} />
            </>
          )}

          {/* Footer */}
          <div style={{ padding: '24px', borderTop: '1px solid #e0e0e0', marginTop: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <p style={{ color: '#757575', fontSize: '12px', margin: '0 0 16px 0' }}>З повагою,</p>
                <div style={{ borderTop: '1px solid #212121', width: '200px', paddingTop: '8px' }}>
                  <p style={{ fontWeight: '600', color: '#212121', margin: 0, fontSize: '14px' }}>Менеджер</p>
                  <p style={{ color: '#757575', fontSize: '12px', margin: '4px 0 0 0' }}>{kp.companyDetails.phones.split(',')[0]}</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: '#9e9e9e', fontSize: '10px', margin: 0 }}>(підпис)</p>
              </div>
            </div>
          </div>

          {/* Document Footer */}
          <div style={{ 
            padding: '16px 24px', 
            backgroundColor: '#fafafa', 
            borderTop: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '10px',
            color: '#9e9e9e'
          }}>
            <span>© {new Date().getFullYear()} {kp.companyDetails.name}</span>
            <span>Ціни дійсні на момент формування пропозиції</span>
          </div>
        </div>
      </div>
    </div>
  );
}
