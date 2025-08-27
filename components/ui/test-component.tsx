import * as React from "react"
import { Button } from "./button"
import { Input } from "./input"

export function TestShadcnComponent() {
  return (
    <div className="p-4 space-y-4 border rounded-lg">
      <h2 className="text-lg font-semibold">Tailwind CSS + shadcn/ui Test</h2>
      <div className="space-y-2">
        <Button variant="default">Default Button</Button>
        <Button variant="outline">Outline Button</Button>
        <Button variant="ghost">Ghost Button</Button>
      </div>
      <Input placeholder="Test input with Tailwind styles" />
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-primary text-primary-foreground p-2 rounded">Primary</div>
        <div className="bg-secondary text-secondary-foreground p-2 rounded">Secondary</div>
        <div className="bg-accent text-accent-foreground p-2 rounded">Accent</div>
      </div>
    </div>
  )
}