import React from "react";
import { CaseCard, type CaseCardProps } from "../../../components/CaseCard";
const MOCK_AVAILABLE_CASES: CaseCardProps[] = [
  {
    title: "Intellectual Property Dispute",
    description:
      "Need legal assistance with a patent infringement case. Company has been using our patented technology without authorization.",
    status: "Pending",
    lastUpdated: "2024-02-20",
    client: {
      name: "Tech Innovations Inc.",
      contactPerson: "Sarah Chen",
    },
  },
  {
    title: "Employment Contract Review",
    description:
      "Require legal review of new employment contracts for our expanding business. Need to ensure compliance with current labor laws.",
    status: "Pending",
    lastUpdated: "2024-02-19",
    client: {
      name: "Robert Wilson",
      contactPerson: "Robert Wilson",
    },
  },
  {
    title: "Real Estate Transaction Dispute",
    description:
      "Seller failed to disclose major structural issues in property purchase. Need legal representation for potential lawsuit.",
    status: "Pending",
    lastUpdated: "2024-02-18",
    client: {
      name: "Maria Garcia",
      contactPerson: "Maria Garcia",
    },
  },
  {
    title: "Business Partnership Dissolution",
    description:
      "Need assistance with dissolving a business partnership and negotiating fair distribution of assets.",
    status: "Pending",
    lastUpdated: "2024-02-17",
    client: {
      name: "Johnson & Smith LLC",
      contactPerson: "David Johnson",
    },
  },
];
export const AvailableCasesPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Available Cases</h2>
          <p className="text-sm text-gray-500 mt-1">
            Cases that need legal representation
          </p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {MOCK_AVAILABLE_CASES.map((caseItem, index) => (
          <div key={index} className="relative">
            <CaseCard {...caseItem} />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white to-transparent">
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-900">Client</p>
                  <p className="text-sm text-gray-500">
                    {caseItem.client?.name}
                  </p>
                </div>
                <button
                  className="px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
                  onClick={() => {
                    // This will be handled later with the API
                    alert("Request to handle case submitted!");
                  }}
                >
                  Handle Case
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
