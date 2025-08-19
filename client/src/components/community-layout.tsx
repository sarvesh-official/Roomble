'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, X, Grid, List, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { generateRoomId } from '@/lib/utils';
import { ThemeToggleButton } from './ui/theme-toggle-button';

// Mock data for initial development
const MOCK_CATEGORIES = [
  { id: 'all', name: 'All Categories' },
  { id: 'tech', name: 'Technology' },
  { id: 'gaming', name: 'Gaming' },
  { id: 'music', name: 'Music' },
  { id: 'art', name: 'Art & Design' },
  { id: 'education', name: 'Education' },
  { id: 'science', name: 'Science' },
  { id: 'sports', name: 'Sports' }
];

const MOCK_ROOMS = [
  {
    id: '1',
    name: 'Tech Enthusiasts',
    description: 'Discuss the latest in technology, gadgets, and software development.',
    category: 'tech',
    members: 128,
    messages: 1024,
    created_at: '2023-08-15T10:30:00Z',
    last_active: '2023-08-18T14:22:00Z',
    creator: {
      name: 'TechGuru',
      avatar: null
    }
  },
  {
    id: '2',
    name: 'Gaming Lounge',
    description: 'Chat about your favorite games, share tips, and find gaming partners.',
    category: 'gaming',
    members: 256,
    messages: 3072,
    created_at: '2023-07-20T08:15:00Z',
    last_active: '2023-08-18T15:45:00Z',
    creator: {
      name: 'GameMaster',
      avatar: null
    }
  },
  {
    id: '3',
    name: 'Music Production',
    description: 'Share your music, get feedback, and discuss production techniques.',
    category: 'music',
    members: 96,
    messages: 864,
    created_at: '2023-08-01T12:00:00Z',
    last_active: '2023-08-17T22:10:00Z',
    creator: {
      name: 'BeatMaker',
      avatar: null
    }
  },
  {
    id: '4',
    name: 'Design Showcase',
    description: 'Show off your designs, get critiques, and discuss design trends.',
    category: 'art',
    members: 72,
    messages: 512,
    created_at: '2023-08-10T09:45:00Z',
    last_active: '2023-08-18T11:30:00Z',
    creator: {
      name: 'DesignPro',
      avatar: null
    }
  },
  {
    id: '5',
    name: 'Study Group',
    description: 'A quiet place to study together, share resources, and help each other learn.',
    category: 'education',
    members: 48,
    messages: 384,
    created_at: '2023-08-05T14:20:00Z',
    last_active: '2023-08-18T16:15:00Z',
    creator: {
      name: 'StudyBuddy',
      avatar: null
    }
  },
  {
    id: '6',
    name: 'Science Discussions',
    description: 'Explore scientific topics, share research, and debate theories.',
    category: 'science',
    members: 64,
    messages: 448,
    created_at: '2023-07-25T11:10:00Z',
    last_active: '2023-08-17T19:40:00Z',
    creator: {
      name: 'ScienceGeek',
      avatar: null
    }
  }
];

// Room interface definition
interface Room {
  id: string;
  name: string;
  description: string;
  category: string;
  members: number;
  messages: number;
  created_at: string;
  last_active: string;
  creator: {
    name: string;
    avatar: string | null;
  };
}

