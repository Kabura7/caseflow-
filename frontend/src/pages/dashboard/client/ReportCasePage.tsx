import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "../../../components/TextField";
import { reportCaseSchema, type ReportCaseFormData } from "../../../utils/validation";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
export const ReportCasePage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReportCaseFormData>({
    resolver: zodResolver(reportCaseSchema),
  });
  const onSubmit = (data: ReportCaseFormData) => {
    toast(
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span className="font-medium">Case Submitted</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>,
      {
        position: "bottom-right",
      },
    );
    reset();
  };
  return (
    <div className="w-full max-w-2xl mx-auto relative z-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Report New Case</h2>
      <div className="backdrop-blur-sm bg-white/30 rounded-lg shadow-lg p-8 border border-white/20">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <TextField
            label="Case Title"
            {...register("title")}
            error={errors.title}
            placeholder="Enter case title"
            className="border-gray-300 focus:border-black border-[1.5px] focus:ring-1 focus:ring-black"
          />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Case Description
            </label>
            <textarea
              {...register("description")}
              className="w-full px-3 py-2 border-[1.5px] border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black resize-y min-h-[100px]"
              placeholder="Provide a detailed description of your case"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category (Optional)
              </label>
              <select
                {...register("category")}
                className="w-full px-3 py-2 border-[1.5px] border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              >
                <option value="" disabled selected>
                  Select a category
                </option>
                <option value="civil">Civil Law</option>
                <option value="criminal">Criminal Law</option>
                <option value="corporate">Corporate Law</option>
                <option value="family">Family Law</option>
                <option value="property">Property Law</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Urgency Level
              </label>
              <select
                {...register("urgencyLevel")}
                className="w-full px-3 py-2 border-[1.5px] border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              >
                <option value="" disabled selected>
                  Select urgency level
                </option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              {errors.urgencyLevel && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.urgencyLevel.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Communication Method
            </label>
            <select
              {...register("communicationMethod")}
              className="w-full px-3 py-2 border-[1.5px] border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            >
              <option value="" disabled selected>
                Select communication method
              </option>
              <option value="Email">Email</option>
              <option value="Phone">Phone</option>
              <option value="In-Person">In-Person</option>
            </select>
            {errors.communicationMethod && (
              <p className="mt-1 text-sm text-red-600">
                {errors.communicationMethod.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Documents (Optional)
            </label>
            <input
              type="file"
              multiple
              accept=".pdf,.docx,.jpeg,.jpg"
              {...register("documents")}
              className="w-full px-3 py-2 border-[1.5px] border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            />
            <p className="mt-1 text-sm text-gray-500">
              Maximum 10MB per file. Allowed formats: PDF, DOCX, JPEG
            </p>
            {errors.documents && (
              <p className="mt-1 text-sm text-red-600">
                {errors.documents.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Special Requirements (Optional)
            </label>
            <textarea
              {...register("specialRequirements")}
              className="w-full px-3 py-2 border-[1.5px] border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black resize-y min-h-[100px]"
              placeholder="Any special requirements or additional information"
            />
            {errors.specialRequirements && (
              <p className="mt-1 text-sm text-red-600">
                {errors.specialRequirements.message}
              </p>
            )}
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Submit Case
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
