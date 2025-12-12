import React from 'react';
import { Button } from "@/components/ui/button";
import { Bell } from "@/components/svg";
const NotificationSidebar = ({ activeChannel, onChannelChange }) => {
  const channels = [
    { id: 'tasks', name: '#Tasks', icon: 'fas fa-hashtag' },
    { id: 'birthdays', name: '#Birthdays', icon: 'fas fa-hashtag' },
    { id: 'announcements', name: 'Announcements', icon: 'fas fa-hashtag' }
  ];

  return (
    <aside className="flex flex-col bg-white border-r border-gray-200 w-full md:w-[280px] p-4" style={{ minWidth: '280px' }}>
      <div className="flex items-center mb-6">
      <Button
          variant="ghost"
          size="icon"
          className="relative md:h-9 md:w-9 h-8 w-8 hover:bg-default-100 dark:hover:bg-default-200 
                data-[state=open]:bg-default-100  dark:data-[state=open]:bg-default-200 
                 hover:text-primary text-default-500 dark:text-default-800  rounded-full  "
        >
          <Bell className="h-5 w-5 " />
        </Button>
        <h2 className="ml-3 text-sm font-semibold text-gray-900">Notifications</h2>
      </div>
      
      <nav className="flex flex-col text-xs font-semibold text-[#94a3b8] space-y-2 mb-8 select-none">
        <div className="uppercase tracking-widest text-[9px] font-semibold text-[#94a3b8] mb-2">Informations</div>
        {channels.map((channel) => (
          <button
            key={channel.id}
            onClick={() => onChannelChange(channel.id)}
            className={`flex items-center space-x-2 px-2 py-1 rounded-md ${
              activeChannel === channel.id
                ? 'bg-[#e0e7ff] text-[#2563eb]'
                : 'hover:bg-gray-100'
            }`}
            type="button"
          >
            <i className={channel.icon + " text-xs"}></i>
            <span>{channel.name}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default NotificationSidebar; 