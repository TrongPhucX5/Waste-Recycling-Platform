"use client";
import React, { useState } from "react";
import { LayoutDashboard, CheckCircle, MapPin, Search } from "lucide-react";
import { TaskCard, Task } from "./TaskCard";
import { HistoryList } from "./HistoryList";
import { Modal, Button, Input, Select, Badge } from "../ui";

const MOCK_TASKS: Task[] = [
  { id: 1, type: "Plastic", quantity: "50kg", location: "District 1, HCMC", status: "ASSIGNED", pickupTime: "2024-03-12 10:00", requester: "Nguyen Van A" },
  { id: 2, type: "Paper", quantity: "20kg", location: "District 3, HCMC", status: "ON_THE_WAY", pickupTime: "2024-03-12 14:00", requester: "Tran Thi B" },
  { id: 3, type: "Metal", quantity: "30kg", location: "District 7, HCMC", status: "ASSIGNED", pickupTime: "2024-03-12 16:30", requester: "Hoang Van C" },
];

export const CollectorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"tasks" | "history">("tasks");
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [collectionImage, setCollectionImage] = useState<File | null>(null);
  const [confirmNote, setConfirmNote] = useState("");

  const handleUpdateStatus = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
    setCollectionImage(null);
    setConfirmNote("");
  };

  const updateTaskStatus = (id: number, newStatus: Task["status"]) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    closeModal();
  };

  const renderModalContent = () => {
    if (!selectedTask) return null;

    if (selectedTask.status === "ASSIGNED") {
      return (
        <div className="space-y-4">
          <p className="text-gray-600">You are about to start pickup for task <b>#{selectedTask.id}</b>.</p>
          <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-700">
             Ensure you have the necessary equipment and vehicle ready before proceeding.
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
            <Button onClick={() => updateTaskStatus(selectedTask.id, "ON_THE_WAY")}>Confirm Start</Button>
          </div>
        </div>
      );
    }

    if (selectedTask.status === "ON_THE_WAY") {
      return (
        <div className="space-y-4">
          <p className="text-gray-600">Complete collection for task <b>#{selectedTask.id}</b>.</p>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Proof of Collection (Image)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-emerald-500 transition-colors cursor-pointer bg-gray-50">
               <div className="space-y-1 text-center">
                 <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                   <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                 </svg>
                 <div className="flex text-sm text-gray-600">
                   <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500">
                     <span>Upload a file</span>
                     <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCollectionImage(e.target.files?.[0] || null)} />
                   </label>
                   <p className="pl-1">or drag and drop</p>
                 </div>
                 <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
               </div>
            </div>
            {collectionImage && <p className="text-sm text-emerald-600 mt-2">Selected: {collectionImage.name}</p>}
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
             <Input 
               value={confirmNote} 
               onChange={(e) => setConfirmNote(e.target.value)} 
               placeholder="Additional notes about collection..." 
             />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
            <Button 
                onClick={() => updateTaskStatus(selectedTask.id, "COLLECTED")}
                disabled={!collectionImage}
            >
                Complete Collection
            </Button>
          </div>
        </div>
      );
    }

    if (selectedTask.status === "COLLECTED" || selectedTask.status === "COMPLETED") {
       return (
        <div className="space-y-4">
           <div className="bg-emerald-50 p-4 rounded-md flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" />
              <div>
                 <h4 className="text-sm font-medium text-emerald-800">Task Completed</h4>
                 <p className="text-sm text-emerald-700 mt-1">
                    This task has been successfully collected and recorded.
                 </p>
              </div>
           </div>
           
           <div className="grid grid-cols-2 gap-4 text-sm">
             <div>
                <span className="text-gray-500 block">Type</span>
                <span className="font-medium">{selectedTask.type}</span>
             </div>
             <div>
                <span className="text-gray-500 block">Quantity</span>
                <span className="font-medium">{selectedTask.quantity}</span>
             </div>
              <div>
                <span className="text-gray-500 block">Location</span>
                <span className="font-medium truncate">{selectedTask.location}</span>
             </div>
             <div>
                <span className="text-gray-500 block">Completed At</span>
                <span className="font-medium">2024-03-12 14:45</span>
             </div>
           </div>

            <div className="mt-4">
              <span className="text-gray-500 block text-sm mb-2">Proof of Collection</span>
              <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center text-gray-400">
                 [Image Placeholder]
              </div>
            </div>

           <div className="flex justify-end mt-6">
             <Button variant="outline" onClick={closeModal}>Close</Button>
           </div>
        </div>
       );
    }
    
    return null;
  };

  return (
    <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                   <p className="text-sm font-medium text-gray-500 uppercase">Assigned Tasks</p>
                   <p className="text-3xl font-bold text-gray-900 mt-1">{tasks.filter(t => t.status === "ASSIGNED").length}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                   <LayoutDashboard className="h-6 w-6" />
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                   <p className="text-sm font-medium text-gray-500 uppercase">Completed Today</p>
                   <p className="text-3xl font-bold text-emerald-600 mt-1">12</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-full text-emerald-600">
                   <CheckCircle className="h-6 w-6" />
                </div>
            </div>
             <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                   <p className="text-sm font-medium text-gray-500 uppercase">Current Location</p>
                   <p className="text-lg font-bold text-gray-800 mt-1 truncate">District 1, HCMC</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-full text-purple-600">
                   <MapPin className="h-6 w-6" />
                </div>
            </div>
        </div>

        {/* Tabs & Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px]">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex items-center justify-between">
               <div className="flex space-x-6">
                  <button 
                    onClick={() => setActiveTab("tasks")}
                    className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "tasks" ? "border-emerald-500 text-emerald-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                  >
                    Current Tasks
                  </button>
                  <button 
                    onClick={() => setActiveTab("history")}
                    className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "history" ? "border-emerald-500 text-emerald-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                  >
                    History
                  </button>
               </div>
               
               {activeTab === "tasks" && (
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search tasks..." 
                      className="pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-emerald-500 focus:border-emerald-500"
                    />
                 </div>
               )}
            </div>

            <div className="p-6">
               {activeTab === "tasks" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks.map(task => (
                      <TaskCard key={task.id} task={task} onUpdateStatus={handleUpdateStatus} />
                    ))}
                    {tasks.length === 0 && (
                        <div className="col-span-full py-12 text-center text-gray-500">
                           No tasks assigned at the moment.
                        </div>
                    )}
                  </div>
               ) : (
                  <HistoryList />
               )}
            </div>
        </div>

        {/* Action Modal */}
        <Modal 
          isOpen={isModalOpen}
          onClose={closeModal}
          title={selectedTask ? `Update Task #${selectedTask.id}` : "Task Update"}
        >
           {renderModalContent()}
        </Modal>
    </div>
  );
};