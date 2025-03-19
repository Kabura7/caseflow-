/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CaseCard } from '../../../components/CaseCard';
import { authApi } from '../../../utils/auth';
import { AlertCircle } from 'lucide-react';
import { formatDate } from '../../../utils/date'


// Add this interface at the top of the file
interface CaseItem {
  id: string;
  title: string;
  description: string;
  status: string;
  category?: string;
  client: string;
  lawyer: string;
  updated: string;
}

export const AssignedCasesPage = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const { data: assignedCasesData, isLoading, error } = useQuery({
    queryKey: ['assignedCases'],
    queryFn: async () => {
      const response = await authApi.getAssignedCases();
      return response?.data || { assigned_cases: []  as CaseItem[]}; // Ensure default value
    },
  });

  const assignedCases = assignedCasesData?.assigned_cases || [] as CaseItem[]; // Default to empty array

  const filteredCases = useMemo(() => {
    return assignedCases.filter((caseItem: CaseItem) => {
      const matchesStatus = statusFilter === 'all' || caseItem.status === statusFilter;
      const caseCategory = caseItem.category || 'Uncategorized';
      const matchesCategory = categoryFilter === 'all' || caseCategory === categoryFilter;
      return matchesStatus && matchesCategory;
    });
  }, [assignedCases, statusFilter, categoryFilter]);

  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(assignedCases.map((caseItem: CaseItem) => caseItem.category || 'Uncategorized')));
  }, [assignedCases]);

  const uniqueStatuses = useMemo(() => {
    return Array.from(new Set(assignedCases.map((caseItem: CaseItem) => caseItem.status)));
  }, [assignedCases]);


  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Assigned Cases</h2>
            <p className="text-sm text-gray-500 mt-1">
              Cases currently assigned to you
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse" />
            <div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse" />
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load cases</h3>
          <p className="text-gray-500">
            {error instanceof Error ? error.message : 'Please try again later'}
          </p>
        </div>
      </div>
    );
  }

  if (!assignedCases.length) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-10 w-10 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No cases assigned</h3>
          <p className="text-gray-500">You currently don't have any cases assigned to you</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Assigned Cases</h2>
          <p className="text-sm text-gray-500 mt-1">Cases currently assigned to you</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            className="text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {uniqueCategories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            className="text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            {uniqueStatuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCases.map((caseItem) => (
          <CaseCard
            key={caseItem.id}
            title={caseItem.title}
            description={caseItem.description}
            status={caseItem.status}
            category={caseItem.category || 'Uncategorized'}
            client={{ name: caseItem.client, contactPerson: caseItem.client }}
            lawyer={{ name: caseItem.lawyer, imageUrl: undefined }}
            lastUpdated={formatDate(caseItem.updated)}
            actionButton={
              <button
                className="px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
                onClick={() => alert('Opening case details!')}
              >
                View Details
              </button>
            }
          />
        ))}
      </div>
    </div>
  );
};
