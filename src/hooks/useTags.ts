import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Tag {
  id: string;
  name: string;
  created_at: string;
  count?: number;
}

export const useTags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTags = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get tags with article counts
      const { data, error: fetchError } = await supabase
        .from('tags')
        .select(`
          *,
          article_tags(count)
        `)
        .order('name');

      if (fetchError) {
        throw fetchError;
      }

      // Transform data to include counts
      const tagsWithCounts = data?.map(tag => ({
        ...tag,
        count: tag.article_tags?.length || 0
      })) || [];

      setTags(tagsWithCounts);
    } catch (err) {
      console.error('Error fetching tags:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast({
        title: "Error",
        description: "Failed to load tags. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTag = async (name: string) => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .insert([{ name }])
        .select()
        .single();

      if (error) throw error;

      const newTag = { ...data, count: 0 };
      setTags([...tags, newTag]);
      toast({
        title: "Success",
        description: "Tag created successfully.",
      });
      return newTag;
    } catch (err) {
      console.error('Error creating tag:', err);
      toast({
        title: "Error",
        description: "Failed to create tag. Please try again.",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateTag = async (tagId: string, name: string) => {
    try {
      const { error } = await supabase
        .from('tags')
        .update({ name })
        .eq('id', tagId);

      if (error) throw error;

      setTags(tags.map(tag => 
        tag.id === tagId ? { ...tag, name } : tag
      ));
      toast({
        title: "Success",
        description: "Tag updated successfully.",
      });
    } catch (err) {
      console.error('Error updating tag:', err);
      toast({
        title: "Error",
        description: "Failed to update tag. Please try again.",
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteTag = async (tagId: string) => {
    try {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', tagId);

      if (error) throw error;

      setTags(tags.filter(tag => tag.id !== tagId));
      toast({
        title: "Success",
        description: "Tag deleted successfully.",
      });
    } catch (err) {
      console.error('Error deleting tag:', err);
      toast({
        title: "Error",
        description: "Failed to delete tag. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return {
    tags,
    loading,
    error,
    fetchTags,
    createTag,
    updateTag,
    deleteTag,
    refetch: fetchTags
  };
};