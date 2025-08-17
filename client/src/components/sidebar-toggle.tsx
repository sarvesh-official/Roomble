import { useSidebar } from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { Button } from './ui/button';
import { PanelLeft } from 'lucide-react';

export function SidebarToggle() {
  const { toggleSidebar } = useSidebar();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={toggleSidebar}
          variant="outline"
          className="md:px-2 md:h-fit relative z-30"
        >
          <PanelLeft size={16} />
        </Button>
      </TooltipTrigger>
      <TooltipContent align="start" className="z-50">Toggle Sidebar</TooltipContent>
    </Tooltip>
  );
}
