import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Tags, TrendingUp, Clock } from "lucide-react";
import { useArticles } from "@/hooks/useArticles";
import { useTags } from "@/hooks/useTags";

const AdminDashboard = () => {
  const { articles, loading: articlesLoading } = useArticles();
  const { tags, loading: tagsLoading } = useTags();

  const stats = {
    totalArticles: articles.length,
    totalTags: tags.length,
    recentArticles: articles.slice(0, 5),
    publishedThisMonth: articles.filter(article => {
      const articleDate = new Date(article.publication_date);
      const now = new Date();
      return articleDate.getMonth() === now.getMonth() && 
             articleDate.getFullYear() === now.getFullYear();
    }).length
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-primary-foreground/80">Manage EDPB documents and content</p>
            </div>
            <Link to="/">
              <Button variant="secondary">
                View Public Site
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link to="/admin/articles/new">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center p-6">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Create New Article</h3>
                  <p className="text-sm text-muted-foreground">Add a new document to the collection</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/tags">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center p-6">
                <div className="bg-secondary/10 p-3 rounded-full mr-4">
                  <Tags className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold">Manage Tags</h3>
                  <p className="text-sm text-muted-foreground">Organize document categories</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {articlesLoading ? '...' : stats.totalArticles}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tags</CardTitle>
              <Tags className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {tagsLoading ? '...' : stats.totalTags}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {articlesLoading ? '...' : stats.publishedThisMonth}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.recentArticles.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Articles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Articles
                <Link to="/admin/articles">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {articlesLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : stats.recentArticles.length === 0 ? (
                <p className="text-muted-foreground">No articles yet.</p>
              ) : (
                <div className="space-y-4">
                  {stats.recentArticles.map((article) => (
                    <div key={article.id} className="border-l-2 border-primary/20 pl-4">
                      <h4 className="font-medium line-clamp-2">{article.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(article.publication_date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Popular Tags
                <Link to="/admin/tags">
                  <Button variant="outline" size="sm">Manage Tags</Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tagsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-muted rounded w-2/3 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-1/4"></div>
                    </div>
                  ))}
                </div>
              ) : tags.length === 0 ? (
                <p className="text-muted-foreground">No tags created yet.</p>
              ) : (
                <div className="space-y-3">
                  {tags.slice(0, 8).map((tag) => (
                    <div key={tag.id} className="flex items-center justify-between">
                      <span className="font-medium">{tag.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {tag.count || 0} article{(tag.count || 0) !== 1 ? 's' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;