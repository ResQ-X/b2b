import React, { useState } from "react";

export const Tabs: React.FC<{
  defaultValue: string;
  className: string;
  children: React.ReactNode;
}> = ({ defaultValue, className, children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div className={className}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { activeTab, setActiveTab } as any);
        }
        return child;
      })}
    </div>
  );
};

export const TabsList: React.FC<{
  className: string;
  children: React.ReactNode;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}> = ({ className, children, activeTab, setActiveTab }) => (
  <div className={className}>
    {React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, { activeTab, setActiveTab } as any);
      }
      return child;
    })}
  </div>
);

export const TabsTrigger: React.FC<{
  value: string;
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}> = ({ value, children, activeTab, setActiveTab }) => (
  <button
    className={`px-4 py-2 transition-colors ${
      activeTab === value
        ? "bg-white text-black border-b-4 border-black"
        : "bg-transparent text-gray-600 hover:text-black"
    }`}
    onClick={() => setActiveTab(value)}
  >
    {children}
  </button>
);

export const TabsContent: React.FC<{
  value: string;
  className: string;
  children: React.ReactNode;
  activeTab?: string;
}> = ({ value, className, children, activeTab }) => {
  if (activeTab !== value) return null;
  return <div className={className}>{children}</div>;
};
