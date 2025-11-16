import { useState } from "react";
import { X, Copy, Clock, User, Tag, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface Ticket {
  id: string;
  subject: string;
  message: string;
  channel: string;
  type: string | null;
  priority: string;
  status: string;
  department: string | null;
  tags: string[];
  suggested_reply: string | null;
  assigned_to: string | null;
  customer_name: string | null;
  customer_email: string;
  escalated: boolean;
  created_at: string;
  updated_at: string;
}

interface TicketDetailProps {
  ticket: Ticket;
  onClose: () => void;
  onUpdate: () => void;
}

const statusOptions = ['open', 'assigned', 'in_progress', 'resolved', 'closed'];
const assigneeOptions = ['Unassigned', 'Agent 1', 'Agent 2', 'Agent 3'];

export function TicketDetail({ ticket, onClose, onUpdate }: TicketDetailProps) {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRegeneratingTags, setIsRegeneratingTags] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const updates: any = { status: newStatus };
      if (newStatus === 'resolved') {
        updates.resolved_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('tickets')
        .update(updates)
        .eq('id', ticket.id);

      if (error) throw error;

      toast({
        title: "Status updated",
        description: `Ticket marked as ${newStatus.replace('_', ' ')}`,
      });
      onUpdate();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAssigneeChange = async (newAssignee: string) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ 
          assigned_to: newAssignee === 'Unassigned' ? null : newAssignee,
          status: newAssignee !== 'Unassigned' ? 'assigned' : 'open'
        })
        .eq('id', ticket.id);

      if (error) throw error;

      toast({
        title: "Assignee updated",
        description: `Ticket ${newAssignee === 'Unassigned' ? 'unassigned' : `assigned to ${newAssignee}`}`,
      });
      onUpdate();
    } catch (error) {
      console.error('Error updating assignee:', error);
      toast({
        title: "Error",
        description: "Failed to update assignee",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCopyReply = () => {
    if (ticket.suggested_reply) {
      navigator.clipboard.writeText(ticket.suggested_reply);
      toast({
        title: "Copied!",
        description: "Suggested reply copied to clipboard",
      });
    }
  };

  const handleRegenerateTags = async () => {
    setIsRegeneratingTags(true);
    try {
      const { data, error } = await supabase.functions.invoke('classify-ticket', {
        body: { text: `${ticket.subject}\n\n${ticket.message}` }
      });

      if (error) throw error;

      const { error: updateError } = await supabase
        .from('tickets')
        .update({
          type: data.type,
          priority: data.priority,
          department: data.department,
          tags: data.tags,
          suggested_reply: data.suggestedReply,
        })
        .eq('id', ticket.id);

      if (updateError) throw updateError;

      toast({
        title: "Tags regenerated",
        description: "AI classification updated successfully",
      });
      onUpdate();
    } catch (error) {
      console.error('Error regenerating tags:', error);
      toast({
        title: "Error",
        description: "Failed to regenerate tags",
        variant: "destructive",
      });
    } finally {
      setIsRegeneratingTags(false);
    }
  };

  const formattedDate = new Date(ticket.created_at).toLocaleString();

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col border">
        {/* Header */}
        <div className="p-6 border-b bg-muted/30">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{ticket.subject}</h2>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={cn(
                  ticket.priority === 'urgent' && "bg-priority-urgent text-white",
                  ticket.priority === 'high' && "bg-priority-high text-white",
                  ticket.priority === 'medium' && "bg-priority-medium text-white",
                  ticket.priority === 'low' && "bg-priority-low text-white"
                )}>
                  {ticket.priority}
                </Badge>
                <Badge variant="outline">{ticket.channel}</Badge>
                {ticket.type && <Badge variant="secondary">{ticket.type.replace('_', ' ')}</Badge>}
                {ticket.escalated && (
                  <Badge variant="destructive">Escalated</Badge>
                )}
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Customer Info */}
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <User className="h-4 w-4" />
              Customer Information
            </h3>
            <div className="text-sm space-y-1">
              <p><span className="text-muted-foreground">Name:</span> {ticket.customer_name || 'N/A'}</p>
              <p><span className="text-muted-foreground">Email:</span> {ticket.customer_email}</p>
              <p className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                <span className="text-muted-foreground">{formattedDate}</span>
              </p>
            </div>
          </div>

          <Separator />

          {/* Message */}
          <div>
            <h3 className="font-semibold mb-2">Message</h3>
            <p className="text-sm whitespace-pre-wrap">{ticket.message}</p>
          </div>

          <Separator />

          {/* AI-Generated Content Card */}
          {(ticket.tags && ticket.tags.length > 0) || ticket.suggested_reply ? (
            <>
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">AI Analysis</h3>
                </div>
                
                {/* AI Tags */}
                {ticket.tags && ticket.tags.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium flex items-center gap-2 text-sm">
                        <Tag className="h-4 w-4" />
                        Tags & Classification
                      </h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRegenerateTags}
                        disabled={isRegeneratingTags}
                        className="h-8"
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        Regenerate
                      </Button>
                    </div>
                    <div className="flex gap-2 flex-wrap mb-2">
                      {ticket.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="rounded-full">{tag}</Badge>
                      ))}
                    </div>
                    {ticket.department && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Department:</span> {ticket.department}
                      </p>
                    )}
                  </div>
                )}

                {ticket.tags && ticket.tags.length > 0 && ticket.suggested_reply && (
                  <Separator className="my-4" />
                )}

                {/* Suggested Reply */}
                {ticket.suggested_reply && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-sm">Suggested Reply</h4>
                      <Button variant="outline" size="sm" onClick={handleCopyReply} className="h-8">
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <div className="bg-background/80 border p-4 rounded-lg text-sm leading-relaxed">
                      {ticket.suggested_reply}
                    </div>
                  </div>
                )}
              </div>
              <Separator />
            </>
          ) : null}

          {/* Actions */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <div className="flex gap-2 flex-wrap">
                {statusOptions.map((status) => (
                  <Button
                    key={status}
                    variant={ticket.status === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStatusChange(status)}
                    disabled={isUpdating}
                  >
                    {status.replace('_', ' ')}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Assign To</label>
              <Select
                value={ticket.assigned_to || 'Unassigned'}
                onValueChange={handleAssigneeChange}
                disabled={isUpdating}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {assigneeOptions.map((assignee) => (
                    <SelectItem key={assignee} value={assignee}>
                      {assignee}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}