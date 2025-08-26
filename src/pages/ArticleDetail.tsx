import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { useArticle } from "@/hooks/useArticles";
import { format } from "date-fns";

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { article, loading, error } = useArticle(id!);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading document...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">Document not found</h1>
            <p className="text-muted-foreground mb-6">The document you're looking for doesn't exist or has been removed.</p>
            <Link to="/">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Documents
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMMM yyyy");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Documents
            </Button>
          </Link>
        </div>

        <article className="max-w-4xl mx-auto">
          {/* Article Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4 leading-tight">
              {article.title}
            </h1>
            
            <div className="flex items-center gap-4 text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{formatDate(article.publication_date)}</span>
              </div>
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {article.tags.map((tag) => (
                  <Badge 
                    key={tag.id} 
                    variant="secondary" 
                    className="bg-secondary/10 text-secondary hover:bg-secondary/20 border border-secondary/20"
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* Download Button */}
            <div className="border-b pb-6">
              <Button className="bg-download hover:bg-download/90 text-download-foreground">
                <Download className="h-5 w-5 mr-2" />
                Download Document
              </Button>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            {article.content ? (
              <div 
                dangerouslySetInnerHTML={{ __html: article.content }}
                className="text-foreground leading-relaxed"
              />
            ) : (
              <p className="text-muted-foreground italic">
                No content available for this document.
              </p>
            )}
          </div>

          {/* Latest Publications Sidebar */}
          <aside className="mt-12 pt-8 border-t">
            <h2 className="text-xl font-semibold text-foreground mb-4">Latest publications</h2>
            <p className="text-muted-foreground">
              Stay updated with the latest documents and publications from the European Data Protection Board.
            </p>
            <Link to="/" className="mt-4 inline-block">
              <Button variant="outline">View all documents</Button>
            </Link>
          </aside>
        </article>
      </main>
    </div>
  );
};

export default ArticleDetail;