import { useMemo } from "react";
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
  filters: {
    search: string;
    publicationType: string;
    selectedTags: string[];
    memberState: string;
    dateRange: { start: string; end: string };
  };
  onFilterChange: (filters: {
    search: string;
    publicationType: string;
    selectedTags: string[];
    memberState: string;
    dateRange: { start: string; end: string };
  }) => void;
}

const FilterSidebar = ({ tags, filters, onFilterChange }: FilterSidebarProps) => {
  const handleSearchChange = (value: string) => {
    onFilterChange({ ...filters, search: value });
  };

  const handlePublicationTypeChange = (value: string) => {
    onFilterChange({ ...filters, publicationType: value });
  };

  const handleTagChange = (tagId: string, checked: boolean) => {
    const newSelectedTags = checked 
      ? [...filters.selectedTags, tagId]
      : filters.selectedTags.filter(id => id !== tagId);
    onFilterChange({ ...filters, selectedTags: newSelectedTags });
  };

  const handleMemberStateChange = (value: string) => {
    onFilterChange({ ...filters, memberState: value });
  };

  const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
    onFilterChange({ 
      ...filters, 
      dateRange: { ...filters.dateRange, [field]: value } 
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      search: "",
      publicationType: "all",
      selectedTags: [],
      memberState: "all",
      dateRange: { start: "", end: "" }
    });
  };

  const hasActiveFilters = useMemo(() => {
    return filters.search || 
           (filters.publicationType && filters.publicationType !== "all") || 
           filters.selectedTags.length > 0 || 
           (filters.memberState && filters.memberState !== "all") || 
           filters.dateRange.start || 
           filters.dateRange.end;
  }, [filters]);

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
                value={filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Publication Type */}
          <div className="space-y-2">
            <Label>Publication type</Label>
            <Select value={filters.publicationType} onValueChange={handlePublicationTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="- All -" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">- All -</SelectItem>
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
                    checked={filters.selectedTags.includes(tag.id)}
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
            <Select value={filters.memberState} onValueChange={handleMemberStateChange}>
              <SelectTrigger>
                <SelectValue placeholder="- All -" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">- All -</SelectItem>
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
                  value={filters.dateRange.start}
                  onChange={(e) => handleDateRangeChange('start', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="date-end" className="text-xs text-muted-foreground">To</Label>
                <Input
                  id="date-end"
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => handleDateRangeChange('end', e.target.value)}
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