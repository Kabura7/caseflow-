// import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { CaseCard } from '../../../components/CaseCard'
import { authApi } from '../../../utils/auth'
import { useAuth } from '../../../contexts/AuthContext'
import { AlertCircle } from 'lucide-react'
export const ActiveCasesPage = () => {
  const { user } = useAuth()
  const {
    data: casesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['cases', user?.id],
    queryFn: () => {
      if (!user?.id) throw new Error('User ID not found')
      return authApi.getCases(user.id)
    },
    enabled: !!user?.id,
  })
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              My Active Cases
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Track and manage your ongoing legal cases
            </p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-sm animate-pulse"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-3 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
              </div>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Failed to load cases
          </h3>
          <p className="text-gray-500">
            {error instanceof Error ? error.message : 'Please try again later'}
          </p>
        </div>
      </div>
    )
  }
  if (!casesData?.data.cases.length) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No cases reported
          </h3>
          <p className="text-gray-500">
            You haven't reported any cases yet. Would you like to report a new
            case?
          </p>
          <button
            onClick={() => (window.location.href = '/client/report')}
            className="mt-4 px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
          >
            Report New Case
          </button>
        </div>
      </div>
    )
  }
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Active Cases</h2>
          <p className="text-sm text-gray-500 mt-1">
            Track and manage your ongoing legal cases
          </p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {casesData.data.cases.map((caseItem) => (
          <CaseCard
            key={caseItem.id}
            {...caseItem}
            actionButton={
              <button
                className="px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
                onClick={() => {
                  // This will be handled later with the API
                  alert('Opening case details!')
                }}
              >
                View Details
              </button>
            }
          />
        ))}
      </div>
    </div>
  )
}
