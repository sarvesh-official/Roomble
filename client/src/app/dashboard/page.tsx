'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { Search, Plus, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { RoomFilters } from '@/components/dashboard/RoomFilters';
import { RoomGrid } from '@/components/dashboard/RoomGrid';
import { JoinRoomModal } from '@/components/dashboard/JoinRoomModal';
import { CreateRoomModal } from '@/components/dashboard/CreateRoomModal';
import { RoomConfirmationDialog } from '@/components/dashboard/RoomConfirmationDialog';
import { Room } from '@/types/room';


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
    const [joinRoomModalOpen, setJoinRoomModalOpen] = useState(false);
    const [createRoomModalOpen, setCreateRoomModalOpen] = useState(false);
    const [showRoomConfirmation, setShowRoomConfirmation] = useState(false);
    const [roomToJoin, setRoomToJoin] = useState<Room | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [visibilityTab, setVisibilityTab] = useState('public');
    const [mounted, setMounted] = useState(false);
    const [rooms] = useState<Room[]>(mockRooms);
    const [isSearching, setIsSearching] = useState(false);
    const [isJoiningRoom, setIsJoiningRoom] = useState(false);
    const [isCreatingRoom, setIsCreatingRoom] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    

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
                        {isSearching && (
                            <div className="flex justify-center py-2 text-sm text-muted-foreground">
                                <span>Searching...</span>
                            </div>
                        )}
                        <RoomGrid 
                            rooms={filteredRooms}
                            searchQuery={debouncedSearchQuery}
                            onJoinRoom={(room) => {
                                setRoomToJoin(room);
                                setShowRoomConfirmation(true);
                            }}
                            onCreateRoom={() => setCreateRoomModalOpen(true)}
                        />
                    </motion.div>
                </div>
            </motion.main>

            {/* Join Room Modal */}
            <JoinRoomModal
                isOpen={joinRoomModalOpen}
                onOpenChange={setJoinRoomModalOpen}
                onSuccess={(roomId) => {
                    setIsJoiningRoom(true);
                    // Simulate API call delay
                    setTimeout(() => {
                        router.push(`/room/${roomId}`);
                        setIsJoiningRoom(false);
                    }, 800);
                }}
            />
            {/* Create Room Modal */}
            <CreateRoomModal
                isOpen={createRoomModalOpen}
                onOpenChange={setCreateRoomModalOpen}
            />

            {/* Room Join Confirmation Dialog */}
            <RoomConfirmationDialog
                isOpen={showRoomConfirmation}
                onOpenChange={setShowRoomConfirmation}
                room={roomToJoin}
                onJoinRoom={(roomId) => {
                    setIsJoiningRoom(true);
                    // Simulate API call delay
                    setTimeout(() => {
                        router.push(`/room/${roomId}`);
                        setIsJoiningRoom(false);
                    }, 800);
                }}
            />
        </div>
    );
}
