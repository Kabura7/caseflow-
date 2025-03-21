// Import necessary dependencies
import React, { useState } from 'react' 
import { TextField } from '../../../components/TextField'
import { SearchIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { authApi, type Lawyer } from '../../../utils/auth'
import { LawyerCard } from '../../../components/LawyerCard'

export const FindLawyerPage = () => {
  // State variables to manage search query, errors, and search results
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState('')
  const [searchResults, setSearchResults] = useState<Lawyer[]>([])

  // Mutation to handle searching for lawyers
  const searchMutation = useMutation({
    mutationFn: (query: string) => authApi.findLawyers(query),
    onSuccess: (response) => {
      if (response.data.lawyers.length === 0) {
        toast.info(
          <div className="flex items-center gap-2">
            <span className="font-medium">
              No lawyers found matching your criteria
            </span>
          </div>,
          { position: 'bottom-right' }
        )
      }
      setSearchResults(response.data.lawyers)
    },
    onError: (error) => {
      toast.error(
        <div className="flex items-center gap-2 text-red-600">
          <span className="font-medium">
            {error instanceof Error ? error.message : 'Failed to search for lawyers'}
          </span>
        </div>,
        { position: 'bottom-right' }
      )
    },
  })

  // Handles search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      setError('Please enter a search term')
      return
    }
    setError('')
    searchMutation.mutate(searchQuery.trim())
  }

  // Handles selection of a lawyer
  const handleSelectLawyer = (lawyer: Lawyer) => {
    toast.info(
      <div className="flex items-center gap-2">
        <span className="font-medium">
          Consultation request sent to {lawyer.name}
        </span>
      </div>,
      { position: 'bottom-right' }
    )
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Page heading */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Find a Lawyer</h2>
      
      <div className="backdrop-blur-sm bg-white/30 rounded-lg shadow-lg p-8 border border-white/20">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <TextField
              label="Search Lawyers"
              placeholder="Search by specialization (e.g., Criminal Law, Family Law)"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setError('')
              }}
              className="pr-10 border-gray-300 focus:border-black border-[1.5px] focus:ring-1 focus:ring-black"
              error={
                error ? { type: 'manual', message: error } : undefined
              }
              required
            />
            <SearchIcon className="absolute right-3 top-[38px] h-5 w-5 text-gray-400" />
          </div>
          
          {/* Search Button */}
          <button
            type="submit"
            disabled={searchMutation.isPending}
            className="mt-[30px] px-8 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 h-[42px] transition-all duration-200 ease-in-out disabled:bg-gray-400"
          >
            {searchMutation.isPending ? 'Searching...' : 'Search'}
          </button>
        </form>

        {/* Search Results */}
        <div className="mt-8 space-y-4">
          {/* Show loading placeholders when searching */}
          {searchMutation.isPending
            ? [...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-start space-x-4">
                    <div className="rounded-full bg-gray-200 h-12 w-12 animate-pulse" />
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
                      <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse" />
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
                        <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            : searchResults.map((lawyer) => (
                <LawyerCard key={lawyer.id} lawyer={lawyer} onSelect={handleSelectLawyer} />
              ))}
        </div>
      </div>
    </div>
  )
}
