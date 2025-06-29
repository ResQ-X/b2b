export const SIDEBAR_ITEMS = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
  },
  {
    title: "Manage Orders",
    href: "/dashboard/orders",
    icon: "ClipboardList",
  },
  {
    title: "Manage Services",
    href: "/dashboard/services",
    icon: "LayoutDashboard",
  },
  // {
  //   title: "Live Operations",
  //   href: "/dashboard/operations",
  //   icon: "Activity",
  // },
  {
    title: "Manage Staff",
    href: "/dashboard/staff",
    icon: "Users",
  },
  {
    title: "Manage Partners",
    href: "/dashboard/partners",
    icon: "Building",
  },
] as const;

export const MOCK_INCIDENTS = [
  {
    id: "INC-00123",
    location: "12 Awolowo Way, Ikeja",
    dateTime: "12.01.2025 - 12:53 PM",
    priority: "High",
    responderId: "FR-045",
    status: "In Progress",
  },
  {
    id: "INC-00456",
    location: "5 Admiralty Road, Lekki",
    dateTime: "12.01.2025 - 12:53 PM",
    priority: "Medium",
    responderId: "FR-112",
    status: "Canceled",
  },
  {
    id: "INC-00789",
    location: "21 Herbert Mac Street, Yaba",
    dateTime: "12.01.2025 - 12:53 PM",
    priority: "Low",
    responderId: "FR-078",
    status: "Resolved",
  },
  {
    id: "INC-00456",
    location: "5 Admiralty Road, Lekki",
    dateTime: "12.01.2025 - 12:53 PM",
    priority: "Medium",
    responderId: "FR-112",
    status: "Unassigned",
  },
] as const;

export const MOCK_STATS = [
  {
    title: "Active Orders",
    value: "325",
    change: {
      value: "8.5%",
      timeframe: "from yesterday",
      trend: "up",
    },
    icon: "Package",
  },
  {
    title: "Available Responders",
    value: "120",
    change: {
      value: "1.3%",
      timeframe: "from past week",
      trend: "up",
    },
    icon: "Users",
  },
  {
    title: "Avg Response Time",
    value: "6 Min",
    change: {
      value: "4.3%",
      timeframe: "from yesterday",
      trend: "up",
    },
    icon: "Clock",
  },
  {
    title: "Customer Satisfaction",
    value: "4.5",
    change: {
      value: "1.8%",
      timeframe: "from yesterday",
      trend: "up",
    },
    icon: "Star",
  },
] as const;

export const MOCK_REVENUE_DATA = [
  { date: "Mon", value: 1200000 },
  { date: "Tue", value: 1800000 },
  { date: "Wed", value: 1400000 },
  { date: "Thu", value: 2000000 },
  { date: "Fri", value: 1600000 },
  { date: "Sat", value: 2200000 },
  { date: "Sun", value: 1900000 },
];
