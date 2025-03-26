// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { X } from 'lucide-react';


// interface JobPost {
//     jobId:string;
//     title: string;
//     description: string;
//     wage: number;
//     startDate: string; // ISO date format (YYYY-MM-DD)
//     endDate: string; // ISO date format (YYYY-MM-DD)
//     prefferedTime: string;
//     muncipalityId: string;
//     skillId1: string;
//     skillId2: string;
//   }
// interface EditJobModalProps {
//   job: JobPost;
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess: () => void;
// }

// interface JobUpdateData {
//   title: string;
//   description: string;
//   wage: number;
//   startDate: string;
//   endDate: string;
//   prefferedTime: string;
//   muncipalityId: string;
//   skillId1: string;
//   skillId2: string;
// }

// const EditJobModal: React.FC<EditJobModalProps> = ({ job, isOpen, onClose, onSuccess }) => {
//   const [formData, setFormData] = useState<JobUpdateData>({
//     title: '',
//     description: '',
//     wage: 0,
//     startDate: '',
//     endDate: '',
//     prefferedTime: '',
//     muncipalityId: '',
//     skillId1: '',
//     skillId2: ''
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (job) {
//       // Format dates to YYYY-MM-DD for input fields
//       const formatDate = (dateString: string) => {
//         const date = new Date(dateString);
//         return date.toISOString().split('T')[0];
//       };

//       setFormData({
//         title: job.title,
//         description: job.description,
//         wage: job.wage,
//         startDate: formatDate(job.startDate),
//         endDate: formatDate(job.endDate),
//         prefferedTime: job.prefferedTime,
//         muncipalityId: job.muncipalityId,
//         skillId1: job.skillId1,
//         skillId2: job.skillId2
//       });
//     }
//   }, [job]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: name === 'wage' ? parseFloat(value) : value
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setError(null);

//     try {
//       const response = await axios.patch(
//         `https://localhost:7299/api/Job/updatejobpost?jobId=${job.jobId}`,
//         formData,
//         { withCredentials: true }
//       );

//       if (response.status === 200) {
//         onSuccess();
//         onClose();
//       }
//     } catch (err) {
//       console.error('Error updating job:', err);
//       setError('Failed to update job post. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//         <div className="flex justify-between items-center p-6 border-b">
//           <h2 className="text-xl font-bold text-gray-900">Edit Job Post</h2>
//           <button 
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700 transition-colors"
//           >
//             <X size={24} />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           {error && (
//             <div className="bg-red-50 text-red-700 p-4 rounded-md border border-red-200">
//               {error}
//             </div>
//           )}

//           <div>
//             <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
//               Job Title
//             </label>
//             <input
//               type="text"
//               id="title"
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//               required
//               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>

//           <div>
//             <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
//               Description
//             </label>
//             <textarea
//               id="description"
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               required
//               rows={4}
//               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>

//           <div>
//             <label htmlFor="wage" className="block text-sm font-medium text-gray-700 mb-1">
//               Hourly Wage ($)
//             </label>
//             <input
//               type="number"
//               id="wage"
//               name="wage"
//               value={formData.wage}
//               onChange={handleChange}
//               min="0"
//               step="0.01"
//               required
//               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
//                 Start Date
//               </label>
//               <input
//                 type="date"
//                 id="startDate"
//                 name="startDate"
//                 value={formData.startDate}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>

//             <div>
//               <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
//                 End Date
//               </label>
//               <input
//                 type="date"
//                 id="endDate"
//                 name="endDate"
//                 value={formData.endDate}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//           </div>

//           <div>
//             <label htmlFor="prefferedTime" className="block text-sm font-medium text-gray-700 mb-1">
//               Preferred Time
//             </label>
//             <select
//               id="prefferedTime"
//               name="prefferedTime"
//               value={formData.prefferedTime}
//               onChange={handleChange}
//               required
//               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="">Select time preference</option>
//               <option value="Morning">Morning</option>
//               <option value="Afternoon">Afternoon</option>
//               <option value="Evening">Evening</option>
//               <option value="Night">Night</option>
//               <option value="Flexible">Flexible</option>
//             </select>
//           </div>

//           <div>
//             <label htmlFor="muncipalityId" className="block text-sm font-medium text-gray-700 mb-1">
//               Municipality
//             </label>
//             <input
//               type="text"
//               id="muncipalityId"
//               name="muncipalityId"
//               value={formData.muncipalityId}
//               onChange={handleChange}
//               required
//               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label htmlFor="skillId1" className="block text-sm font-medium text-gray-700 mb-1">
//                 Primary Skill
//               </label>
//               <input
//                 type="text"
//                 id="skillId1"
//                 name="skillId1"
//                 value={formData.skillId1}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>

//             <div>
//               <label htmlFor="skillId2" className="block text-sm font-medium text-gray-700 mb-1">
//                 Secondary Skill
//               </label>
//               <input
//                 type="text"
//                 id="skillId2"
//                 name="skillId2"
//                 value={formData.skillId2}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//           </div>

//           <div className="flex justify-end gap-3 pt-4 border-t">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-70"
//             >
//               {isSubmitting ? 'Updating...' : 'Update Job'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditJobModal;