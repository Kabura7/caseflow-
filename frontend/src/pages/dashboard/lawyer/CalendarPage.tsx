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
type EventType = 'court' | 'meeting' | 'call'
interface CalendarEvent {
  id: string
  date: string
  title: string
  type: EventType
  description: string
  time: string
}
const eventTypeIcons = {
  court: <GavelIcon className="h-4 w-4" />,
  meeting: <UsersIcon className="h-4 w-4" />,
  call: <PhoneIcon className="h-4 w-4" />,
}
const eventTypeColors = {
  court: 'bg-red-100 text-red-800 border-red-200',
  meeting: 'bg-blue-100 text-blue-800 border-blue-200',
  call: 'bg-green-100 text-green-800 border-green-200',
}
export const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date()
    const adjustedDate = new Date(today.getFullYear(), today.getMonth(), 16)
    return adjustedDate
  })
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    type: 'meeting',
    time: '09:00',
  })
  useEffect(() => {
    const savedEvents = localStorage.getItem('lawyerCalendarEvents')
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents))
    }
  }, [])
  useEffect(() => {
    localStorage.setItem('lawyerCalendarEvents', JSON.stringify(events))
  }, [events])
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  })
  const handlePreviousMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setNewEvent((prev) => ({
      ...prev,
      date: format(date, 'yyyy-MM-dd'),
    }))
    setIsAddEventOpen(true)
  }
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
  const handleDeleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId))
  }
  const getEventsForDate = (date: Date) => {
    return events.filter((event) => isSameDay(new Date(event.date), date))
  }
  const firstDayOfMonth = startOfMonth(currentDate)
  const startingDayOfWeek = firstDayOfMonth.getDay()
  const previousMonthDays =
    startingDayOfWeek > 0
      ? eachDayOfInterval({
          start: subMonths(firstDayOfMonth, 1),
          end: subMonths(firstDayOfMonth, 1),
        }).slice(-startingDayOfWeek)
      : []
  const lastDayOfMonth = endOfMonth(currentDate)
  const endingDayOfWeek = lastDayOfMonth.getDay()
  const nextMonthDays =
    endingDayOfWeek < 6
      ? eachDayOfInterval({
          start: addMonths(firstDayOfMonth, 1),
          end: addMonths(firstDayOfMonth, 1),
        }).slice(0, 6 - endingDayOfWeek)
      : []
  const allDays = [...previousMonthDays, ...daysInMonth, ...nextMonthDays]
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Calendar</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your schedule and appointments
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePreviousMonth}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <h3 className="text-lg font-semibold">
            {format(currentDate, 'MMMM yyyy')}
          </h3>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="bg-gray-50 px-2 py-3 text-center text-sm font-semibold"
          >
            {day}
          </div>
        ))}
        {allDays.map((date) => {
          const dateEvents = getEventsForDate(date)
          const isToday = isSameDay(date, new Date())
          const isCurrentMonth = isSameMonth(date, currentDate)
          return (
            <div
              key={date.toISOString()}
              onClick={() => handleDateClick(date)}
              className={`
                min-h-[120px] bg-white p-2 cursor-pointer hover:bg-gray-50
                ${!isCurrentMonth && 'text-gray-400'}
                ${isToday && 'bg-blue-50'}
              `}
            >
              <div
                className={`font-medium text-sm ${isToday && 'text-blue-600'}`}
              >
                {format(date, 'd')}
              </div>
              <div className="mt-1 space-y-1">
                {dateEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`
                      flex items-center px-2 py-1 rounded-md text-xs
                      border ${eventTypeColors[event.type]}
                    `}
                  >
                    <span className="mr-1">{eventTypeIcons[event.type]}</span>
                    <span className="truncate">{event.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
      <Dialog
        isOpen={isAddEventOpen}
        onClose={() => setIsAddEventOpen(false)}
        title="Add Event"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Event Title
            </label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
              value={newEvent.title || ''}
              onChange={(e) =>
                setNewEvent((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Event Type
            </label>
            <select
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
              value={newEvent.type}
              onChange={(e) =>
                setNewEvent((prev) => ({
                  ...prev,
                  type: e.target.value as EventType,
                }))
              }
            >
              <option value="meeting">Meeting</option>
              <option value="court">Court</option>
              <option value="call">Call</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Time
            </label>
            <input
              type="time"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
              value={newEvent.time}
              onChange={(e) =>
                setNewEvent((prev) => ({
                  ...prev,
                  time: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description (Optional)
            </label>
            <textarea
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
              rows={3}
              value={newEvent.description || ''}
              onChange={(e) =>
                setNewEvent((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setIsAddEventOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleAddEvent}
              className="px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-md"
            >
              Add Event
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
