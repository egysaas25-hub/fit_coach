// app/admin/dashboard/AdminClientComponents.tsx
"use client";

import React, { useState, createContext, useContext } from 'react';
import { Bell, FileText, Send } from 'lucide-react';

// Mock notification data
const mockNotifications = [
  { id: 1, type: 'info', title: 'New client signup', message: 'John Doe signed up', time: '5m ago', read: false },
  { id: 2, type: 'warning', title: 'Payment failed', message: 'Subscription payment failed', time: '1h ago', read: false },
  { id: 3, type: 'success', title: 'Backup completed', message: 'Daily backup successful', time: '2h ago', read: true },
];

// Tabs Context
interface TabsContextType {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

// AdminHeader Component
export const AdminHeader: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <header className="border-b bg-card px-6 py-4 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">Operational heartbeat and key performance indicators</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h3 className="font-semibold">Notifications</h3>
                  <button className="text-xs text-primary hover:underline">Mark all read</button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {mockNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 border-b border-border hover:bg-accent cursor-pointer ${
                        !notif.read ? 'bg-accent/50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            notif.type === 'success' ? 'bg-green-500' :
                            notif.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                          }`}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{notif.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notif.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-border text-center">
                  <button className="text-sm text-primary hover:underline">View all notifications</button>
                </div>
              </div>
            )}
          </div>
          <button className="px-4 py-2 border border-border rounded-lg hover:bg-accent flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Export Report
          </button>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2">
            <Send className="w-4 h-4" />
            Broadcast
          </button>
        </div>
      </div>
    </header>
  );
};

// Tabs Component
export const Tabs: React.FC<{ children: React.ReactNode; defaultValue: string }> = ({ children, defaultValue }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="space-y-4">
        {children}
      </div>
    </TabsContext.Provider>
  );
};

// TabsList Component
export const TabsList: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="border-b border-border">
    <div className="flex gap-4">
      {children}
    </div>
  </div>
);

// TabsTrigger Component
export const TabsTrigger: React.FC<{ value: string; children: React.ReactNode }> = ({ value, children }) => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('TabsTrigger must be used within a Tabs component');
  }
  const { activeTab, setActiveTab } = context;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`px-4 py-2 border-b-2 transition-colors ${
        activeTab === value
          ? 'border-primary text-primary font-medium'
          : 'border-transparent text-muted-foreground hover:text-foreground'
      }`}
    >
      {children}
    </button>
  );
};

// TabsContent Component
export const TabsContent: React.FC<{ value: string; children: React.ReactNode }> = ({ value, children }) => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('TabsContent must be used within a Tabs component');
  }
  const { activeTab } = context;

  if (value !== activeTab) return null;
  return <div className="py-4">{children}</div>;
};