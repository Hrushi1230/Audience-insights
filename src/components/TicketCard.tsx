import { Mail, MessageSquare, Instagram, Twitter, Facebook } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Ticket {
  id: string;
  subject: string;
  message: string;
  channel: string;
  type: string | null;
  priority: string;
  status: string;
  customer_name: string | null;
  customer_email: string;
  created_at: string;
  tags: string[];
  escalated: boolean;
}

interface TicketCardProps {
  ticket: Ticket;
  onClick: () => void;
  isSelected?: boolean;
}

const channelIcons = {
  email: Mail,
  chat: MessageSquare,
  instagram: Instagram,
  twitter: Twitter,
  facebook: Facebook,
};

const channelEmojis = {
  email: "📧",
  chat: "💬",
  instagram: "📸",
  twitter: "🐦",
  facebook: "📘",
};

const priorityColors = {
  low: "bg-[#22c55e] text-white",
  medium: "bg-[#f97316] text-white",
  high: "bg-[#ef4444] text-white",
  urgent: "bg-[#ef4444] text-white",
};

const statusColors = {
  open: "bg-status-open text-white",
  assigned: "bg-status-assigned text-white",
  in_progress: "bg-status-in-progress text-white",
  resolved: "bg-status-resolved text-white",
  closed: "bg-status-closed text-white",
};

export function TicketCard({ ticket, onClick, isSelected }: TicketCardProps) {
  const ChannelIcon = channelIcons[ticket.channel as keyof typeof channelIcons] || Mail;
  const channelEmoji = channelEmojis[ticket.channel as keyof typeof channelEmojis] || "📧";
  const timeAgo = getTimeAgo(ticket.created_at);

  return (
    <Card
      className={cn(
        "p-5 cursor-pointer hover:shadow-lg hover:scale-[1.01] transition-all duration-200 border-l-4 rounded-xl",
        isSelected && "ring-2 ring-primary shadow-lg",
        ticket.escalated && "border-l-destructive",
        !ticket.escalated && "border-l-primary"
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-10 h-10 text-2xl">
          {channelEmoji}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-foreground truncate">
              {ticket.subject}
            </h3>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {timeAgo}
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {ticket.message}
          </p>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-muted-foreground">
              {ticket.customer_name || ticket.customer_email}
            </span>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={cn("text-xs rounded-full px-3 py-1", priorityColors[ticket.priority as keyof typeof priorityColors])}>
              {ticket.priority}
            </Badge>
            <Badge className={cn("text-xs rounded-full px-3 py-1", statusColors[ticket.status as keyof typeof statusColors])}>
              {ticket.status.replace('_', ' ')}
            </Badge>
            {ticket.type && (
              <Badge variant="outline" className="text-xs rounded-full px-3 py-1">
                {ticket.type.replace('_', ' ')}
              </Badge>
            )}
            {ticket.escalated && (
              <Badge variant="destructive" className="text-xs rounded-full px-3 py-1">
                ⚠️ Escalated
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}