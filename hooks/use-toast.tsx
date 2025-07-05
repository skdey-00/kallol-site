"use client"

import * as React from "react"

type ToastType = {
  id: string
  title: string
  description?: string
  variant?: "default" | "success" | "error" | "warning"
}

type ToastContextType = {
  toasts: ToastType[]
  toast: (toast: Omit<ToastType, "id">) => void
  dismiss: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastType[]>([])

  const toast = React.useCallback(({ title, description, variant = "default" }: Omit<ToastType, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { id, title, description, variant }
    setToasts((prev) => [...prev, newToast])

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }, [])

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return <ToastContext.Provider value={{ toasts, toast, dismiss }}>{children}</ToastContext.Provider>
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export function Toaster() {
  const { toasts, dismiss } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-lg shadow-lg p-4 min-w-[300px] max-w-md animate-in slide-in-from-right-full ${
            toast.variant === "success"
              ? "bg-green-100 border border-green-200"
              : toast.variant === "error"
                ? "bg-red-100 border border-red-200"
                : toast.variant === "warning"
                  ? "bg-yellow-100 border border-yellow-200"
                  : "bg-white border border-gray-200"
          }`}
        >
          <div className="flex justify-between items-start">
            <h3
              className={`font-medium ${
                toast.variant === "success"
                  ? "text-green-800"
                  : toast.variant === "error"
                    ? "text-red-800"
                    : toast.variant === "warning"
                      ? "text-yellow-800"
                      : "text-gray-900"
              }`}
            >
              {toast.title}
            </h3>
            <button onClick={() => dismiss(toast.id)} className="text-gray-500 hover:text-gray-700" aria-label="Close">
              &times;
            </button>
          </div>
          {toast.description && (
            <p
              className={`text-sm mt-1 ${
                toast.variant === "success"
                  ? "text-green-700"
                  : toast.variant === "error"
                    ? "text-red-700"
                    : toast.variant === "warning"
                      ? "text-yellow-700"
                      : "text-gray-700"
              }`}
            >
              {toast.description}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
