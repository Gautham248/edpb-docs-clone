import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTags } from "@/hooks/useTags";
import RichTextEditor from "@/components/RichTextEditor";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Article {
  id?: string;
  title: string;
  content: string;
  publication_date: string;
  tags: Array<{ id: string; name: string; }>;
}

const ArticleEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { tags } = useTags();
  
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState<Article>({
    title: '',
    content: '',
    publication_date: new Date().toISOString().split('T')[0],
    tags: []
  });
  const [tagSearchOpen, setTagSearchOpen] = useState(false);

  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      fetchArticle();
    }
  }, [id, isEditing]);

  const fetchArticle = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          article_tags(
            tags(id, name)
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      const tags = data.article_tags?.map((at: any) => at.tags) || [];
      
      setArticle({
        id: data.id,
        title: data.title,
        content: data.content || '',
        publication_date: data.publication_date,
        tags
      });
    } catch (error) {
      console.error('Error fetching article:', error);
      toast({
        title: "Error",
        description: "Failed to load article",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!article.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      let articleData;
      if (isEditing) {
        const { data, error } = await supabase
          .from('articles')
          .update({
            title: article.title,
            content: article.content,
            publication_date: article.publication_date,
          })
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        articleData = data;
      } else {
        const { data, error } = await supabase
          .from('articles')
          .insert([{
            title: article.title,
            content: article.content,
            publication_date: article.publication_date,
          }])
          .select()
          .single();

        if (error) throw error;
        articleData = data;
      }

      // Update article tags
      if (articleData) {
        // Delete existing tags
        await supabase
          .from('article_tags')
          .delete()
          .eq('article_id', articleData.id);

        // Insert new tags
        if (article.tags.length > 0) {
          const tagInserts = article.tags.map(tag => ({
            article_id: articleData.id,
            tag_id: tag.id
          }));

          await supabase
            .from('article_tags')
            .insert(tagInserts);
        }
      }

      toast({
        title: "Success",
        description: `Article ${isEditing ? 'updated' : 'created'} successfully`,
      });

      navigate('/admin/articles');
    } catch (error) {
      console.error('Error saving article:', error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} article`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addTag = (tag: { id: string; name: string }) => {
    if (!article.tags.find(t => t.id === tag.id)) {
      setArticle({
        ...article,
        tags: [...article.tags, tag]
      });
    }
    setTagSearchOpen(false);
  };

  const removeTag = (tagIdToRemove: string) => {
    setArticle({
      ...article,
      tags: article.tags.filter(tag => tag.id !== tagIdToRemove)
    });
  };

  if (loading && isEditing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading article...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/admin/articles">
                <Button variant="secondary" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Articles
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">
                  {isEditing ? 'Edit Article' : 'Create New Article'}
                </h1>
                <p className="text-primary-foreground/80">
                  {isEditing ? 'Update article details' : 'Add a new document to the collection'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/admin/articles">
                <Button variant="outline" disabled={loading}>
                  Cancel
                </Button>
              </Link>
              <Button onClick={handleSave} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Article Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={article.title}
                  onChange={(e) => setArticle({ ...article, title: e.target.value })}
                  placeholder="Enter article title..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="publication_date">Publication Date *</Label>
                <Input
                  id="publication_date"
                  type="date"
                  value={article.publication_date}
                  onChange={(e) => setArticle({ ...article, publication_date: e.target.value })}
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {article.tags.map((tag) => (
                    <Badge key={tag.id} variant="secondary" className="flex items-center gap-1">
                      {tag.name}
                      <button
                        onClick={() => removeTag(tag.id)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                
                <Popover open={tagSearchOpen} onOpenChange={setTagSearchOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      Add Tag
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search tags..." />
                      <CommandEmpty>No tags found.</CommandEmpty>
                      <CommandGroup>
                        {tags
                          .filter(tag => !article.tags.find(t => t.id === tag.id))
                          .map((tag) => (
                            <CommandItem
                              key={tag.id}
                              onSelect={() => addTag(tag)}
                            >
                              {tag.name}
                            </CommandItem>
                          ))
                        }
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>

          {/* Content Editor */}
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Article Content</Label>
                <RichTextEditor
                  value={article.content}
                  onChange={(value) => setArticle({ ...article, content: value })}
                  placeholder="Enter article content..."
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ArticleEditor;