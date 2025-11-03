"use client";

import { useState, useEffect } from "react";
import { format, isToday, startOfDay, addDays } from "date-fns";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateTimePickerProps {
  value?: string; // ISO string or empty
  onChange?: (value: string) => void; // ISO string
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

// Generate date options for the next 30 days
const generateDateOptions = () => {
  const options = [];
  for (let i = 0; i < 30; i++) {
    const date = addDays(new Date(), i);
    const value = format(date, "yyyy-MM-dd");
    const label =
      i === 0
        ? "Today"
        : i === 1
        ? "Tomorrow"
        : format(date, "MMM d, yyyy (EEEE)");
    options.push({ value, label });
  }
  return options;
};

// Generate time slots in 30-minute intervals from 8:00 AM to 6:00 PM
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 8; hour <= 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      if (hour === 18 && minute > 0) break; // Stop at 6:00 PM
      const timeString = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      const displayTime = format(new Date(0, 0, 0, hour, minute), "h:mm a");
      slots.push({ value: timeString, label: displayTime });
    }
  }
  return slots;
};

const dateOptions = generateDateOptions();
const timeSlots = generateTimeSlots();

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Select date and time",
  className = "",
  disabled = false,
}: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  // Parse the initial value
  useEffect(() => {
    if (value) {
      try {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          setSelectedDate(format(date, "yyyy-MM-dd"));
          setSelectedTime(format(date, "HH:mm"));
        }
      } catch (error) {
        console.warn("Invalid date value:", value);
      }
    } else {
      setSelectedDate("");
      setSelectedTime("");
    }
  }, [value]);

  // Update parent when date or time changes
  useEffect(() => {
    if (selectedDate && selectedTime && onChange) {
      const [hours, minutes] = selectedTime.split(":").map(Number);
      const dateTime = new Date(selectedDate);
      dateTime.setHours(hours, minutes, 0, 0);
      onChange(dateTime.toISOString());
    }
  }, [selectedDate, selectedTime]); // Removed onChange from dependencies to prevent infinite loop

  const formatDisplayValue = () => {
    if (!selectedDate || !selectedTime) return "";

    const dateOption = dateOptions.find((d) => d.value === selectedDate);
    const timeOption = timeSlots.find((t) => t.value === selectedTime);

    if (!dateOption || !timeOption) return "";

    const dateLabel = dateOption.label.includes("(")
      ? dateOption.label.split(" (")[0]
      : dateOption.label;

    return `${dateLabel} at ${timeOption.label}`;
  };

  const handleClear = () => {
    setSelectedDate("");
    setSelectedTime("");
    onChange?.("");
    setIsOpen(false);
  };

  const handleConfirm = () => {
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={`
            w-full h-14 px-4 flex items-center text-left font-normal rounded-2xl
            border border-white/10 bg-[#2D2A27] text-white hover:bg-[#2D2A27]/80
            ${!value && "text-white/60"}
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            ${className}
          `}
        >
          <Calendar className="mr-3 h-4 w-4 flex-shrink-0" />
          <span className="flex-1 text-left">
            {formatDisplayValue() || placeholder}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0 bg-[#2D2A27] border-white/10"
        align="start"
      >
        <div className="p-4 space-y-4">
          {/* Date Picker */}
          <div>
            <h4 className="text-sm font-medium text-white/80 mb-2">
              Select Date
            </h4>
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger className="w-full h-10 rounded-lg border border-white/10 bg-[#1F1E1C] text-white">
                <SelectValue placeholder="Choose a date" />
              </SelectTrigger>
              <SelectContent className="bg-[#1F1E1C] text-white border-white/10 max-h-60">
                {dateOptions.map((date) => (
                  <SelectItem
                    key={date.value}
                    value={date.value}
                    className="cursor-pointer transition-colors hover:bg-[#FF8500]/20 focus:bg-[#FF8500]/25 hover:text-white focus:text-white"
                  >
                    {date.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Picker */}
          {selectedDate && (
            <div>
              <h4 className="text-sm font-medium text-white/80 mb-2">
                Select Time
              </h4>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger className="w-full h-10 rounded-lg border border-white/10 bg-[#1F1E1C] text-white">
                  <SelectValue placeholder="Choose a time" />
                </SelectTrigger>
                <SelectContent className="bg-[#1F1E1C] text-white border-white/10 max-h-60">
                  {timeSlots.map((slot) => (
                    <SelectItem
                      key={slot.value}
                      value={slot.value}
                      className="cursor-pointer transition-colors hover:bg-[#FF8500]/20 focus:bg-[#FF8500]/25 hover:text-white focus:text-white"
                    >
                      {slot.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="black"
              onClick={handleClear}
              className="flex-1 h-9 border-white/20 bg-transparent text-white/70 hover:bg-white/10 hover:text-white"
            >
              Clear
            </Button>
            <Button
              variant="orange"
              onClick={handleConfirm}
              disabled={!selectedDate || !selectedTime}
              className="flex-1 h-9"
            >
              Confirm
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
