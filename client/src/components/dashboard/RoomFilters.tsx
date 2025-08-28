'use client';

import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  Globe, 
  Lock, 
  Star, 
  TrendingUp, 
  UserCircle 
} from 'lucide-react';

interface RoomFiltersProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  visibilityTab: string;
  setVisibilityTab: (tab: string) => void;
}

export function RoomFilters({ 
  activeTab, 
  setActiveTab, 
  visibilityTab, 
  setVisibilityTab 
}: RoomFiltersProps) {
  return (
    <div className="mb-6">
      {/* Visibility Filter */}
      <div className="mb-3 overflow-x-auto scrollbar-hide pb-1">
        <Tabs value={visibilityTab} onValueChange={setVisibilityTab}>
          <TabsList className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground w-full sm:w-fit md:max-w-xs">
            <TabsTrigger 
              value="public" 
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs sm:text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm flex-1 sm:flex-initial"
            >
              <Globe size={14} className="hidden sm:inline" /> Public Rooms
            </TabsTrigger>
            <TabsTrigger 
              value="private" 
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs sm:text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm flex-1 sm:flex-initial"
            >
              <Lock size={14} className="hidden sm:inline" /> Private Rooms
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Category Filter */}
      <div className="flex overflow-x-auto scrollbar-hide pb-1 gap-2">
        <div className="flex gap-2 flex-nowrap min-w-full sm:flex-wrap">
        <Button 
          variant={activeTab === 'all' ? 'default' : 'outline'} 
          size="sm" 
          className="text-xs h-7 px-2.5 whitespace-nowrap" 
          onClick={() => setActiveTab('all')}
        >
          All
        </Button>
        <Button 
          variant={activeTab === 'featured' ? 'default' : 'outline'} 
          size="sm" 
          className="text-xs h-7 px-2.5 flex items-center gap-1 whitespace-nowrap" 
          onClick={() => setActiveTab('featured')}
        >
          <Star className="h-3 w-3 hidden sm:inline" /> Featured
        </Button>
        <Button 
          variant={activeTab === 'popular' ? 'default' : 'outline'} 
          size="sm" 
          className="text-xs h-7 px-2.5 flex items-center gap-1 whitespace-nowrap" 
          onClick={() => setActiveTab('popular')}
        >
          <TrendingUp className="h-3 w-3 hidden sm:inline" /> Popular
        </Button>
        <Button 
          variant={activeTab === 'recent' ? 'default' : 'outline'} 
          size="sm" 
          className="text-xs h-7 px-2.5 flex items-center gap-1 whitespace-nowrap" 
          onClick={() => setActiveTab('recent')}
        >
          <Clock className="h-3 w-3 hidden sm:inline" /> Recent
        </Button>
        <Button 
          variant={activeTab === 'created-by-you' ? 'default' : 'outline'} 
          size="sm" 
          className="text-xs h-7 px-2.5 flex items-center gap-1 whitespace-nowrap" 
          onClick={() => setActiveTab('created-by-you')}
        >
          <UserCircle className="h-3 w-3 hidden sm:inline" /> Created by you
        </Button>
        </div>
      </div>
    </div>
  );
}
