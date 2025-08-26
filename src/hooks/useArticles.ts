import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Article {
  id: string;
  title: string;
  content: string | null;
  publication_date: string;
  created_at: string;
  updated_at: string;
  tags: Array<{ id: string; name: string; }>;
}

interface ArticleFilters {
  search: string;
  publicationType: string;
  selectedTags: string[];
  memberState: string;
  dateRange: { start: string; end: string };
}

export const useArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchArticles = async (filters: ArticleFilters = {
    search: '',
    publicationType: '',
    selectedTags: [],
    memberState: '',
    dateRange: { start: '', end: '' }
  }) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('articles')
        .select(`
          *,
          article_tags!inner(
            tags(id, name)
          )
        `)
        .order('publication_date', { ascending: false });

      // Apply search filter
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`);
      }

      // Apply date range filter
      if (filters.dateRange.start) {
        query = query.gte('publication_date', filters.dateRange.start);
      }
      if (filters.dateRange.end) {
        query = query.lte('publication_date', filters.dateRange.end);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      // Transform the data to group tags by article
      const articlesMap = new Map<string, Article>();
      
      data?.forEach((row: any) => {
        const articleId = row.id;
        
        if (!articlesMap.has(articleId)) {
          articlesMap.set(articleId, {
            id: row.id,
            title: row.title,
            content: row.content,
            publication_date: row.publication_date,
            created_at: row.created_at,
            updated_at: row.updated_at,
            tags: []
          });
        }
        
        const article = articlesMap.get(articleId)!;
        if (row.article_tags && row.article_tags.tags) {
          article.tags.push(row.article_tags.tags);
        }
      });

      let filteredArticles = Array.from(articlesMap.values());

      // Apply tag filters
      if (filters.selectedTags.length > 0) {
        filteredArticles = filteredArticles.filter(article =>
          article.tags.some(tag => filters.selectedTags.includes(tag.id))
        );
      }

      // Apply publication type filter
      if (filters.publicationType) {
        filteredArticles = filteredArticles.filter(article =>
          article.tags.some(tag => tag.id === filters.publicationType)
        );
      }

      setArticles(filteredArticles);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast({
        title: "Error",
        description: "Failed to load articles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteArticle = async (articleId: string) => {
    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', articleId);

      if (error) throw error;

      setArticles(articles.filter(article => article.id !== articleId));
      toast({
        title: "Success",
        description: "Article deleted successfully.",
      });
    } catch (err) {
      console.error('Error deleting article:', err);
      toast({
        title: "Error",
        description: "Failed to delete article. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return {
    articles,
    loading,
    error,
    fetchArticles,
    deleteArticle,
    refetch: () => fetchArticles()
  };
};

export const useArticle = (articleId: string) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('articles')
          .select(`
            *,
            article_tags(
              tags(id, name)
            )
          `)
          .eq('id', articleId)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        // Transform tags
        const tags = data.article_tags?.map((at: any) => at.tags) || [];
        
        setArticle({
          ...data,
          tags
        });
      } catch (err) {
        console.error('Error fetching article:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        toast({
          title: "Error",
          description: "Failed to load article. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (articleId) {
      fetchArticle();
    }
  }, [articleId, toast]);

  return { article, loading, error };
};