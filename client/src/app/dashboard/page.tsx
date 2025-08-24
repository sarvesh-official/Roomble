'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { generateRoomId } from '@/lib/utils';
import { ThemeToggleButton } from '@/components/ui/theme-toggle-button';
import { UserDropdown } from '@/components/user-dropdown';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Calendar,
    Clock,
    Flame,
    Globe,
    Lock,
    MessageSquare,
    Plus,
    Search,
    Star,
    Tag,
    TrendingUp,
    UserCircle,
    Users
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EnhancedOTPInput from '@/components/enhanced-otp-input';
import { Switch } from '@/components/switch';

interface Room {
    id: string;
    name: string;
    description: string;
    participants: number;
    lastActive: string;
    tags?: string[];
    featured?: boolean;
    popular?: boolean;
    isPublic?: boolean;
    createdBy?: string;
    createdByYou?: boolean;
}

const mockRooms: Room[] = [
    {
        id: 'room-123',
        name: 'Product Design Review',
        description: 'Weekly design review for the new product features',
        participants: 4,
        lastActive: '2 hours ago',
        tags: ['Design', 'Review'],
        isPublic: false,
        createdBy: 'John Doe',
        createdByYou: true
    },
    {
        id: 'room-101',
        name: 'Marketing Strategy',
        description: 'Planning our Q3 marketing campaigns',
        participants: 5,
        lastActive: '1 day ago',
        tags: ['Marketing', 'Planning'],
        featured: true,
        isPublic: true,
        createdBy: 'Sarah Johnson',
        createdByYou: false
    },
    {
        id: 'room-202',
        name: 'Customer Feedback',
        description: 'Discussing recent customer survey results',
        participants: 8,
        lastActive: '4 hours ago',
        tags: ['Feedback', 'Customers'],
        popular: true,
        isPublic: true,
        createdBy: 'Michael Brown',
        createdByYou: false
    },
    {
        id: 'room-303',
        name: 'Private Brainstorming',
        description: 'Confidential brainstorming session for new features',
        participants: 3,
        lastActive: '1 hour ago',
        tags: ['Confidential', 'Planning'],
        isPublic: false,
        createdBy: 'John Doe',
        createdByYou: true
    },
    {
        id: 'room-404',
        name: 'Public Q&A Session',
        description: 'Open Q&A for community members',
        participants: 12,
        lastActive: '5 hours ago',
        tags: ['Community', 'Q&A'],
        popular: true,
        isPublic: true,
        createdBy: 'Emily Wilson',
        createdByYou: false
    }
];

