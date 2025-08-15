export interface FuelConsumptionData {
  value: number;
  label: string;
  month: string;
}

export interface CostBreakdownData {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

export interface RecentDeliveryData {
  id: string;
  plate: string;
  location: string;
  timestamp: string;
  volume: string;
  status: "Completed" | "In Progress" | "Pending" | "Failed";
  driver?: string;
  cost?: number;
}

export interface UpcomingScheduleData {
  id: string;
  title: string;
  location: string;
  scheduledTime: string;
  volume: string;
  type: "Generator" | "Fleet Refuel" | "Emergency" | "Maintenance";
  priority: "High" | "Medium" | "Low";
}

// Mock data for multiple years
const fuelDataByYear: Record<number, FuelConsumptionData[]> = {
  2023: [
    { value: 150, label: "Jan", month: "January 2023" },
    { value: 180, label: "Feb", month: "February 2023" },
    { value: 200, label: "Mar", month: "March 2023" },
    { value: 220, label: "Apr", month: "April 2023" },
    { value: 250, label: "May", month: "May 2023" },
    { value: 210, label: "Jun", month: "June 2023" },
    { value: 190, label: "Jul", month: "July 2023" },
    { value: 240, label: "Aug", month: "August 2023" },
    { value: 230, label: "Sep", month: "September 2023" },
    { value: 220, label: "Oct", month: "October 2023" },
    { value: 240, label: "Nov", month: "November 2023" },
    { value: 260, label: "Dec", month: "December 2023" },
  ],
  2024: [
    { value: 170, label: "Jan", month: "January 2024" },
    { value: 190, label: "Feb", month: "February 2024" },
    { value: 220, label: "Mar", month: "March 2024" },
    { value: 250, label: "Apr", month: "April 2024" },
    { value: 280, label: "May", month: "May 2024" },
    { value: 230, label: "Jun", month: "June 2024" },
    { value: 200, label: "Jul", month: "July 2024" },
    { value: 270, label: "Aug", month: "August 2024" },
    { value: 250, label: "Sep", month: "September 2024" },
    { value: 240, label: "Oct", month: "October 2024" },
    { value: 255, label: "Nov", month: "November 2024" },
    { value: 275, label: "Dec", month: "December 2024" },
  ],
  2025: [
    { value: 180, label: "Jan", month: "January 2025" },
    { value: 210, label: "Feb", month: "February 2025" },
    { value: 230, label: "Mar", month: "March 2025" },
    { value: 260, label: "Apr", month: "April 2025" },
    { value: 310, label: "May", month: "May 2025" },
    { value: 240, label: "Jun", month: "June 2025" },
    { value: 214, label: "Jul", month: "July 2025" },
    { value: 300, label: "Aug", month: "August 2025" },
    { value: 280, label: "Sep", month: "September 2025" },
    { value: 260, label: "Oct", month: "October 2025" },
    { value: 270, label: "Nov", month: "November 2025" },
    { value: 290, label: "Dec", month: "December 2025" },
  ],
};

// Cost breakdown data
export const costBreakdownData: CostBreakdownData[] = [
  { label: "Fuel Cost", value: 280000, percentage: 35, color: "#FF8500" },
  {
    label: "Emergency Deliveries",
    value: 240000,
    percentage: 30,
    color: "#F59E0B",
  },
  {
    label: "Maintenance Cost",
    value: 200000,
    percentage: 25,
    color: "#FDBA74",
  },
  { label: "Service Charges", value: 80000, percentage: 10, color: "#FFE6C7" },
];

// Recent deliveries mock data
export const recentDeliveries: RecentDeliveryData[] = [
  {
    id: "del_001",
    plate: "LND-451-AA",
    location: "Lekki Office",
    timestamp: "2 hours ago",
    volume: "45L",
    status: "Completed",
    driver: "John Doe",
    cost: 22500,
  },
  {
    id: "del_002",
    plate: "ABC-123-XY",
    location: "Victoria Island Branch",
    timestamp: "4 hours ago",
    volume: "60L",
    status: "Completed",
    driver: "Jane Smith",
    cost: 30000,
  },
];

// Upcoming schedules mock data
export const upcomingSchedules: UpcomingScheduleData[] = [
  {
    id: "sch_001",
    title: "Generator Refuel",
    location: "Head Office",
    scheduledTime: "Tomorrow 10:00 AM",
    volume: "200L",
    type: "Generator",
    priority: "High",
  },
  {
    id: "sch_002",
    title: "Fleet Refuel",
    location: "Lekki Depot",
    scheduledTime: "Friday 2:00 PM",
    volume: "500L",
    type: "Fleet Refuel",
    priority: "Medium",
  },
  {
    id: "sch_003",
    title: "Generator Backup",
    location: "VI Branch",
    scheduledTime: "Monday 9:00 AM",
    volume: "150L",
    type: "Generator",
    priority: "Medium",
  },
];

// Utility function to get fuel chart data for a specific year
export const getFuelChartData = (year: number = 2025) => {
  const yearData = fuelDataByYear[year] || fuelDataByYear[2025];
  return {
    data: yearData.map((item) => item.value),
    labels: yearData.map((item) => item.label),
  };
};

// Get available years
export const getAvailableYears = () =>
  Object.keys(fuelDataByYear).map(Number).sort();

// Utility function for cost breakdown chart data
export const getCostBreakdownChartData = () => ({
  legend: costBreakdownData.map((item) => ({
    label: item.label,
    color: item.color,
  })),
  slices: costBreakdownData.map((item) => item.percentage),
  colors: costBreakdownData.map((item) => item.color),
});

// Additional utility functions
export const getTotalFuelConsumption = (year: number = 2025) => {
  const yearData = fuelDataByYear[year] || fuelDataByYear[2025];
  return yearData.reduce((sum, item) => sum + item.value, 0);
};

export const getTotalCost = () =>
  costBreakdownData.reduce((sum, item) => sum + item.value, 0);

export const getRecentDeliveriesForTable = () =>
  recentDeliveries.map((delivery) => ({
    plate: delivery.plate,
    where: delivery.location,
    when: delivery.timestamp,
    volume: delivery.volume,
    status: delivery.status,
  }));

export const getUpcomingSchedulesForTable = () =>
  upcomingSchedules.map((schedule) => ({
    title: schedule.title,
    where: schedule.location,
    when: schedule.scheduledTime,
    vol: schedule.volume,
  }));

// Monthly fuel consumption data (keeping for backward compatibility)
export const monthlyFuelConsumption: FuelConsumptionData[] =
  fuelDataByYear[2025];

// Helper function to get fuel data for a specific month and year
export const getFuelDataForMonth = (month: number, year: number = 2025) => {
  const yearData = fuelDataByYear[year] || fuelDataByYear[2025];
  return yearData[month - 1] || null;
};

// Helper function to get year-over-year comparison
export const getYearOverYearComparison = (month: number) => {
  const years = getAvailableYears();
  return years.map((year) => ({
    year,
    value: getFuelDataForMonth(month, year)?.value || 0,
  }));
};

// Helper function to get average consumption for a year
export const getAverageConsumption = (year: number = 2025) => {
  const total = getTotalFuelConsumption(year);
  const yearData = fuelDataByYear[year] || fuelDataByYear[2025];
  return Math.round(total / yearData.length);
};
