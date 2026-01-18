import { Card, CardContent } from '@/components/ui/card';
import { Video as VideoIcon, Play } from 'lucide-react';

const videos = [
  {
    id: 1,
    title: 'Як користуватися калькулятором',
    description: 'Детальна інструкція по використанню калькулятора матеріалів',
    duration: '5:30',
  },
  {
    id: 2,
    title: 'Створення комерційної пропозиції',
    description: 'Покрокова інструкція по створенню КП',
    duration: '8:15',
  },
  {
    id: 3,
    title: 'Налаштування цін та продуктів',
    description: 'Як налаштувати ціни та додати нові продукти',
    duration: '4:45',
  },
  {
    id: 4,
    title: 'Експорт в PDF',
    description: 'Як експортувати КП в PDF формат',
    duration: '3:20',
  },
];

export default function Video() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">ВІДЕО</h1>

      <div className="grid grid-cols-2 gap-6">
        {videos.map((video) => (
          <Card key={video.id} className="bg-card border-border overflow-hidden group cursor-pointer hover:border-red-500/50 transition-colors">
            <div className="aspect-video bg-secondary relative flex items-center justify-center">
              <VideoIcon className="w-16 h-16 text-muted-foreground" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center">
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
              </div>
              <span className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white">
                {video.duration}
              </span>
            </div>
            <CardContent className="p-4">
              <h3 className="text-white font-medium mb-1">{video.title}</h3>
              <p className="text-sm text-muted-foreground">{video.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-6 text-center">
          <VideoIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Відео матеріали знаходяться в розробці
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Скоро тут з'являться навчальні відео
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
