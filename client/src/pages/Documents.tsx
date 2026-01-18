import { useApp } from '@/contexts/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FileText, Eye, Trash2, Send } from 'lucide-react';

export default function Documents() {
  const { documents, deleteDocument } = useApp();

  const handleDelete = (id: string) => {
    deleteDocument(id);
    toast.success('Документ видалено');
  };

  const handleView = (doc: typeof documents[0]) => {
    toast.info('Перегляд документа: ' + doc.name);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">ДОКУМЕНТИ</h1>

      {documents.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="p-8 text-center">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Немає збережених документів</p>
            <p className="text-sm text-muted-foreground mt-2">
              Створіть документ з калькулятора або комерційної пропозиції
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <Card key={doc.id} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-red-600/20 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{doc.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{doc.type}</span>
                        <span>•</span>
                        <span>{doc.area} м²</span>
                        <span>•</span>
                        <span>{new Date(doc.date).toLocaleDateString('uk-UA')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-[#0088cc] hover:bg-[#0077b5] border-[#0088cc]"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-card"
                      onClick={() => handleView(doc)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-card text-red-400 hover:text-red-300 hover:bg-red-400/10"
                      onClick={() => handleDelete(doc.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
