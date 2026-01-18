import { useState, useRef } from 'react';
import { useApp, createThumbnail, PhotoLibraryItem } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Trash2, Image, Upload, X, Check } from 'lucide-react';
import { nanoid } from 'nanoid';

interface PhotoLibraryProps {
  selectedPhotos?: string[];
  onSelectPhoto?: (photoId: string) => void;
  maxSelection?: number;
  mode?: 'manage' | 'select';
}

export default function PhotoLibrary({ 
  selectedPhotos = [], 
  onSelectPhoto, 
  maxSelection = 3,
  mode = 'manage' 
}: PhotoLibraryProps) {
  const { photoLibrary, addPhoto, deletePhoto } = useApp();
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} не є зображенням`);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} занадто великий (макс. 5MB)`);
        continue;
      }

      try {
        const base64 = await fileToBase64(file);
        const thumbnail = await createThumbnail(base64);
        
        const photo: PhotoLibraryItem = {
          id: nanoid(),
          name: file.name,
          data: base64,
          thumbnail,
          dateAdded: new Date().toISOString(),
        };
        
        addPhoto(photo);
        toast.success(`${file.name} додано до бібліотеки`);
      } catch (error) {
        toast.error(`Помилка завантаження ${file.name}`);
      }
    }
    
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleDeletePhoto = (id: string, name: string) => {
    if (confirm(`Видалити "${name}" з бібліотеки?`)) {
      deletePhoto(id);
      toast.success('Фото видалено');
    }
  };

  const isSelected = (id: string) => selectedPhotos.includes(id);
  
  const canSelect = (id: string) => {
    if (isSelected(id)) return true;
    return selectedPhotos.length < maxSelection;
  };

  const handlePhotoClick = (photo: PhotoLibraryItem) => {
    if (mode === 'select' && onSelectPhoto) {
      if (!canSelect(photo.id) && !isSelected(photo.id)) {
        toast.error(`Максимум ${maxSelection} фото`);
        return;
      }
      onSelectPhoto(photo.id);
    } else {
      setPreviewImage(photo.data);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload section */}
      <div className="flex items-center gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="bg-[#c62828] hover:bg-[#b71c1c]"
        >
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? 'Завантаження...' : 'Завантажити фото'}
        </Button>
        {mode === 'select' && (
          <span className="text-sm text-gray-400">
            Вибрано: {selectedPhotos.length} / {maxSelection}
          </span>
        )}
      </div>

      {/* Photo grid */}
      {photoLibrary.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Image className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Бібліотека порожня</p>
          <p className="text-sm">Завантажте фото для використання в КП</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {photoLibrary.map((photo) => (
            <Card 
              key={photo.id} 
              className={`relative overflow-hidden cursor-pointer transition-all hover:ring-2 hover:ring-[#c62828] ${
                isSelected(photo.id) ? 'ring-2 ring-[#c62828]' : ''
              } ${mode === 'select' && !canSelect(photo.id) ? 'opacity-50' : ''}`}
              onClick={() => handlePhotoClick(photo)}
            >
              <CardContent className="p-0">
                <div className="aspect-square relative">
                  <img
                    src={photo.thumbnail}
                    alt={photo.name}
                    className="w-full h-full object-cover"
                  />
                  {isSelected(photo.id) && (
                    <div className="absolute inset-0 bg-[#c62828]/30 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-[#c62828] flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}
                  {mode === 'manage' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePhoto(photo.id, photo.name);
                      }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ opacity: 1 }}
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  )}
                </div>
                <div className="p-2 bg-gray-900">
                  <p className="text-xs text-gray-400 truncate">{photo.name}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Preview dialog */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-4xl bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle>Перегляд фото</DialogTitle>
          </DialogHeader>
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-auto max-h-[70vh] object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
