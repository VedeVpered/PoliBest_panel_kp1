import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Wrench, Calculator, FileSpreadsheet, Truck, Palette, HardHat } from 'lucide-react';

const services = [
  {
    icon: Calculator,
    title: 'Розрахунок матеріалів',
    description: 'Точний розрахунок необхідної кількості матеріалів для вашого проекту',
    action: 'Розрахувати',
  },
  {
    icon: FileSpreadsheet,
    title: 'Кошторис робіт',
    description: 'Детальний кошторис з урахуванням всіх витрат на матеріали та роботи',
    action: 'Створити кошторис',
  },
  {
    icon: Truck,
    title: 'Доставка матеріалів',
    description: 'Організація доставки матеріалів на об\'єкт по всій Україні',
    action: 'Замовити доставку',
  },
  {
    icon: Palette,
    title: 'Підбір кольору',
    description: 'Професійний підбір кольору покриття під ваш інтер\'єр',
    action: 'Підібрати колір',
  },
  {
    icon: HardHat,
    title: 'Монтажні роботи',
    description: 'Професійне нанесення покриття нашими спеціалістами',
    action: 'Замовити монтаж',
  },
  {
    icon: Wrench,
    title: 'Технічна підтримка',
    description: 'Консультації та технічна підтримка на всіх етапах',
    action: 'Отримати консультацію',
  },
];

export default function Services() {
  const handleServiceClick = (service: string) => {
    toast.info(`Сервіс "${service}" скоро буде доступний`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">СЕРВІСИ</h1>

      <div className="grid grid-cols-3 gap-6">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <Card key={service.title} className="bg-card border-border hover:border-red-500/50 transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-red-600/20 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                <Button 
                  variant="outline" 
                  className="w-full bg-card hover:bg-red-600 hover:border-red-600"
                  onClick={() => handleServiceClick(service.title)}
                >
                  {service.action}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Контакти для замовлення сервісів</h2>
          <div className="grid grid-cols-3 gap-4 text-muted-foreground">
            <div>
              <p className="text-sm text-gray-500">Телефон</p>
              <p className="text-white">067-402-11-17</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-white">support@polibest911.com</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Графік роботи</p>
              <p className="text-white">Пн-Пт: 9:00-18:00</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
