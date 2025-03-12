import React, { useState } from "react";
import { Badge } from "./ui/Badge";
import { UserIcon } from "lucide-react";
import { Dialog } from "./ui/Dialog";


export interface CaseCardProps {
  title: string;
  description: string;
  status: "Active" | "Pending" | "Closed" | "On Hold";
  lawyer?: {
    name: string;
    imageUrl?: string;
  };
  client?: {
    name: string;
    contactPerson: string;
  };
  lastUpdated: string;
  actionButton?: React.ReactNode;
}


export const CaseCard = ({
  title,
  description,
  status,
  lawyer,
  client,
  lastUpdated,
  actionButton,
}: CaseCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const getStatusColor = (status: CaseCardProps["status"]) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Closed":
        return "bg-gray-100 text-gray-800";
      case "On Hold":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  return (
    <>
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
        <div className="p-6 flex-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500 mt-1">
                Last updated: {lastUpdated}
              </p>
            </div>
            <Badge className={getStatusColor(status)}>{status}</Badge>
          </div>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="w-full text-left"
          >
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 hover:text-gray-900">
              {description}
            </p>
          </button>
        </div>
        {(actionButton || client) && (
          <div className="p-6 pt-0">
            <div className="border-t border-gray-100 pt-4">
              {client && (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Client</p>
                    <p className="text-sm text-gray-500">{client.name}</p>
                  </div>
                  {actionButton}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={title}
      >
        <div className="space-y-4">
          <p className="text-gray-600">{description}</p>
          {client && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <p className="font-medium text-gray-900">Client Information</p>
              <p className="text-sm text-gray-500">
                Company/Individual: {client.name}
              </p>
              <p className="text-sm text-gray-500">
                Contact Person: {client.contactPerson}
              </p>
            </div>
          )}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(status)}>{status}</Badge>
              <span className="text-sm text-gray-500">
                Last updated: {lastUpdated}
              </span>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};
