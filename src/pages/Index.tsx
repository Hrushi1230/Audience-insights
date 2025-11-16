import { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TicketCard } from "@/components/TicketCard";
import { TicketFilters } from "@/components/TicketFilters";
import { TicketDetail } from "@/components/TicketDetail";
import { NavBar } from "@/components/NavBar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  resolved_at: string | null;
}

type SortOption = 'created_at' | 'priority';

const Index = () => {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>('created_at');
  const [loading, setLoading] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [statusTab, setStatusTab] = useState<string>("all");
  const [filters, setFilters] = useState({
    channels: [] as string[],
    types: [] as string[],
    priorities: [] as string[],
    statuses: [] as string[],
  });

  useEffect(() => {
    fetchTickets();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('tickets-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tickets' },
        () => {
          fetchTickets();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tickets, searchQuery, filters, sortBy, statusTab]);

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tickets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...tickets];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (ticket) =>
          ticket.subject.toLowerCase().includes(query) ||
          ticket.message.toLowerCase().includes(query) ||
          ticket.customer_email.toLowerCase().includes(query) ||
          (ticket.customer_name && ticket.customer_name.toLowerCase().includes(query))
      );
    }

    // Channel filter
    if (filters.channels.length > 0) {
      filtered = filtered.filter((ticket) => filters.channels.includes(ticket.channel));
    }

    // Type filter
    if (filters.types.length > 0) {
      filtered = filtered.filter((ticket) => ticket.type && filters.types.includes(ticket.type));
    }

    // Priority filter
    if (filters.priorities.length > 0) {
      filtered = filtered.filter((ticket) => filters.priorities.includes(ticket.priority));
    }

    // Status filter from sidebar
    if (filters.statuses.length > 0) {
      filtered = filtered.filter((ticket) => filters.statuses.includes(ticket.status));
    }

    // Status filter from tabs
    if (statusTab !== "all") {
      filtered = filtered.filter((ticket) => ticket.status === statusTab);
    }

    // Sort
    if (sortBy === 'priority') {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      filtered.sort((a, b) => {
        return (
          priorityOrder[a.priority as keyof typeof priorityOrder] -
          priorityOrder[b.priority as keyof typeof priorityOrder]
        );
      });
    } else {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    setFilteredTickets(filtered);
  };

  const handleFilterChange = (category: string, value: string) => {
    setFilters((prev) => {
      const current = prev[category as keyof typeof prev];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  const handleSimulateTicket = async () => {
    setIsSimulating(true);
    try {
      // Demo ticket templates
      const demoTickets = [
        {
          subject: "Unable to access my account",
          message: "I've been trying to log into my account for the past hour but keep getting an error message. This is urgent as I need to complete a transaction.",
          channel: "email",
          customer_email: "john.doe@example.com",
          customer_name: "John Doe"
        },
        {
          subject: "Great experience!",
          message: "Just wanted to say thank you for the excellent customer service. Your team resolved my issue quickly and professionally.",
          channel: "chat",
          customer_email: "sarah.smith@example.com",
          customer_name: "Sarah Smith"
        },
        {
          subject: "Billing question",
          message: "I noticed an unexpected charge on my latest invoice. Can you help me understand what this is for?",
          channel: "email",
          customer_email: "mike.johnson@example.com",
          customer_name: "Mike Johnson"
        },
        {
          subject: "Feature request",
          message: "Would love to see dark mode support in the app. Many users have been asking for this.",
          channel: "twitter",
          customer_email: "tech.enthusiast@example.com",
          customer_name: "Tech Enthusiast"
        },
        {
          subject: "App crashes on startup",
          message: "The app crashes immediately when I try to open it on iOS 18. I've tried reinstalling but the problem persists.",
          channel: "instagram",
          customer_email: "app.user@example.com",
          customer_name: "App User"
        }
      ];

      const randomTicket = demoTickets[Math.floor(Math.random() * demoTickets.length)];

      // First, classify the ticket with AI
      const { data: classification, error: aiError } = await supabase.functions.invoke('classify-ticket', {
        body: { text: `${randomTicket.subject}\n\n${randomTicket.message}` }
      });

      if (aiError) {
        console.error('AI classification error:', aiError);
        // Continue without AI classification
      }

      // Insert the ticket
      const { data: newTicket, error: insertError } = await supabase
        .from('tickets')
        .insert({
          ...randomTicket,
          type: classification?.type || 'question',
          priority: classification?.priority || 'medium',
          department: classification?.department || 'general',
          tags: classification?.tags || [],
          suggested_reply: classification?.suggestedReply || null,
          status: 'open',
        })
        .select()
        .single();

      if (insertError) throw insertError;

      toast({
        title: "Ticket simulated!",
        description: `New ${randomTicket.channel} ticket created`,
      });

      // Refresh tickets
      fetchTickets();
    } catch (error) {
      console.error('Error simulating ticket:', error);
      toast({
        title: "Error",
        description: "Failed to simulate ticket",
        variant: "destructive",
      });
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <div className="bg-card border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              onClick={handleSimulateTicket}
              disabled={isSimulating}
              className="ml-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Simulate Ticket
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <TicketFilters filters={filters} onFilterChange={handleFilterChange} />
            
            <div className="mt-4">
              <label className="text-sm font-medium mb-2 block">Sort By</label>
              <div className="space-y-2">
                <Button
                  variant={sortBy === 'created_at' ? 'default' : 'outline'}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setSortBy('created_at')}
                >
                  Latest First
                </Button>
                <Button
                  variant={sortBy === 'priority' ? 'default' : 'outline'}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setSortBy('priority')}
                >
                  By Priority
                </Button>
              </div>
            </div>
          </aside>

          {/* Tickets List */}
          <main className="flex-1">
            {/* Status Tabs */}
            <Tabs value={statusTab} onValueChange={setStatusTab} className="mb-6">
              <TabsList className="grid w-full grid-cols-5 max-w-2xl">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="open">Open</TabsTrigger>
                <TabsTrigger value="assigned">Assigned</TabsTrigger>
                <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {filteredTickets.length} {filteredTickets.length === 1 ? 'ticket' : 'tickets'}
              </h2>
            </div>

            {loading ? (
              <p className="text-muted-foreground">Loading tickets...</p>
            ) : filteredTickets.length === 0 ? (
              <div className="text-center py-20 bg-card rounded-xl border-2 border-dashed">
                <div className="max-w-md mx-auto">
                  <p className="text-xl font-semibold text-muted-foreground mb-2">No tickets found</p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Try adjusting filters or click "Simulate Ticket" to generate a new one.
                  </p>
                  <Button onClick={handleSimulateTicket} disabled={isSimulating} size="lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Simulate Ticket
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    onClick={() => setSelectedTicket(ticket)}
                    isSelected={selectedTicket?.id === ticket.id}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <TicketDetail
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onUpdate={() => {
            fetchTickets();
            // Refresh the selected ticket
            const updated = tickets.find(t => t.id === selectedTicket.id);
            if (updated) setSelectedTicket(updated);
          }}
        />
      )}
    </div>
  );
};

export default Index;