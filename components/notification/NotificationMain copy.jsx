import React from 'react';
import {NotificationBirthdayMessage,NotificationTaskMessage} from './NotificationMessage';
import { Input } from "@/components/ui/input";


const NotificationMain = ({ activeChannel, messages }) => {
  const channelInfo = {
    tasks: {
      title: '#Tasks',
      description: 'Task updates and notifications',
      memberCount: 245
    },
    birthdays: {
      title: '#Birthdays',
      description: 'Birthday celebrations and wishes',
      memberCount: 430
    },
    announcements: {
      title: 'Announcements',
      description: 'Important announcements and updates',
      memberCount: 512
    }
  };

  const currentChannel = channelInfo[activeChannel] || channelInfo.tasks;

  // Filter messages based on active channel
  const filteredMessages = messages.filter(msg => msg.channel === activeChannel || msg.isDateDivider);

  return (
    <div class="flex-1 flex flex-col border-r border-gray-200 px-6 py-4 space-y-6 text-sm text-[#334155]">
    {/* <!-- Top Tabs --> */}
    <nav class="flex space-x-6 border-b border-gray-300 pb-3 text-sm font-semibold text-[#1e293b]">
     <button class="border-b-2 border-black pb-1">
      Notifications
     </button>
     <button class="text-gray-600 font-normal">
      All activity
     </button>
     <button class="text-gray-600 font-normal">
      Archive
     </button>
    </nav>
    {/* <!-- Sub Tabs --> */}
    <div class="flex items-center space-x-6 border-b border-gray-300 mt-3 pb-3 text-xs text-gray-600">
     <button class="text-[#1e293b] font-normal hover:underline">
      All
     </button>
     <button class="bg-[#e0e7ff] text-[#4338ca] rounded px-3 py-1 font-normal">
      Assigned to me
     </button>
     <button class="font-normal hover:underline">
      Created by me
     </button>
     <button class="font-normal hover:underline">
      @Mentioned
     </button>
     <div class="flex-grow">
     </div>
     <button class="flex items-center space-x-1 text-gray-600 hover:underline text-xs">
      <svg aria-hidden="true" class="w-3 h-3" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24">
       <polyline points="6 9 12 15 18 9">
       </polyline>
      </svg>
      <span>
       Unarchive all
      </span>
     </button>
    </div>
    {/* <!-- Notification Card --> */}
    <div class="mt-6 bg-[#f8fafc] rounded-md border border-gray-200 p-5">
     <div class="flex justify-between items-start">
      <div class="flex items-center space-x-2 text-gray-500 text-xs">
       <i class="far fa-clock">
       </i>
       <span>
        Task
       </span>
      </div>
      <button class="flex items-center space-x-1 border border-gray-300 rounded-md px-3 py-1 text-xs text-gray-700 hover:bg-gray-100" type="button">
       <i class="far fa-folder-open">
       </i>
       <span>
        Unarchive
       </span>
      </button>
     </div>
     <h3 class="mt-2 font-bold text-xs text-[#1e293b] leading-tight uppercase">
      NEW ECONOMY CABLE DESIGN READY KARNI HAI
     </h3>
     <div class="mt-2 text-[10px] text-gray-600 space-y-1 leading-tight">
      <p>
       <strong>
        pdmkarmabir@touchtek.in
       </strong>
       created this task
       <span class="ml-1 text-[9px] text-[#94a3b8]">
        Last Wed, July 2, 2025 12:42 PM
       </span>
      </p>
      <p>
       <strong>
        pdmkarmabir@touchtek.in
       </strong>
       changed task name.
       <button class="text-[9px] text-[#4338ca] underline ml-1">
        Show Difference
       </button>
       <span class="ml-1 text-[9px] text-[#94a3b8]">
        Last Wed, July 2, 2025 12:44 PM
       </span>
      </p>
      <p>
       <strong>
        Neeraj Goel
       </strong>
       changed record start date
       <span>
        set start date: Last Thu, July 3, 2025
       </span>
       <span class="ml-1 text-[9px] text-[#94a3b8]">
        Last Thu, July 3, 2025 3:59 PM
       </span>
      </p>
      <p>
       <strong>
        Neeraj Goel
       </strong>
       changed record due date
       <span>
        set due date to Last Sun, July 6, 2025
       </span>
       <span class="ml-1 text-[9px] text-[#94a3b8]">
        Last Thu, July 3, 2025 3:59 PM
       </span>
      </p>
     </div>
     {/* <!-- Comments --> */}
     <div class="mt-4 space-y-4">
      {/* <!-- Comment 1 --> */}
      <div class="flex items-start space-x-3">
       <img alt="Profile picture of pdmkarmabir@touchtek.in, a person with short hair and beard" class="w-6 h-6 rounded-full object-cover" height="24" src="https://storage.googleapis.com/a1aa/image/c03fca43-9c61-41ee-8478-c73086c8529c.jpg" width="24"/>
       <div class="text-[10px] text-gray-600 flex-1">
        <p>
         <strong class="text-[11px] text-[#1e293b]">
          pdmkarmabir@touchtek.in
         </strong>
         <span class="ml-2 text-[9px] text-[#94a3b8]">
          Last Thu, July 3, 2025 4:02 PM
         </span>
        </p>
        <p class="text-[11px] font-semibold text-[#1e293b] mt-1 leading-tight">
         OK
        </p>
       </div>
      </div>
      {/* <!-- Comment 2 --> */}
      <div class="flex items-start space-x-3">
       <img alt="Profile picture of Neeraj Goel, a person with short hair and glasses" class="w-6 h-6 rounded-full object-cover" height="24" src="https://storage.googleapis.com/a1aa/image/f0e44fa4-b36b-43de-3420-a1757cf2b791.jpg" width="24"/>
       <div class="text-[10px] text-gray-600 flex-1">
        <p>
         <strong class="text-[11px] text-[#1e293b]">
          Neeraj Goel
         </strong>
         <span class="ml-2 text-[9px] text-[#94a3b8]">
          Last Sat, July 5, 2025 3:45 PM
         </span>
        </p>
        <p class="text-[11px] font-semibold text-[#1e293b] mt-1 leading-tight">
         KAB TAK READY HOGA SHOW ME DEISGN
        </p>
       </div>
      </div>
      {/* <!-- Comment 3 --> */}
      <div class="flex items-start space-x-3">
       <img alt="Profile picture of Neeraj Goel, a person with short hair and glasses" class="w-6 h-6 rounded-full object-cover" height="24" src="https://storage.googleapis.com/a1aa/image/f0e44fa4-b36b-43de-3420-a1757cf2b791.jpg" width="24"/>
       <div class="text-[10px] text-gray-600 flex-1">
        <p>
         <strong class="text-[11px] text-[#1e293b]">
          Neeraj Goel
         </strong>
         <span class="ml-2 text-[9px] text-[#94a3b8]">
          Last Sat, July 5, 2025 3:45 PM
         </span>
        </p>
        <p class="text-[11px] font-semibold text-[#1e293b] mt-1 leading-tight">
         ALSO ATTACHED PROOF
        </p>
       </div>
      </div>
     </div>
    </div>
   </div>
    // <main className="flex-1 flex flex-col border-r border-gray-200">
    //   <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200 select-none">
    //     <div className="flex items-center space-x-2 text-sm font-semibold text-gray-900">
    //       <i className="fas fa-hashtag"></i>
    //       <span>{currentChannel.title}</span>
    //       <span className="text-gray-400 font-normal italic ml-2 text-xs">
    //         {currentChannel.description}
    //       </span>
    //     </div>
    //   </header>

    //   <section className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-md px-6 py-4 space-y-6 text-sm text-[#334155]">
    //     {filteredMessages.length > 0 ? (
    //       filteredMessages.map((message, index) => (
    //         <React.Fragment key={index}>
    //           {message.isDateDivider ? (
    //             <div className="text-center text-xs text-gray-400 font-semibold select-none">
    //               {message.content}
    //             </div>
    //           ) : (


    //             message?.channel === "birthdays" ? <NotificationBirthdayMessage {...message} /> : message?.channel === "tasks" ? <NotificationTaskMessage {...message} /> :<></>
       
    //           )}
    //         </React.Fragment>
    //       ))
    //     ) : (
    //       <div className="text-center text-gray-400 mt-8">
    //         No messages in this channel yet
    //       </div>
    //     )}
    //   </section>
    // </main>
  );
};

export default NotificationMain; 