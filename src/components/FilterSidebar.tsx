import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface Tag {
  id: string;
  name: string;
  count?: number;
}

interface FilterSidebarProps {
  tags: Tag[];
  onFilterChange: (filters: {
    search: string;
    publicationType: string;
    selectedTags: string[];
    memberState: string;
    dateRange: { start: string; end: string };
  }) => void;
}

const FilterSidebar = ({ tags, onFilterChange }: FilterSidebarProps) => {
  const [search, setSearch] = useState("");
  const [publicationType, setPublicationType] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [memberState, setMemberState] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  // Debounced search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onFilterChange({
        search,
        publicationType,
        selectedTags,
        memberState,
        dateRange,
      });
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [search, publicationType, selectedTags, memberState, dateRange, onFilterChange]);

  const handleTagChange = (tagId: string, checked: boolean) => {
    if (checked) {
      setSelectedTags([...selectedTags, tagId]);
    } else {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    }
  };

  const clearAllFilters = () => {
    setSearch("");
    setPublicationType("");
    setSelectedTags([]);
    setMemberState("");
    setDateRange({ start: "", end: "" });
  };

  const hasActiveFilters = search || publicationType || selectedTags.length > 0 || memberState || dateRange.start || dateRange.end;

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAllFilters}
              className="self-start p-0 h-auto text-sm text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Clear all
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search documents</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by title or content..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Publication Type */}
          <div className="space-y-2">
            <Label>Publication type</Label>
            <Select value={publicationType} onValueChange={setPublicationType}>
              <SelectTrigger>
                <SelectValue placeholder="- All -" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">- All -</SelectItem>
                {tags.map((tag) => (
                  <SelectItem key={tag.id} value={tag.id}>
                    {tag.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Topics */}
          <div className="space-y-3">
            <Label>Topics</Label>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {tags.map((tag) => (
                <div key={tag.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={tag.id}
                    checked={selectedTags.includes(tag.id)}
                    onCheckedChange={(checked) => handleTagChange(tag.id, checked as boolean)}
                  />
                  <Label 
                    htmlFor={tag.id} 
                    className="text-sm font-normal flex-1 cursor-pointer"
                  >
                    {tag.name}
                    {tag.count !== undefined && (
                      <span className="text-muted-foreground ml-1">({tag.count})</span>
                    )}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Member States */}
          <div className="space-y-2">
            <Label>Member states</Label>
            <Select value={memberState} onValueChange={setMemberState}>
              <SelectTrigger>
                <SelectValue placeholder="- All -" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">- All -</SelectItem>
                <SelectItem value="austria">Austria</SelectItem>
                <SelectItem value="belgium">Belgium</SelectItem>
                <SelectItem value="france">France</SelectItem>
                <SelectItem value="germany">Germany</SelectItem>
                <SelectItem value="netherlands">Netherlands</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label>Date</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="date-start" className="text-xs text-muted-foreground">From</Label>
                <Input
                  id="date-start"
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="date-end" className="text-xs text-muted-foreground">To</Label>
                <Input
                  id="date-end"
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FilterSidebar;