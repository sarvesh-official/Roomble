'use client';
import { AvatarStack } from '@/components/ui/avatar-stack';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Glimpse,
  GlimpseContent,
  GlimpseDescription,
  GlimpseTitle,
  GlimpseTrigger,
} from '@/components/ui/glimpse';
import Image from 'next/image';

const AvatarStackExample = () => (
  <AvatarStack animate>
    <Glimpse closeDelay={0} openDelay={0}>
      <GlimpseTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src="/profilepic.png" className='h-12 w-12' />
          <AvatarFallback>Sarvesh</AvatarFallback>
        </Avatar>
      </GlimpseTrigger>
      <GlimpseContent className="w-80 bg-card border shadow-lg p-4">
        <div className="flex gap-4 items-start">
          <div className="w-16 h-16 rounded-full overflow-hidden">
            <Image src="/profilepic.png" alt="Sarvesh" width={64} height={64}/>
          </div>
          <div>
            <GlimpseTitle className="font-semibold text-lg">Sarvesh</GlimpseTitle>
            <GlimpseDescription className="text-sm text-muted-foreground">
              SDE Intern at Lowe&apos;s
            </GlimpseDescription>
            <div className="mt-2 flex gap-2">
              <a 
                href="https://github.com/sarvesh-official" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full hover:bg-primary/20 transition-colors"
              >
                GitHub
              </a>
              <span className="text-xs bg-muted px-2 py-1 rounded-full">
                @sarvesh-official
              </span>
            </div>
          </div>
        </div>
      </GlimpseContent>
    </Glimpse>
  </AvatarStack>
);

export default AvatarStackExample;
