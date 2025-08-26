import { useState, useMemo } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ArticleCard from "@/components/ArticleCard";
import FilterSidebar from "@/components/FilterSidebar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useArticles } from "@/hooks/useArticles";
import { useTags } from "@/hooks/useTags";

const ARTICLES_PER_PAGE = 8;

const Articles = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    publicationType: 'all',
    selectedTags: [] as string[],
    memberState: 'all',
    dateRange: { start: '', end: '' }
  });

  const { articles: allArticles, loading } = useArticles();
  const { tags } = useTags();

  // Client-side filtering
  const filteredArticles = useMemo(() => {
    if (!allArticles) return [];
    
    return allArticles.filter(article => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const titleMatch = article.title.toLowerCase().includes(searchTerm);
        const contentMatch = article.content?.toLowerCase().includes(searchTerm) || false;
        if (!titleMatch && !contentMatch) return false;
      }
      
      // Publication type filter
      if (filters.publicationType && filters.publicationType !== 'all') {
        const hasPublicationType = article.tags.some(tag => tag.id === filters.publicationType);
        if (!hasPublicationType) return false;
      }
      
      // Tags filter
      if (filters.selectedTags.length > 0) {
        const hasSelectedTag = article.tags.some(tag => filters.selectedTags.includes(tag.id));
        if (!hasSelectedTag) return false;
      }
      
      // Date range filter
      if (filters.dateRange.start) {
        if (article.publication_date < filters.dateRange.start) return false;
      }
      if (filters.dateRange.end) {
        if (article.publication_date > filters.dateRange.end) return false;
      }
      
      return true;
    });
  }, [allArticles, filters]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const endIndex = startIndex + ARTICLES_PER_PAGE;
  const currentArticles = filteredArticles.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <HeroSection />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading documents...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Our documents</h1>
          <p className="text-muted-foreground">
            {filteredArticles.length} document{filteredArticles.length !== 1 ? 's' : ''} found
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <FilterSidebar 
              tags={tags}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {currentArticles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No documents found matching your criteria.</p>
                <p className="text-muted-foreground mt-2">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <>
                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {currentArticles.map((article) => (
                    <ArticleCard 
                      key={article.id} 
                      article={article}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "ghost"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className="w-10"
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Articles;