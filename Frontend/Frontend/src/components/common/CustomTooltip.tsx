import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip";
  
  interface CustomTooltipProps {
    children: React.ReactNode; // The trigger component (button, icon, etc.)
    message: string; // The tooltip message
  }
  
  const CustomTooltip: React.FC<CustomTooltipProps> = ({ children, message }) => {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>{children}</TooltipTrigger>
          <TooltipContent className="bg-white text-black">
            <p>{message}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };
  
  export default CustomTooltip;
  