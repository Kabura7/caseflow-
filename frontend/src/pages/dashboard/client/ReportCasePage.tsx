import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { TextField } from '../../../components/TextField'
import { reportCaseSchema, type ReportCaseFormData } from '../../../utils/validation'
import { toast } from 'sonner'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'
import { authApi } from '../../../utils/auth'


export const ReportCasePage = () => {
  const { user } = useAuth()
  const { register, handleSubmit, formState: { errors }, reset, } = useForm<ReportCaseFormData>({
    resolver: zodResolver(reportCaseSchema),
  })
  
  // Defining the mutation function for submitting the case
  const submitCaseMutation = useMutation({
    mutationFn: (data: ReportCaseFormData) => {
      if (!user?.id) {
        throw new Error('User ID not found')
      }

      // Creating FormData object to handle file uploads
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('description', data.description)
      formData.append('urgencyLevel', data.urgencyLevel)
      formData.append('communicationMethod', data.communicationMethod)
      
      if (data.specialRequirements) {
        formData.append('specialRequirements', data.specialRequirements)
      }
      if (data.documents) {
        Array.from(data.documents).forEach((file) => {
          if(file instanceof File) formData.append('documents', file)
        })
      }
      
      return authApi.submitCase(user.id, formData)
    },
    
    // Handling successful submission
    onSuccess: () => {
      toast.success(
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="font-medium">Case Submitted Successfully</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>,
        {
          position: 'bottom-right',
        },
      )
      reset()
    },
    
    // Handling submission error
    onError: (error) => {
      console.log(error)
      toast.error(
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span className="font-medium">
            {error instanceof Error ? error.message : 'Failed to submit case'}
          </span>
        </div>,
        {
          position: 'bottom-right',
        },
      )
    },
  })

  return (
    <div className="w-full max-w-2xl mx-auto relative z-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Report New Case</h2>
      <div className="backdrop-blur-sm bg-white/30 rounded-lg shadow-lg p-8 border border-white/20">
        <form
          onSubmit={handleSubmit((data) => submitCaseMutation.mutate(data))}
          className="space-y-6"
        >
          {/* Case Title Input */}
          <TextField
            label="Case Title"
            {...register('title')}
            error={errors.title}
            placeholder="Enter case title"
            className="border-gray-300 focus:border-black border-[1.5px] focus:ring-1 focus:ring-black"
          />
          
          {/* Case Description Input */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Case Description</label>
            <textarea
              {...register('description')}
              className="w-full px-3 py-2 border-[1.5px] border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black resize-y min-h-[100px]"
              placeholder="Provide a detailed description of your case"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
          </div>
          
          {/* Urgency Level Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Urgency Level</label>
            <select {...register('urgencyLevel')} className="w-full px-3 py-2 border-[1.5px] border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black">
              <option value="" disabled selected>Select urgency level</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            {errors.urgencyLevel && <p className="mt-1 text-sm text-red-600">{errors.urgencyLevel.message}</p>}
          </div>
          
          {/* Communication Method Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Communication Method</label>
            <select {...register('communicationMethod')} className="w-full px-3 py-2 border-[1.5px] border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black">
              <option value="" disabled selected>Select communication method</option>
              <option value="Email">Email</option>
              <option value="Phone">Phone</option>
              <option value="In-Person">In-Person</option>
            </select>
            {errors.communicationMethod && <p className="mt-1 text-sm text-red-600">{errors.communicationMethod.message}</p>}
          </div>
          
          {/* File Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Documents</label>
            <input type="file" multiple accept=".doc,.docx,.jpeg,.jpg" {...register('documents')} className="w-full px-3 py-2 border-[1.5px] border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black" />
            <p className="mt-1 text-sm text-gray-500">Supported formats: DOC, DOCX, JPEG, JPG</p>
            {errors.documents && <p className="mt-1 text-sm text-red-600">{errors.documents.message}</p>}
          </div>
          
          {/* Submit Button */}
          <div>
            <button type="submit" disabled={submitCaseMutation.isPending} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:bg-gray-400">
              {submitCaseMutation.isPending ? 'Submitting...' : 'Submit Case'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
