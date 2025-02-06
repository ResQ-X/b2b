export interface StatCard {
  title: string;
  value: number;
  change: {
    value: string;
    timeframe: string;
  };
  icon: string;
}
  
  export interface Incident {
    id: string
    location: string
    dateTime: string
    priority: "High" | "Medium" | "Low"
    responderId: string
    status: "In Progress" | "Canceled" | "Resolved" | "Unassigned"
  }
  
  export interface RevenueData {
    date: string
    value: number
  }
  
  export type NavItem = {
    title: string
    href: string
    icon: string
  }
  
  export interface IncidentDetails {
    id: string
    status: "In Progress" | "Canceled" | "Resolved" | "Unassigned"
    customer: {
      name: string
      contact: string
      email: string
    }
    location: {
      pickup: string
      dropoff: string
      coordinates: {
        lat: number
        lng: number
      }
    }
    responder: {
      id: string
      name: string
      role: string
      status: string
      eta: string
      currentLocation: string
    }
    activities: {
      time: string
      activity: string
      note: string
    }[]
  }
  
  