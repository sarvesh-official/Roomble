'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { Search, Plus, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRoomApi } from '@/app/api/room';
import { toast } from 'sonner';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { RoomFilters } from '@/components/dashboard/RoomFilters';
import { RoomGrid } from '@/components/dashboard/RoomGrid';
import { JoinRoomModal } from '@/components/dashboard/JoinRoomModal';
import { CreateRoomModal } from '@/components/dashboard/CreateRoomModal';
import { useSocket } from '@/hooks/useSocket';
import { Room } from '@/types/room';


export default function DashboardPage() {
    const router = useRouter();
    const { user } = useUser();
    const { joinRoom, getJoinedRooms } = useRoomApi();
    const { socket } = useSocket(); 
    const [searchQuery, setSearchQuery] = useState('');
    const [joinRoomModalOpen, setJoinRoomModalOpen] = useState(false);
    const [createRoomModalOpen, setCreateRoomModalOpen] = useState(false);
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [visibilityTab, setVisibilityTab] = useState('public');
    const [mounted, setMounted] = useState(false);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [isCreatingRoom] = useState(false);
    const [isJoiningRoom, setIsJoiningRoom] = useState(false);
    
    // Debug socket connection
    useEffect(() => {
        console.log('Dashboard: Socket state:', socket ? 'connected' : 'not connected');
        
        if (socket) {
            // Test socket connection
            socket.on('connect', () => {
                console.log('Dashboard: Socket connected');
            });
            
            // Debug new-room events
            socket.on('new-room', (data) => {
                console.log('Dashboard: Received new-room event directly:', data);
            });
        }
        
        return () => {
            if (socket) {
                socket.off('new-room');
            }
        };
    }, [socket]);

    useEffect(() => {
        setMounted(true);
        
        // Fetch joined rooms when component mounts
        const fetchRooms = async () => {
            try {
                setIsLoading(true);
                const response = await getJoinedRooms();
                
                // Map API response to Room type
                const formattedRooms = response.rooms.map((room: Room) => ({
                    id: room.id,
                    name: room.name,
                    description: room.description,
                    participants: room.participants,
                    lastActive: room.lastActive,
                    isPublic: room.isPublic,
                    createdBy: room.createdBy,
                    createdByYou: room.createdByYou,
                    // Optional fields
                    tags: [],
                    featured: false,
                    popular: room.participants > 5
                }));
                
                setRooms(formattedRooms);
            } catch (error) {
                console.error('Failed to fetch rooms:', error);
                toast.error('Failed to load rooms');
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchRooms();
    }, [getJoinedRooms]);
    
    const formatLastActive = (date: Date): string => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.round(diffMs / 60000);
        const diffHours = Math.round(diffMs / 3600000);
        const diffDays = Math.round(diffMs / 86400000);
        
        if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    };
    

    useEffect(() => {
        setIsSearching(true);
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
            setIsSearching(false);
        }, 300);
        
        return () => clearTimeout(timer);
    }, [searchQuery]);

    if (!mounted) {
        return <div className="min-h-screen bg-background"></div>;
    }

    const filteredRooms = rooms.filter(room => {

        const matchesSearch = debouncedSearchQuery === '' || 
            room.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) || 
            (room.description && room.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase())) ||
            (room.tags && room.tags.some(tag => tag.toLowerCase().includes(debouncedSearchQuery.toLowerCase())));
        

            const matchesVisibility = 
            visibilityTab === 'public' ? room.isPublic !== false : 
            visibilityTab === 'private' ? room.isPublic === false : 
            true;
        
        const matchesCategory = 
            activeTab === 'all' ? true : 
            activeTab === 'featured' ? room.featured : 
            activeTab === 'popular' ? room.popular :
            activeTab === 'recent' ? true :
            activeTab === 'created-by-you' ? room.createdByYou :
            true;

        return matchesSearch && matchesVisibility && matchesCategory;
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };
    
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <DashboardHeader />

            {/* Main Content */}
            <motion.main 
                className="container mx-auto px-3 sm:px-4 py-4 sm:py-6"
                initial="hidden"
                animate="visible"
                variants={containerVariants}>
            
                <div className="max-w-6xl mx-auto">
                    {/* Page Title and Search */}
                    <motion.div 
                        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6"
                        variants={itemVariants}
                    >
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold mb-1">Dashboard</h1>
                            <p className="text-muted-foreground text-sm sm:text-base">Join existing rooms or create your own</p>
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
                    </motion.div>
                    
                    {/* Quick Actions */}
                    <motion.div 
                        className="flex flex-wrap justify-between sm:justify-end gap-2 sm:gap-3 mb-6 w-full"
                        variants={itemVariants}
                    >
                        <Button
                            className="gap-1.5 flex-1 sm:flex-initial"
                            variant="outline"
                            size="sm"
                            disabled={isJoiningRoom}
                            onClick={() => setJoinRoomModalOpen(true)}
                        >
                            <Users size={14} className="hidden sm:inline" /> 
                            <span>{isJoiningRoom ? 'Joining...' : 'Join Room'}</span>
                        </Button>
                        <Button
                            className="gap-1.5 flex-1 sm:flex-initial"
                            size="sm"
                            disabled={isCreatingRoom}
                            onClick={() => setCreateRoomModalOpen(true)}
                        >
                            <Plus size={14} className="hidden sm:inline" /> 
                            <span>{isCreatingRoom ? 'Creating...' : 'Create Room'}</span>
                        </Button>
                    </motion.div>

                    {/* Room Filters */}
                    <motion.div variants={itemVariants}>
                        <RoomFilters 
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            visibilityTab={visibilityTab}
                            setVisibilityTab={setVisibilityTab}
                        />
                    </motion.div>

                    {/* Rooms Grid */}
                    <motion.div variants={itemVariants}>
                        {!isLoading && isSearching && (
                            <div className="flex justify-center py-2 text-sm text-muted-foreground">
                                <span>Searching...</span>
                            </div>
                        )}
                        <RoomGrid 
                            rooms={filteredRooms}
                            searchQuery={debouncedSearchQuery}
                            isLoading={isLoading}
                            onJoinRoom={(room) => {

                                setIsJoiningRoom(true);
                                joinRoom({ roomCode: room.id })
                                    .then(() => {
                                        router.push(`/room/${room.id}`);
                                    })
                                    .catch((error) => {
                                        console.error('Failed to join room:', error);
                                        toast.error('Failed to join room. Please try again.');
                                    })
                                    .finally(() => {
                                        setIsJoiningRoom(false);
                                    });
                            }}
                            onCreateRoom={() => setCreateRoomModalOpen(true)}
                        />
                    </motion.div>
                </div>
            </motion.main>

            {/* Join Room Modal */}
            <JoinRoomModal
                isOpen={joinRoomModalOpen}
                onOpenChange={(open) => {
                    // Only allow closing if not in joining state
                    if (!isJoiningRoom) {
                        setJoinRoomModalOpen(open);
                    }
                }}
                onSuccess={(roomId) => {
                    setIsJoiningRoom(true);
                    // Keep modal open and in loading state
                    // Navigate directly to room
                    router.push(`/room/${roomId}`);
                    // Modal will be automatically unmounted during navigation
                }}
            />
            {/* Create Room Modal */}
            <CreateRoomModal
                isOpen={createRoomModalOpen}
                onOpenChange={setCreateRoomModalOpen}
            />

            {/* Join Room Modal is now used instead of RoomConfirmationDialog */}
        </div>
    );
}