export function CommunityLayout() {
  const router = useRouter();
  const [rooms, setRooms] = useState(MOCK_ROOMS);
  const [categories] = useState(MOCK_CATEGORIES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Filters and view state
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recently_created');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');

  // Define loadRooms function with useCallback to avoid dependency issues
  const loadRooms = useCallback(() => {
    setLoading(true);

    // Simulate API call with setTimeout
    setTimeout(() => {
      try {
        // Filter rooms based on category and search query
        let filteredRooms = [...MOCK_ROOMS];

        if (selectedCategory !== 'all') {
          filteredRooms = filteredRooms.filter(room => room.category === selectedCategory);
        }

        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          filteredRooms = filteredRooms.filter(room =>
            room.name.toLowerCase().includes(query) ||
            room.description.toLowerCase().includes(query)
          );
        }

        // Sort rooms
        switch (sortBy) {
          case 'recently_created':
            filteredRooms.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            break;
          case 'most_active':
            filteredRooms.sort((a, b) => new Date(b.last_active).getTime() - new Date(a.last_active).getTime());
            break;
          case 'most_members':
            filteredRooms.sort((a, b) => b.members - a.members);
            break;
          case 'most_messages':
            filteredRooms.sort((a, b) => b.messages - a.messages);
            break;
        }

        setRooms(filteredRooms);
        setError(null);
      } catch (_) {
        setError('Failed to load rooms. Please try again.');
        setRooms([]);
      } finally {
        setLoading(false);
      }
    }, 500); // Simulate network delay
  }, [selectedCategory, sortBy, searchQuery]);

  // Load rooms when filters change
  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
  };

  const handleJoinRoom = (roomId: string) => {
    // In a real app, you would call an API to join the room
    // For now, just navigate to the room
    router.push(`/room/${roomId}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleCreateRoom = () => {
    const roomId = generateRoomId();
    router.push(`/room/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center px-4">
          <div className="flex items-center gap-2 mr-4">
            <div className="size-8 overflow-hidden">
              <Image src="/icon.png" alt="Roomble" width={32} height={32} className="w-full h-full object-contain" />
            </div>
            <span className="font-semibold text-xl">Roomble</span>
          </div>

          <nav className="flex-1 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-foreground" onClick={() => router.push('/')}>
                Home
              </Button>
              <Button variant="ghost" className="text-primary font-medium">
                Community
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <ThemeToggleButton
                showLabel
                randomize={true}
              />
              <Button variant="outline" onClick={handleCreateRoom}>
                Create Room
              </Button>
              <Button variant="default">
                Sign In
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <main className="pt-24 pb-8 px-4 md:px-6 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Discover Communities
            </h1>
            <p className="text-muted-foreground">
              Join active discussions and connect with like-minded people
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* View Toggle */}
            <div className="flex items-center rounded-lg border bg-background p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center justify-center rounded-md p-1.5 ${viewMode === 'grid' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center justify-center rounded-md p-1.5 ${viewMode === 'list' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                <List size={18} />
              </button>
            </div>

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <span>
                    {sortBy === 'recently_created' && 'Recently Created'}
                    {sortBy === 'most_active' && 'Most Active'}
                    {sortBy === 'most_members' && 'Most Members'}
                    {sortBy === 'most_messages' && 'Most Messages'}
                  </span>
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy('recently_created')}>
                  Recently Created
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('most_active')}>
                  Most Active
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('most_members')}>
                  Most Members
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('most_messages')}>
                  Most Messages
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-input rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6 overflow-x-auto pb-2">
          <div className="flex space-x-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${selectedCategory === category.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              {searchQuery ? (
                `Found ${rooms.length} rooms matching "${searchQuery}"`
              ) : (
                `Showing ${rooms.length} active rooms`
              )}
            </p>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 px-3 py-1 rounded">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Rooms Grid/List */}
        {loading ? (
          <LoadingSkeleton viewMode={viewMode} />
        ) : rooms.length === 0 ? (
          <EmptyState
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onClearFilters={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            onCreateRoom={handleCreateRoom}
          />
        ) : (
          <div className={
            viewMode === 'grid'
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }>
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                viewMode={viewMode}
                onRoomClick={() => handleRoomClick(room)}
                onJoinRoom={() => handleJoinRoom(room.id)}
              />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {!loading && rooms.length > 0 && rooms.length >= 6 && (
          <div className="text-center mt-8">
            <Button
              onClick={loadRooms}
              variant="outline"
              className="px-6"
            >
              Load More Rooms
            </Button>
          </div>
        )}
      </main>

      {/* Room Detail Modal */}
      {selectedRoom && (
        <RoomDetailModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
          onJoinRoom={() => handleJoinRoom(selectedRoom.id)}
        />
      )}
    </div>
  );
}

// Room Card Component
interface RoomCardProps {
  room: Room;
  viewMode: string;
  onRoomClick: (room: Room) => void;
  onJoinRoom: (roomId: string) => void;
}

function RoomCard({ room, viewMode, onRoomClick, onJoinRoom }: RoomCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  if (viewMode === 'grid') {
    return (
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-lg truncate" title={room.name}>
              {room.name}
            </h3>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {room.category.charAt(0).toUpperCase() + room.category.slice(1)}
            </span>
          </div>

          <p className="text-muted-foreground text-sm mb-4 line-clamp-2" title={room.description}>
            {room.description}
          </p>

          <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
            <div className="flex items-center gap-3">
              <span>{room.members} members</span>
              <span>{room.messages} messages</span>
            </div>
            <span>Created {formatDate(room.created_at)}</span>
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRoomClick(room)}
            >
              Details
            </Button>
            <Button
              size="sm"
              onClick={() => onJoinRoom(room.id)}
            >
              Join Room
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="bg-card rounded-lg border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4 flex flex-col md:flex-row md:items-center">
        <div className="flex-1 mb-4 md:mb-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-lg">{room.name}</h3>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {room.category.charAt(0).toUpperCase() + room.category.slice(1)}
            </span>
          </div>

          <p className="text-muted-foreground text-sm mb-2 line-clamp-1">
            {room.description}
          </p>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>{room.members} members</span>
            <span>{room.messages} messages</span>
            <span>Created {formatDate(room.created_at)}</span>
            <span>Last active {formatDate(room.last_active)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRoomClick(room)}
          >
            Details
          </Button>
          <Button
            size="sm"
            onClick={() => onJoinRoom(room.id)}
          >
            Join Room
          </Button>
        </div>
      </div>
    </div>
  );
}

// Room Detail Modal Component
interface RoomDetailModalProps {
  room: Room;
  onClose: () => void;
  onJoinRoom: (roomId: string) => void;
}

function RoomDetailModal({ room, onClose, onJoinRoom }: RoomDetailModalProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">{room.name}</h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <span className="inline-block text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full mb-2">
                {room.category.charAt(0).toUpperCase() + room.category.slice(1)}
              </span>
              <p className="text-foreground">{room.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Members</div>
                <div className="text-xl font-semibold">{room.members}</div>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Messages</div>
                <div className="text-xl font-semibold">{room.messages}</div>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Created</div>
                <div className="text-sm font-medium">{formatDate(room.created_at)}</div>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Last Active</div>
                <div className="text-sm font-medium">{formatDate(room.last_active)}</div>
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-2">Created by</div>
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center">
                  {room.creator.avatar ? (
                    <Image
                      src={room.creator.avatar}
                      alt={room.creator.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <span className="text-xs font-medium">
                      {room.creator.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="font-medium">{room.creator.name}</span>
              </div>
            </div>

            <div className="pt-4 border-t flex justify-end">
              <Button onClick={() => onJoinRoom(room.id)}>
                Join Room
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading Skeleton Component
function LoadingSkeleton({ viewMode }: { viewMode: string }) {
  return (
    <div className={
      viewMode === 'grid'
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        : "space-y-4"
    }>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-card rounded-lg border shadow-sm overflow-hidden">
          <div className="p-5">
            <div className="flex justify-between items-start mb-3">
              <div className="h-6 bg-muted rounded w-3/4 animate-pulse"></div>
              <div className="h-5 bg-muted rounded-full w-16 animate-pulse"></div>
            </div>

            <div className="h-4 bg-muted rounded w-full mb-2 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-5/6 mb-4 animate-pulse"></div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                <div className="h-3 bg-muted rounded w-16 animate-pulse"></div>
                <div className="h-3 bg-muted rounded w-16 animate-pulse"></div>
              </div>
              <div className="h-3 bg-muted rounded w-24 animate-pulse"></div>
            </div>

            <div className="flex items-center justify-between">
              <div className="h-8 bg-muted rounded w-20 animate-pulse"></div>
              <div className="h-8 bg-muted rounded w-20 animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Empty State Component
interface EmptyStateProps {
  searchQuery: string;
  selectedCategory: string;
  onClearFilters: () => void;
  onCreateRoom: () => void;
}

function EmptyState({
  searchQuery,
  selectedCategory,
  onClearFilters,
  onCreateRoom
}: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-4">
      <div className="size-16 mx-auto mb-4 bg-muted/30 rounded-full flex items-center justify-center">
        <Search size={32} className="text-muted-foreground" />
      </div>

      <h3 className="text-xl font-semibold mb-2">No rooms found</h3>

      {searchQuery || selectedCategory !== 'all' ? (
        <>
          <p className="text-muted-foreground mb-6">
            No rooms match your current filters. Try adjusting your search or category selection.
          </p>
          <Button onClick={onClearFilters} variant="outline" className="mr-2">
            Clear Filters
          </Button>
        </>
      ) : (
        <>
          <p className="text-muted-foreground mb-6">
            There are no community rooms available. Be the first to create one!
          </p>
        </>
      )}

      <Button onClick={onCreateRoom}>
        Create a Room
      </Button>
    </div>
  );
}
