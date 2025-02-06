"use client"

import { Bell, Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth.context"

export function DashboardNav() {
  const { user } = useAuth()

  return (
    <div className="h-16 bg-white px-8 flex items-center justify-between">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-brown" />
          <Input placeholder="Search..." className="pl-10 bg-lighter h-[38px] rounded-[19px] border-none" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-orange text-[10px] text-white flex items-center justify-center">
            6
          </span>
        </Button>

        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-orange text-white flex items-center justify-center text-sm font-medium">
            EA
          </div>
          <div>
            <p className="text-[14px] text-dark-brown font-medium">{user?.name}</p>
            <p className="text-xs text-[#565656]">Admin</p>
          </div>
        </div>
      </div>
    </div>
  )
}

