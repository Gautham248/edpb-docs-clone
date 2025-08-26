import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Download, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface Article {
  id: string;
  title: string;
  content: string | null;
  publication_date: string;
  tags: Array<{ id: string; name: string; }>;
}

interface ArticleCardProps {
  article: Article;
  showAdminActions?: boolean;
  onEdit?: (article: Article) => void;
  onDelete?: (articleId: string) => void;
}

const ArticleCard = ({ article, showAdminActions, onEdit, onDelete }: ArticleCardProps) => {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy");
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <Link 
          to={`/article/${article.id}`}
          className="hover:text-primary transition-colors"
        >
          <h3 className="text-lg font-medium leading-tight line-clamp-3">
            {article.title}
          </h3>
        </Link>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
          <Calendar className="h-4 w-4" />
          {formatDate(article.publication_date)}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Badge 
                  key={tag.id} 
                  variant="secondary" 
                  className="text-xs bg-secondary/10 text-secondary hover:bg-secondary/20 border border-secondary/20"
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <Button 
            size="sm" 
            className="bg-download hover:bg-download/90 text-download-foreground"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          
          {showAdminActions && (
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onEdit?.(article)}
              >
                Edit
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => onDelete?.(article.id)}
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ArticleCard;