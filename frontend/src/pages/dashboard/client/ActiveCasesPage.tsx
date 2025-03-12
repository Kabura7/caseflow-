import React from "react";
import { CaseCard, type CaseCardProps } from "../../../components/CaseCard";

const MOCK_CASES: CaseCardProps[] = [
  {
    title: "Property Dispute - 123 Main St",
    description:
      "Dispute regarding property boundaries and easement rights with neighboring property owner. Case involves survey documentation and historical property records.",
    status: "Active",
    lawyer: {
      name: "John Smith",
      imageUrl: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    lastUpdated: "2024-02-15",
  },
  {
    title: "Contract Review - Software License",
    description:
      "Review and negotiation of enterprise software licensing agreement. Focusing on liability clauses and service level agreements.",
    status: "Pending",
    lastUpdated: "2024-02-14",
  },
  {
    title: "Employment Dispute",
    description:
      "Workplace discrimination case involving review of company policies and documentation of incidents.",
    status: "On Hold",
    lawyer: {
      name: "Michael Chen",
    },
    lastUpdated: "2024-02-10",
  },
];
export const ActiveCasesPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Active Cases</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {MOCK_CASES.map((caseItem, index) => (
          <CaseCard key={index} {...caseItem} />
        ))}
      </div>
    </div>
  );
};
