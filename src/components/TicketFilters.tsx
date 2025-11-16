import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

interface TicketFiltersProps {
  filters: {
    channels: string[];
    types: string[];
    priorities: string[];
    statuses: string[];
  };
  onFilterChange: (category: string, value: string) => void;
}

const filterOptions = {
  channels: [
    { value: 'email', label: 'Email' },
    { value: 'chat', label: 'Chat' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'facebook', label: 'Facebook' },
  ],
  types: [
    { value: 'complaint', label: 'Complaint' },
    { value: 'question', label: 'Question' },
    { value: 'praise', label: 'Praise' },
    { value: 'feature_request', label: 'Feature Request' },
    { value: 'bug_report', label: 'Bug Report' },
    { value: 'other', label: 'Other' },
  ],
  priorities: [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ],
  statuses: [
    { value: 'open', label: 'Open' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
  ],
};

export function TicketFilters({ filters, onFilterChange }: TicketFiltersProps) {
  return (
    <Card className="p-4 space-y-4">
      <div>
        <h3 className="font-semibold mb-3">Filters</h3>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium mb-2 block">Channel</Label>
          <div className="space-y-2">
            {filterOptions.channels.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`channel-${option.value}`}
                  checked={filters.channels.includes(option.value)}
                  onCheckedChange={() => onFilterChange('channels', option.value)}
                />
                <label
                  htmlFor={`channel-${option.value}`}
                  className="text-sm cursor-pointer"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <Label className="text-sm font-medium mb-2 block">Type</Label>
          <div className="space-y-2">
            {filterOptions.types.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${option.value}`}
                  checked={filters.types.includes(option.value)}
                  onCheckedChange={() => onFilterChange('types', option.value)}
                />
                <label
                  htmlFor={`type-${option.value}`}
                  className="text-sm cursor-pointer"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <Label className="text-sm font-medium mb-2 block">Priority</Label>
          <div className="space-y-2">
            {filterOptions.priorities.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`priority-${option.value}`}
                  checked={filters.priorities.includes(option.value)}
                  onCheckedChange={() => onFilterChange('priorities', option.value)}
                />
                <label
                  htmlFor={`priority-${option.value}`}
                  className="text-sm cursor-pointer"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <Label className="text-sm font-medium mb-2 block">Status</Label>
          <div className="space-y-2">
            {filterOptions.statuses.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${option.value}`}
                  checked={filters.statuses.includes(option.value)}
                  onCheckedChange={() => onFilterChange('statuses', option.value)}
                />
                <label
                  htmlFor={`status-${option.value}`}
                  className="text-sm cursor-pointer"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}