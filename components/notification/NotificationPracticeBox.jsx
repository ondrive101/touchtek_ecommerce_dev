import React from 'react';
import { Button } from "@/components/ui/button";

const NotificationPracticeBox = () => {
  return (
    <section className="bg-[#f1f5f9] rounded-lg p-4 flex items-center space-x-4 select-none">
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 text-sm mb-1">Practice</h3>
        <p className="text-xs text-gray-500 mb-3">Create your own room to practice</p>
        <Button 
          variant="default"
          className="bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-700"
        >
          Create Room
        </Button>
      </div>
      <img 
        alt="Illustration of a person standing under a futuristic flying car, representing practice" 
        className="w-16 h-16 object-contain" 
        draggable="false" 
        src="https://storage.googleapis.com/a1aa/image/61c64146-48fb-4af7-6789-51a56df460c1.jpg" 
      />
    </section>
  );
};

export default NotificationPracticeBox; 