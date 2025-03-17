import React from 'react'
import { StarIcon, MapPinIcon, BriefcaseIcon } from 'lucide-react'
import type { Lawyer } from '../utils/auth'
interface LawyerCardProps {
  lawyer: Lawyer
  onSelect: (lawyer: Lawyer) => void
}
export const LawyerCard = ({ lawyer, onSelect }: LawyerCardProps) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <img
          src={
            lawyer.imageUrl || 'https://randomuser.me/api/portraits/men/1.jpg'
          }
          alt={lawyer.name}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{lawyer.name}</h3>
          <p className="text-sm text-gray-500">{lawyer.specialization}</p>
          <div className="mt-2 flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-500">
              <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
              <span>{lawyer.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <BriefcaseIcon className="h-4 w-4 mr-1" />
              <span>{lawyer.casesHandled} cases</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <MapPinIcon className="h-4 w-4 mr-1" />
              <span>{lawyer.location}</span>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => onSelect(lawyer)}
              className="px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
            >
              Request Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
