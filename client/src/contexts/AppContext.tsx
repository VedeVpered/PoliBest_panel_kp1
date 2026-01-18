import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export interface Material {
  id: string;
  name: string;
  consumption: number; // kg/m²
  layers: number;
  pricePerKg: number;
}

export interface Room {
  id: string;
  name: string;
  area: number;
  materials: Material[];
}

export interface Calculation {
  id: string;
  clientName: string;
  productType: 'floki' | 'grunt' | 'emal' | 'farba';
  lacType?: 'glossy' | 'matte';
  area: number;
  date: string;
  source: string;
  total: number;
  includedInSum: boolean;
  items: {
    name: string;
    quantity: number;
    pricePerKg: number;
    total: number;
  }[];
}

export interface KP {
  id: string;
  name: string;
  client: string;
  location: string;
  date: string;
  status: 'draft' | 'sent' | 'paid' | 'cancelled';
  currency: string;
  vatEnabled: boolean;
  discount: number;
  productionTime: string;
  warranty: string;
  rooms: Room[];
  companyDetails: {
    name: string;
    phones: string;
    address: string;
    edrpou: string;
    ipn: string;
    iban: string;
    bank: string;
    vatNumber: string;
  };
  description: string;
  advantages: string[];
  technicalParams: { param: string; value: string }[];
  managerContact: {
    position: string;
    name: string;
    phone: string;
    email: string;
  };
  photos: string[];
  photosPosition: 'start' | 'end' | 'both';
  total: number;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  area: number;
  date: string;
  content: string;
}

export interface PhotoLibraryItem {
  id: string;
  name: string;
  data: string; // base64 encoded image
  thumbnail: string; // smaller base64 for preview
  dateAdded: string;
}

export interface PriceSettings {
  gruntivka: number;
  farba: number;
  emal: number;
  floki: number;
  lacGlossy: number;
  lacMatte: number;
}

export interface AppSettings {
  companyName: string;
  currency: string;
  units: string;
  prices: PriceSettings;
}

interface AppContextType {
  photoLibrary: PhotoLibraryItem[];
  addPhoto: (photo: PhotoLibraryItem) => void;
  deletePhoto: (id: string) => void;
  
  calculations: Calculation[];
  addCalculation: (calc: Calculation) => void;
  updateCalculation: (id: string, calc: Partial<Calculation>) => void;
  deleteCalculation: (id: string) => void;
  toggleCalculationInSum: (id: string) => void;
  
  kps: KP[];
  addKP: (kp: KP) => void;
  updateKP: (id: string, kp: Partial<KP>) => void;
  deleteKP: (id: string) => void;
  getKP: (id: string) => KP | undefined;
  
  documents: Document[];
  addDocument: (doc: Document) => void;
  deleteDocument: (id: string) => void;
  
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  
  getTotalSum: () => number;
}

const defaultSettings: AppSettings = {
  companyName: 'PoliBest 911',
  currency: 'UAH',
  units: 'm²',
  prices: {
    gruntivka: 864,
    farba: 1188,
    emal: 1512,
    floki: 1620,
    lacGlossy: 1728,
    lacMatte: 2160,
  },
};

const defaultCompanyDetails = {
  name: 'ТОВ «ВедеВперед»',
  phones: '067-402-11-17, 093-512-58-38',
  address: '03195, м. Київ, пров. Павла Ле, буд. 21',
  edrpou: '41842552',
  ipn: '418425526506',
  iban: 'UA623052990000260000362068860',
  bank: 'Печерська філія ПАТ КБ "ПРИВАТБАНК", м.Київ МФО 300711',
  vatNumber: '1826504500200',
};

const defaultAdvantages = [
  'Безпечне та екологічне: без шкідливих домішок, можна використовувати в житлових приміщеннях',
  'Глибоко проникаюче: 3-7 мм в бетон, що забезпечує надійну адгезію',
  'Стійке до навантажень: витримує вилочні навантажувачі та важку техніку',
  'Паропроникне: немає ефекту відшарування покриття',
  'Легке в догляді: миється звичайними засобами для підлоги',
  'Хімічна стійкість: до масел, бензину, кислот та лугів',
  'Естетичний вигляд: широкий вибір кольорів',
  'Довговічність: термін служби 15-25 років',
];

const defaultTechnicalParams = [
  { param: 'Тип', value: 'Двокомпонентні' },
  { param: 'Колір', value: 'Сірий, зелений' },
  { param: 'Термін служби в змішаному стані', value: '40 хвилин (+20°C)' },
  { param: 'Температура нанесення', value: '+10...+30°C' },
  { param: 'Товщина шару', value: '0.3-0.5 мм' },
  { param: 'Повна полімеризація', value: '7 діб' },
  { param: 'Термін служби', value: '15-25 років' },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to create thumbnail from base64 image
const createThumbnail = (base64: string, maxSize: number = 200): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ratio = Math.min(maxSize / img.width, maxSize / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
    img.src = base64;
  });
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [calculations, setCalculations] = useState<Calculation[]>(() => {
    const saved = localStorage.getItem('kp-wizard-calculations');
    return saved ? JSON.parse(saved) : [];
  });

  const [kps, setKPs] = useState<KP[]>(() => {
    const saved = localStorage.getItem('kp-wizard-kps');
    return saved ? JSON.parse(saved) : [];
  });

  const [documents, setDocuments] = useState<Document[]>(() => {
    const saved = localStorage.getItem('kp-wizard-documents');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('kp-wizard-settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const [photoLibrary, setPhotoLibrary] = useState<PhotoLibraryItem[]>(() => {
    const saved = localStorage.getItem('kp-wizard-photo-library');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('kp-wizard-calculations', JSON.stringify(calculations));
  }, [calculations]);

  useEffect(() => {
    localStorage.setItem('kp-wizard-kps', JSON.stringify(kps));
  }, [kps]);

  useEffect(() => {
    localStorage.setItem('kp-wizard-documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('kp-wizard-settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('kp-wizard-photo-library', JSON.stringify(photoLibrary));
  }, [photoLibrary]);

  const addCalculation = (calc: Calculation) => {
    setCalculations(prev => [calc, ...prev]);
  };

  const updateCalculation = (id: string, updates: Partial<Calculation>) => {
    setCalculations(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCalculation = (id: string) => {
    setCalculations(prev => prev.filter(c => c.id !== id));
  };

  const toggleCalculationInSum = (id: string) => {
    setCalculations(prev => prev.map(c => 
      c.id === id ? { ...c, includedInSum: !c.includedInSum } : c
    ));
  };

  const addKP = (kp: KP) => {
    setKPs(prev => [kp, ...prev]);
  };

  const updateKP = (id: string, updates: Partial<KP>) => {
    setKPs(prev => prev.map(k => k.id === id ? { ...k, ...updates } : k));
  };

  const deleteKP = (id: string) => {
    setKPs(prev => prev.filter(k => k.id !== id));
  };

  const getKP = (id: string) => {
    return kps.find(k => k.id === id);
  };

  const addDocument = (doc: Document) => {
    setDocuments(prev => [doc, ...prev]);
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const addPhoto = (photo: PhotoLibraryItem) => {
    setPhotoLibrary(prev => [photo, ...prev]);
  };

  const deletePhoto = (id: string) => {
    setPhotoLibrary(prev => prev.filter(p => p.id !== id));
  };

  const getTotalSum = () => {
    return calculations
      .filter(c => c.includedInSum)
      .reduce((sum, c) => sum + c.total, 0);
  };

  return (
    <AppContext.Provider value={{
      photoLibrary,
      addPhoto,
      deletePhoto,
      calculations,
      addCalculation,
      updateCalculation,
      deleteCalculation,
      toggleCalculationInSum,
      kps,
      addKP,
      updateKP,
      deleteKP,
      getKP,
      documents,
      addDocument,
      deleteDocument,
      settings,
      updateSettings,
      getTotalSum,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

export { defaultCompanyDetails, defaultAdvantages, defaultTechnicalParams, createThumbnail };
