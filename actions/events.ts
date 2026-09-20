"use server"

import { eventsStore, type CalendarEvent } from "@/lib/events-store"
import { getGoogleEvents } from "@/lib/google-calendar"

export async function getEvents(): Promise<CalendarEvent[]> {
  // Live events from the public Google Calendar. No local fallback: the old
  // seed data (2025 dates) misleads once the calendar is the source of truth.
  return getGoogleEvents()
}

export async function addEvent(
  data: Omit<CalendarEvent, "id">,
): Promise<{ success: boolean; event?: CalendarEvent; error?: string }> {
  try {
    if (!data.title?.trim() || !data.date?.trim()) {
      return { success: false, error: "Title and date are required." }
    }
    const event = eventsStore.add({
      title: data.title.trim(),
      date: data.date.trim(),
      time: data.time?.trim() || "TBD",
      location: data.location?.trim() || "TBD",
      category: data.category || "community",
      description: data.description?.trim() || "",
    })
    return { success: true, event }
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to add event." }
  }
}

export async function updateEvent(
  id: string,
  data: Partial<Omit<CalendarEvent, "id">>,
): Promise<{ success: boolean; event?: CalendarEvent; error?: string }> {
  try {
    const event = eventsStore.update(id, data)
    if (!event) {
      return { success: false, error: "Event not found." }
    }
    return { success: true, event }
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update event." }
  }
}

export async function deleteEvent(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const removed = eventsStore.remove(id)
    if (!removed) {
      return { success: false, error: "Event not found." }
    }
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete event." }
  }
}
