import { supabase } from "@/integrations/supabase/client";

export const seedDemoData = async () => {
  const demoTickets = [
    // Email tickets
    {
      subject: "Cannot reset my password",
      message: "I've tried using the 'Forgot Password' link multiple times, but I'm not receiving any reset emails. I've checked my spam folder as well. Please help!",
      channel: "email",
      type: "question",
      priority: "high",
      status: "open",
      department: "technical",
      tags: ["password", "login", "email"],
      customer_email: "alice.cooper@example.com",
      customer_name: "Alice Cooper",
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    },
    {
      subject: "Billing issue - double charge",
      message: "I noticed I was charged twice for my subscription this month. Can you please investigate and refund the duplicate charge?",
      channel: "email",
      type: "complaint",
      priority: "urgent",
      status: "assigned",
      department: "billing",
      tags: ["billing", "refund", "duplicate"],
      assigned_to: "Agent 1",
      customer_email: "bob.wilson@example.com",
      customer_name: "Bob Wilson",
      created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    },
    {
      subject: "Love your product!",
      message: "Just wanted to drop a note to say how much I appreciate your product. The recent updates have been fantastic, and customer support has been top-notch!",
      channel: "email",
      type: "praise",
      priority: "low",
      status: "resolved",
      department: "general",
      tags: ["feedback", "positive"],
      customer_email: "happy.customer@example.com",
      customer_name: "Happy Customer",
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      resolved_at: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    },
    
    // Chat tickets
    {
      subject: "How do I upgrade my plan?",
      message: "I'm currently on the Basic plan and would like to upgrade to Pro. What's the process, and will I be charged immediately?",
      channel: "chat",
      type: "question",
      priority: "medium",
      status: "in_progress",
      department: "sales",
      tags: ["upgrade", "pricing", "plan"],
      assigned_to: "Agent 2",
      customer_email: "curious.user@example.com",
      customer_name: "Curious User",
      created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    },
    {
      subject: "App keeps crashing",
      message: "The mobile app crashes every time I try to access the reports section. I'm using iOS 17 on iPhone 14. This is really frustrating!",
      channel: "chat",
      type: "bug_report",
      priority: "high",
      status: "assigned",
      department: "technical",
      tags: ["bug", "mobile", "crash", "ios"],
      assigned_to: "Agent 3",
      customer_email: "frustrated.dev@example.com",
      customer_name: "Frustrated Dev",
      created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    },
    
    // Instagram tickets
    {
      subject: "Feature suggestion",
      message: "Would be amazing if you could add batch export functionality. Having to export items one by one is time-consuming. Thanks!",
      channel: "instagram",
      type: "feature_request",
      priority: "low",
      status: "open",
      department: "general",
      tags: ["feature", "export", "enhancement"],
      customer_email: "power.user@example.com",
      customer_name: "Power User",
      created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    },
    {
      subject: "When is the new version coming?",
      message: "Saw your teaser about v2.0 on social media. Any ETA? Super excited about the new features!",
      channel: "instagram",
      type: "question",
      priority: "low",
      status: "open",
      department: "general",
      tags: ["product", "roadmap"],
      customer_email: "early.adopter@example.com",
      customer_name: "Early Adopter",
      created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    },
    
    // Twitter tickets
    {
      subject: "Integration not working",
      message: "The Slack integration keeps disconnecting. I've reconnected it three times today already. What's going on?",
      channel: "twitter",
      type: "complaint",
      priority: "high",
      status: "assigned",
      department: "technical",
      tags: ["integration", "slack", "connectivity"],
      assigned_to: "Agent 1",
      customer_email: "slack.user@example.com",
      customer_name: "Slack User",
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    },
    {
      subject: "API documentation unclear",
      message: "The API docs for the webhooks endpoint are confusing. Can you provide more examples? Specifically around authentication.",
      channel: "twitter",
      type: "question",
      priority: "medium",
      status: "open",
      department: "technical",
      tags: ["api", "documentation", "webhooks"],
      customer_email: "developer@example.com",
      customer_name: "Developer",
      created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    },
    
    // Facebook tickets
    {
      subject: "Security concern",
      message: "I received a suspicious email claiming to be from your company asking for my login details. Is this legitimate? I'm worried about my account security.",
      channel: "facebook",
      type: "question",
      priority: "urgent",
      status: "in_progress",
      department: "support",
      tags: ["security", "phishing", "account"],
      assigned_to: "Agent 2",
      customer_email: "worried.user@example.com",
      customer_name: "Worried User",
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    },
    
    // More varied tickets for better demo
    {
      subject: "Data export request",
      message: "Under GDPR, I'd like to request a full export of all my personal data you have stored.",
      channel: "email",
      type: "question",
      priority: "medium",
      status: "assigned",
      department: "support",
      tags: ["gdpr", "data", "privacy"],
      assigned_to: "Agent 3",
      customer_email: "privacy.conscious@example.com",
      customer_name: "Privacy Conscious",
      created_at: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    },
    {
      subject: "Awesome update!",
      message: "The new dashboard redesign is beautiful! Everything feels much more intuitive now. Great job team!",
      channel: "chat",
      type: "praise",
      priority: "low",
      status: "resolved",
      department: "general",
      tags: ["feedback", "ui", "positive"],
      customer_email: "design.lover@example.com",
      customer_name: "Design Lover",
      created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      resolved_at: new Date(Date.now() - 47 * 60 * 60 * 1000).toISOString(),
    },
  ];

  try {
    // Check if we already have demo data
    const { count } = await supabase
      .from('tickets')
      .select('*', { count: 'exact', head: true });

    if (count && count > 0) {
      console.log('Demo data already exists');
      return;
    }

    // Insert demo tickets with AI classification
    for (const ticket of demoTickets) {
      // Generate suggested reply based on type
      let suggestedReply = "";
      switch (ticket.type) {
        case "complaint":
          suggestedReply = "We sincerely apologize for the inconvenience. We're looking into this issue right away and will have an update for you shortly. Your satisfaction is our top priority.";
          break;
        case "question":
          suggestedReply = "Thank you for reaching out! I'd be happy to help you with this. Let me provide you with the information you need.";
          break;
        case "praise":
          suggestedReply = "Thank you so much for your kind words! We're thrilled to hear you're enjoying our product. Feedback like yours motivates us to keep improving.";
          break;
        case "feature_request":
          suggestedReply = "Thank you for this suggestion! We've logged your feature request and our product team will review it. We love hearing ideas from our users.";
          break;
        case "bug_report":
          suggestedReply = "Thank you for reporting this issue. Our technical team is investigating this bug and will work on a fix as soon as possible. We'll keep you updated on the progress.";
          break;
        default:
          suggestedReply = "Thank you for contacting us. We've received your message and will respond shortly with more information.";
      }

      const { error } = await supabase
        .from('tickets')
        .insert({
          ...ticket,
          suggested_reply: suggestedReply,
        });

      if (error) {
        console.error('Error inserting ticket:', error);
      }
    }

    console.log('Demo data seeded successfully');
  } catch (error) {
    console.error('Error seeding demo data:', error);
  }
};