export default function DashboardPage() {
    const router = useRouter();
    const { user } = useUser();
    const [isCreatingRoom, setIsCreatingRoom] = useState(false);
    const [joinRoomModalOpen, setJoinRoomModalOpen] = useState(false);
    const [createRoomModalOpen, setCreateRoomModalOpen] = useState(false);
    const [roomIdInput, setRoomIdInput] = useState('');
    const [roomIdError, setRoomIdError] = useState('');
    const [showRoomConfirmation, setShowRoomConfirmation] = useState(false);
    const [roomToJoin, setRoomToJoin] = useState<Room | null>(null);
    const [isVerifyingCode, setIsVerifyingCode] = useState(false);
    const [roomNameInput, setRoomNameInput] = useState('');
    const [roomNameError, setRoomNameError] = useState('');
    const [roomDescriptionInput, setRoomDescriptionInput] = useState('');
    const [roomTagsInput, setRoomTagsInput] = useState('');
    const [isRoomPublic, setIsRoomPublic] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [visibilityTab, setVisibilityTab] = useState('public');
    const [mounted, setMounted] = useState(false);
    const [rooms] = useState<Room[]>(mockRooms);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleCreateRoom = () => {
        // Validate room name
        if (!roomNameInput.trim()) {
            setRoomNameError('Please enter a room name');
            return;
        }

        setIsCreatingRoom(true);
        const roomId = generateRoomId();

        // Process tags if provided
        const tags = roomTagsInput.trim()
            ? roomTagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
            : [];

        // Get current user name (in a real app, this would come from authentication)
        const currentUser = user?.fullName || localStorage.getItem('roomble-username') || 'Guest User';

        // In a real app, you would save the room data to your backend
        // For now, we'll just store in localStorage and navigate to the room
        setTimeout(() => {
            // Store room details in localStorage
            localStorage.setItem('roomble-room-name', roomNameInput.trim());
            localStorage.setItem('roomble-room-description', roomDescriptionInput.trim());
            localStorage.setItem('roomble-room-tags', JSON.stringify(tags));
            localStorage.setItem('roomble-room-public', String(isRoomPublic));
            localStorage.setItem('roomble-room-creator', currentUser);
            router.push(`/room/${roomId}`);
        }, 1000);
    };

    // Room functions are handled by the EnhancedOTPInput component

    // Don't render until client-side to prevent hydration mismatch
    if (!mounted) {
        return <div className="min-h-screen bg-background"></div>;
    }

    // Filter rooms based on search query, visibility and active tab
    const filteredRooms = rooms.filter(room => {
        // Search filter
        const matchesSearch = searchQuery === '' || 
            room.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            (room.description && room.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (room.tags && room.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
        
        // Visibility filter
        const matchesVisibility = 
            visibilityTab === 'public' ? room.isPublic !== false : 
            visibilityTab === 'private' ? room.isPublic === false : 
            true;
        
        // Category filter
        const matchesCategory = 
            activeTab === 'all' ? true : 
            activeTab === 'featured' ? room.featured : 
            activeTab === 'popular' ? room.popular :
            activeTab === 'recent' ? true : // In a real app, you'd filter by recently joined rooms
            activeTab === 'created-by-you' ? room.createdByYou :
            true;

        return matchesSearch && matchesVisibility && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border/40 sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
                        <div className="size-8 overflow-hidden">
                            <Image src="/icon.png" alt="Roomble" width={32} height={32} className="w-full h-full object-contain" />
                        </div>
                        <span className="font-semibold text-xl">Roomble</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggleButton randomize={true} />
                        <UserDropdown />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-6">
                <div className="max-w-6xl mx-auto">
                    {/* Page Title and Search */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
                            <p className="text-muted-foreground">Join existing rooms or create your own</p>
                        </div>

                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search rooms..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    {/* Quick Actions */}
                    <div className="flex justify-end gap-3 mb-6">
                        <Button
                            className="gap-1.5"
                            variant="outline"
                            size="sm"
                            onClick={() => setJoinRoomModalOpen(true)}
                        >
                            <Users size={14} /> Join Room
                        </Button>
                        <Button
                            className="gap-1.5"
                            size="sm"
                            onClick={() => setCreateRoomModalOpen(true)}
                        >
                            <Plus size={14} /> Create Room
                        </Button>
                    </div>

                    {/* Room Filters */}
                    <div className="mb-6">
                        {/* Visibility Filter */}
                        <div className="mb-3">
                            <Tabs defaultValue="public" onValueChange={setVisibilityTab}>
                                <TabsList className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
                                    <TabsTrigger value="public" className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                                        <Globe size={14} /> Public Rooms
                                    </TabsTrigger>
                                    <TabsTrigger value="private" className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                                        <Lock size={14} /> Private Rooms
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                        
                        {/* Category Filter */}
                        <div className="flex flex-wrap gap-2">
                            <Button 
                                variant={activeTab === 'all' ? 'default' : 'outline'} 
                                size="sm" 
                                className="text-xs h-7 px-2.5" 
                                onClick={() => setActiveTab('all')}
                            >
                                All
                            </Button>
                            <Button 
                                variant={activeTab === 'featured' ? 'default' : 'outline'} 
                                size="sm" 
                                className="text-xs h-7 px-2.5 flex items-center gap-1" 
                                onClick={() => setActiveTab('featured')}
                            >
                                <Star className="h-3 w-3" /> Featured
                            </Button>
                            <Button 
                                variant={activeTab === 'popular' ? 'default' : 'outline'} 
                                size="sm" 
                                className="text-xs h-7 px-2.5 flex items-center gap-1" 
                                onClick={() => setActiveTab('popular')}
                            >
                                <TrendingUp className="h-3 w-3" /> Popular
                            </Button>
                            <Button 
                                variant={activeTab === 'recent' ? 'default' : 'outline'} 
                                size="sm" 
                                className="text-xs h-7 px-2.5 flex items-center gap-1" 
                                onClick={() => setActiveTab('recent')}
                            >
                                <Clock className="h-3 w-3" /> Recent
                            </Button>
                            <Button 
                                variant={activeTab === 'created-by-you' ? 'default' : 'outline'} 
                                size="sm" 
                                className="text-xs h-7 px-2.5 flex items-center gap-1" 
                                onClick={() => setActiveTab('created-by-you')}
                            >
                                <UserCircle className="h-3 w-3" /> Created by you
                            </Button>
                        </div>
                    </div>

                    {/* Rooms Grid */}
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                    >
                        {filteredRooms.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredRooms.map((room, index) => (
                                    <motion.div
                                        key={room.id}
                                        className="relative p-5 bg-card border border-border/50 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-all hover:border-primary/30 flex flex-col h-full"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05, duration: 0.4 }}
                                        onClick={() => {
                                            setRoomToJoin(room);
                                            setShowRoomConfirmation(true);
                                        }}
                                        whileHover={{ y: -2 }}
                                    >
                                        {/* Room status indicators */}
                                        <div className="absolute top-3 right-3 flex gap-1.5">
                                            {/* Public/Private indicator */}
                                            <div 
                                                className={`p-2 ${room.isPublic !== false ? 'bg-green-500/10' : 'bg-amber-500/10'} rounded-full`} 
                                                title={room.isPublic !== false ? 'Public Room' : 'Private Room'}
                                            >
                                                {room.isPublic !== false ? (
                                                    <Globe size={14} className="text-green-500" />
                                                ) : (
                                                    <Lock size={14} className="text-amber-500" />
                                                )}
                                            </div>
                                            {room.featured && (
                                                <div className="p-2 bg-primary/10 rounded-full" title="Featured Room">
                                                    <Star size={14} className="text-primary" />
                                                </div>
                                            )}
                                            {room.popular && (
                                                <div className="p-2 bg-orange-500/10 rounded-full" title="Popular Room">
                                                    <Flame size={14} className="text-orange-500" />
                                                </div>
                                            )}
                                            <button
                                                className="p-2 bg-background/80 rounded-full hover:bg-background"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setRoomToJoin(room);
                                                    setShowRoomConfirmation(true);
                                                }}
                                            >
                                                <ArrowRight size={16} />
                                            </button>
                                        </div>

                                        <h3 className="text-lg font-medium mb-1 pr-16">{room.name}</h3>

                                        {room.description && (
                                            <p className="text-muted-foreground text-sm mb-3">{room.description}</p>
                                        )}

                                        {room.tags && room.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {room.tags.map(tag => (
                                                    <span
                                                        key={tag}
                                                        className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full flex items-center gap-1"
                                                    >
                                                        <Tag size={10} />
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="mt-auto pt-3 border-t border-border/30">
                                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1.5">
                                                    <Users size={16} />
                                                    <span>{room.participants} participants</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar size={16} />
                                                    <span>{room.lastActive}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-card/50 border border-border/50 rounded-xl p-8 text-center">
                                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                                <h3 className="text-lg font-medium mb-2">No rooms found</h3>
                                <p className="text-muted-foreground">
                                    {searchQuery ? 'Try a different search term or create a new room.' : 'Create a new room to get started.'}
                                </p>
                                <Button
                                    className="mt-4 gap-2"
                                    variant="outline"
                                    onClick={() => setCreateRoomModalOpen(true)}
                                >
                                    <Plus size={16} /> Create Room
                                </Button>
                            </div>
                        )}
                    </motion.div>
                </div>
            </main>

            {/* Join Room Modal */}
            <EnhancedOTPInput    
                isOpen={joinRoomModalOpen}
                onOpenChange={(open) => {
                    setJoinRoomModalOpen(open);
                    if (!open) {
                        setIsVerifyingCode(false);
                        setRoomIdInput('');
                        setRoomIdError('');
                    }
                }}
                title="Join a Room"
                description="Enter the 6-digit code to join this room"
                onSuccess={() => {
                    router.push(`/room/${roomIdInput.trim()}`);
                    setJoinRoomModalOpen(false);
                    setIsVerifyingCode(false);
                    setRoomIdInput('');
                }}
            />
            {/* Create Room Modal */}
            <Dialog open={createRoomModalOpen} onOpenChange={setCreateRoomModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create a Room</DialogTitle>
                        <DialogDescription>
                            Give your room a name and start a new conversation.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="room-name">Room Name</Label>
                            <Input
                                id="room-name"
                                placeholder="Enter room name"
                                value={roomNameInput}
                                onChange={(e) => {
                                    setRoomNameInput(e.target.value);
                                    setRoomNameError('');
                                }}
                                className={roomNameError ? 'border-destructive' : ''}
                                autoFocus
                            />
                            {roomNameError && (
                                <p className="text-xs text-destructive mt-1">{roomNameError}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="room-description">Description (optional)</Label>
                            <Input
                                id="room-description"
                                placeholder="Brief description of your room"
                                value={roomDescriptionInput}
                                onChange={(e) => setRoomDescriptionInput(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="room-tags">Tags (optional)</Label>
                            <Input
                                id="room-tags"
                                placeholder="Comma-separated tags (e.g., Design, Weekly, Team)"
                                value={roomTagsInput}
                                onChange={(e) => setRoomTagsInput(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">Separate tags with commas</p>
                        </div>
                        
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="room-public" className="flex items-center gap-2">
                                <div className="flex-shrink-0">
                                    {isRoomPublic ? (
                                        <Globe size={18} className="text-green-500" />
                                    ) : (
                                        <Lock size={18} className="text-amber-500" />
                                    )}
                                </div>
                                <div>
                                    <span>{isRoomPublic ? 'Public Room' : 'Private Room'}</span>
                                    <p className="text-xs text-muted-foreground">
                                        {isRoomPublic 
                                            ? 'Anyone can find and join this room' 
                                            : 'Only people with the room code can join'}
                                    </p>
                                </div>
                            </Label>
                            <Switch
                                id="room-public"
                                checked={isRoomPublic}
                                onCheckedChange={setIsRoomPublic}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                            onClick={() => {
                                handleCreateRoom();
                                if (!roomNameError) {
                                    setCreateRoomModalOpen(false);
                                }
                            }}
                            disabled={isCreatingRoom}
                        >
                            {isCreatingRoom ? 'Creating...' : 'Create Room'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Room Join Confirmation Dialog */}
            <AlertDialog 
                open={showRoomConfirmation} 
                onOpenChange={(open) => {
                    setShowRoomConfirmation(open);
                }}
            >
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader className="pb-2 border-b">
                        <AlertDialogTitle className="text-xl font-bold">Join Room Confirmation</AlertDialogTitle>
                    </AlertDialogHeader>
                    
                    {roomToJoin && (
                        <div className="py-4">
                            <h3 className="text-lg font-semibold mb-2">{roomToJoin.name}</h3>
                            {roomToJoin.description && (
                                <p className="text-muted-foreground mb-5">{roomToJoin.description}</p>
                            )}
                            
                            <div className="grid grid-cols-1 gap-4 mb-2">
                                {/* Room status and creator */}
                                <div className="flex items-center justify-between bg-card/50 p-3 rounded-lg border border-border/30">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-1.5 rounded-full ${roomToJoin.isPublic !== false ? 'bg-green-500/10' : 'bg-amber-500/10'}`}>
                                            {roomToJoin.isPublic !== false ? (
                                                <Globe size={16} className="text-green-500" />
                                            ) : (
                                                <Lock size={16} className="text-amber-500" />
                                            )}
                                        </div>
                                        <span className="font-medium">{roomToJoin.isPublic !== false ? 'Public Room' : 'Private Room'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">Created by:</span>
                                        <span className="text-sm font-medium">{roomToJoin.createdBy || 'Unknown'}</span>
                                        {roomToJoin.createdByYou && (
                                            <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">You</span>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Room details */}
                                <div className="grid grid-cols-2 gap-3">
                                    {/* Participants */}
                                    <div className="flex items-center gap-2 bg-card/50 p-3 rounded-lg border border-border/30">
                                        <div className="p-1.5 rounded-full bg-blue-500/10">
                                            <Users size={16} className="text-blue-500" />
                                        </div>
                                        <span>{roomToJoin.participants} participants</span>
                                    </div>
                                    
                                    {/* Last active */}
                                    <div className="flex items-center gap-2 bg-card/50 p-3 rounded-lg border border-border/30">
                                        <div className="p-1.5 rounded-full bg-purple-500/10">
                                            <Calendar size={16} className="text-purple-500" />
                                        </div>
                                        <span className="text-sm">{roomToJoin.lastActive}</span>
                                    </div>
                                    
                                    {/* Activity */}
                                    <div className="flex items-center gap-2 bg-card/50 p-3 rounded-lg border border-border/30">
                                        <div className="p-1.5 rounded-full bg-amber-500/10">
                                            <MessageSquare size={16} className="text-amber-500" />
                                        </div>
                                        <span className="text-sm">Active discussion</span>
                                    </div>
                                </div>
                                
                                {/* Tags */}
                                {roomToJoin.tags && roomToJoin.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-1 bg-card/50 p-3 rounded-lg border border-border/30">
                                        <div className="flex items-center gap-1 mr-2">
                                            <Tag size={14} className="text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">Tags:</span>
                                        </div>
                                        {roomToJoin.tags.map(tag => (
                                            <span
                                                key={tag}
                                                className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    
                    <AlertDialogFooter className="pt-2 border-t">
                        <AlertDialogCancel className="bg-muted hover:bg-muted/80">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            className="bg-primary hover:bg-primary/90"
                            onClick={() => {
                                if (roomToJoin) {
                                    router.push(`/room/${roomToJoin.id}`);
                                    setShowRoomConfirmation(false);
                                }
                            }}
                        >
                            Join Room
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
