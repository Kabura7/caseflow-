import React, { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CaseCard } from '../../../components/CaseCard'
import { authApi } from '../../../utils/auth'
import { useAuth } from '../../../contexts/AuthContext'
import { toast } from 'sonner'
import { AlertCircle, CheckCircle } from 'lucide-react'
export const AvailableCasesPage = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const {
    data: casesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['availableCases'],
    queryFn: () => authApi.getAvailableCases(),
  })
  const filteredCases = useMemo(() => {
    if (!casesData?.data.cases) return []
    return casesData.data.cases.filter((caseItem) => {
      return categoryFilter === 'all' || caseItem.category === categoryFilter
    })
  }, [casesData?.data.cases, categoryFilter])
  const handleCaseMutation = useMutation({
    mutationFn: (caseId: string) => {
      if (!user?.id) throw new Error('User ID not found')
      return authApi.handleCase(caseId, user.id)
    },
    onSuccess: () => {
      toast(
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span className="font-medium">Case assigned successfully</span>
        </div>,
        {
          position: 'bottom-right',
        },
      )
      queryClient.invalidateQueries({
        queryKey: ['availableCases'],
      })
    },
    onError: (error) => {
      toast(
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span className="font-medium">
            {error instanceof Error ? error.message : 'Failed to handle case'}
          </span>
        </div>,
        {
          position: 'bottom-right',
        },
      )
    },
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Available Cases
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Cases that need legal representation
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
            No case submitted
          </h3>
          <p className="text-gray-500">
            There are currently no cases available for review
          </p>
        </div>
      </div>
    )
  }
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Available Cases</h2>
          <p className="text-sm text-gray-500 mt-1">
            Cases that need legal representation
          </p>
        </div>
        <select
          className="text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          {casesData?.data.categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCases.map((caseItem) => (
          <CaseCard
            key={caseItem.id}
            {...caseItem}
            title={`${caseItem.title} · ${caseItem.category}`}
            actionButton={
              <button
                className="px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                onClick={() => handleCaseMutation.mutate(caseItem.id)}
                disabled={handleCaseMutation.isPending}
              >
                {handleCaseMutation.isPending ? 'Processing...' : 'Handle Case'}
              </button>
            }
          />
        ))}
      </div>
    </div>
  )
}
