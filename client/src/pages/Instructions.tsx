import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Calculator, FileText, Settings, Briefcase } from 'lucide-react';

const instructions = [
  {
    icon: Calculator,
    title: 'Калькулятор',
    steps: [
      'Оберіть тип покриття (Флоки, Ґрунт, Емаль або Фарба)',
      'Введіть площу приміщення в квадратних метрах',
      'Для флоків оберіть тип лаку (глянцевий або матовий)',
      'Заповніть дані клієнта (опціонально)',
      'Збережіть розрахунок або створіть документ',
    ],
  },
  {
    icon: FileText,
    title: 'Розрахунки',
    steps: [
      'Перегляньте всі збережені розрахунки',
      'Використовуйте чекбокси для включення/виключення з загальної суми',
      'Редагуйте ім\'я клієнта натиснувши на іконку олівця',
      'Видаляйте непотрібні розрахунки',
    ],
  },
  {
    icon: Briefcase,
    title: 'Комерційні пропозиції',
    steps: [
      'Створіть нову КП натиснувши "НОВА КП"',
      'Заповніть дані клієнта та проекту',
      'Додайте приміщення та матеріали',
      'Налаштуйте знижки та умови',
      'Експортуйте в PDF або надішліть клієнту',
    ],
  },
  {
    icon: Settings,
    title: 'Налаштування',
    steps: [
      'Змініть ціни на матеріали в розділі "Ціни калькулятора"',
      'Налаштуйте валюту та одиниці виміру',
      'Додайте або редагуйте продукти',
    ],
  },
];

export default function Instructions() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">ІНСТРУКЦІЇ</h1>

      <div className="grid grid-cols-2 gap-6">
        {instructions.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.title} className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-red-600/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-red-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">{section.title}</h2>
                </div>
                <ol className="space-y-2">
                  {section.steps.map((step, idx) => (
                    <li key={idx} className="flex gap-3 text-muted-foreground">
                      <span className="text-red-400 font-medium">{idx + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Додаткова інформація</h2>
          </div>
          <div className="text-muted-foreground space-y-2">
            <p>Всі дані зберігаються локально у вашому браузері.</p>
            <p>Для експорту в PDF використовуйте кнопку "PDF" на сторінці перегляду КП.</p>
            <p>При виникненні питань зверніться до служби підтримки.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
