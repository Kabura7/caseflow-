import React, { useEffect, useState } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns'
import { 
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  CalendarIcon,
  GavelIcon,
  UsersIcon,
  PhoneIcon,
} from 'lucide-react'
import { Dialog } from '../../../components/ui/Dialog'

// Define the type for event categories
type EventType = 'court' | 'meeting' | 'call'

// Define the structure of an event
interface CalendarEvent {
  id: string
  date: string
  title: string
  type: EventType
  description: string
  time: string
}

// Icons representing different event types
const eventTypeIcons = {
  court: <GavelIcon className="h-4 w-4" />,
  meeting: <UsersIcon className="h-4 w-4" />,
  call: <PhoneIcon className="h-4 w-4" />,
}

// Colors for event type labels
const eventTypeColors = {
  court: 'bg-red-100 text-red-800 border-red-200',
  meeting: 'bg-blue-100 text-blue-800 border-blue-200',
  call: 'bg-green-100 text-green-800 border-green-200',
}

// Main Calendar Page Component
export const CalendarPage = () => {
  // State for managing the current date in view
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date()
    const adjustedDate = new Date(today.getFullYear(), today.getMonth(), 16)
    return adjustedDate
  })

  // State for storing calendar events
  const [events, setEvents] = useState<CalendarEvent[]>([])
  
  // State for managing the add event dialog
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  
  // State for storing new event details
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    type: 'meeting',
    time: '09:00',
  })

  // Load events from local storage on component mount
  useEffect(() => {
    const savedEvents = localStorage.getItem('lawyerCalendarEvents')
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents))
    }
  }, [])

  // Save events to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('lawyerCalendarEvents', JSON.stringify(events))
  }, [events])

  // Get all days for the current month
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  })

  // Navigation handlers to change months
  const handlePreviousMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1))

  // Open event creation modal
  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setNewEvent((prev) => ({
      ...prev,
      date: format(date, 'yyyy-MM-dd'),
    }))
    setIsAddEventOpen(true)
  }

  // Add new event
  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.type || !newEvent.time) {
      return
    }
    const event: CalendarEvent = {
      id: Math.random().toString(36).substr(2, 9),
      title: newEvent.title,
      date: newEvent.date,
      type: newEvent.type as EventType,
      description: newEvent.description || '',
      time: newEvent.time,
    }
    setEvents((prev) => [...prev, event])
    setIsAddEventOpen(false)
    setNewEvent({
      type: 'meeting',
      time: '09:00',
    })
  }

  // Delete an event
  const handleDeleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId))
  }

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter((event) => isSameDay(new Date(event.date), date))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Calendar</h2>
        <div className="flex items-center space-x-4">
          <button onClick={handlePreviousMonth} className="p-2 hover:bg-gray-100 rounded-full">
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <h3 className="text-lg font-semibold">{format(currentDate, 'MMMM yyyy')}</h3>
          <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-full">
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="bg-gray-50 px-2 py-3 text-center text-sm font-semibold">
            {day}
          </div>
        ))}
        {daysInMonth.map((date) => {
          const dateEvents = getEventsForDate(date)
          const isToday = isSameDay(date, new Date())
          return (
            <div key={date.toISOString()} onClick={() => handleDateClick(date)} className="min-h-[120px] bg-white p-2 cursor-pointer hover:bg-gray-50">
              <div className={`font-medium text-sm ${isToday && 'text-blue-600'}`}>{format(date, 'd')}</div>
              {dateEvents.map((event) => (
                <div key={event.id} className={`flex items-center px-2 py-1 rounded-md text-xs border ${eventTypeColors[event.type]}`}>
                  <span className="mr-1">{eventTypeIcons[event.type]}</span>
                  <span className="truncate">{event.title}</span>
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
