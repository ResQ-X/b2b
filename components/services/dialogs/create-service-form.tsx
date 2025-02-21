"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  service_name: z.string().min(2, "Name must be at least 2 characters"),
  unit_price: z.number().min(0, "Unit price must be a positive number"),
  delivery_price: z.number().min(0, "Delivery price must be a positive number"),
  service_price: z.number().min(0, "Service price must be a positive number"),
})

export function CreateServiceForm({
  onSubmit,
}: {
  onSubmit: (data: {
    service_name: string
    unit_price: number
    delivery_price: number
    service_price: number
  }) => Promise<void>
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      service_name: "",
      unit_price: 0,
      delivery_price: 0,
      service_price: 0,
    },
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => onSubmit(data))}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="service_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="unit_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit Price (₦)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="delivery_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Delivery Price (₦)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="service_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Price (₦)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="submit" className="bg-orange hover:bg-orange/90">
            Create Service
          </Button>
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}