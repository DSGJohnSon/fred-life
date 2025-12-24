import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface WorkspaceAvatarProps {
  name: string;
  className?: string;
}

export const WorkspaceAvatar = ({ name, className }: WorkspaceAvatarProps) => {
  return (
    <Avatar
      className={cn("size-6 relative rounded-full overflow-hidden", className)}
    >
      <AvatarFallback className="text-white bg-stone-500 font-semibold text-xs">
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

export const WorkspaceAvatarHelloPage = ({ name, className }: WorkspaceAvatarProps) => {
  return (
    <Avatar
      className={cn("size-24 relative rounded-lg overflow-hidden", className)}
    >
      <AvatarFallback className="text-white bg-stone-500 hover:bg-stone-500/75 cursor-pointer font-semibold text-xl rounded-none">
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};
