"use client"

import * as React from "react"
import { X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "compliance-veritas/src/components/ui/command.tsx"
import { Command as CommandPrimitive } from "cmdk"

type Framework = Record<"value" | "label", string>;

export function MultiSelect({
    options,
    selected,
    onChange,
    placeholder = "Select options..."
} : {
    options: Framework[],
    selected: string[],
    onChange: React.Dispatch<React.SetStateAction<string[]>>,
    placeholder?: string
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  const handleUnselect = React.useCallback((framework: Framework) => {
    onChange(prev => prev.filter(s => s !== framework.value))
  }, [onChange])

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            const newSelected = [...selected]
            newSelected.pop()
            onChange(newSelected)
          }
        }
        if (e.key === "Escape") {
          input.blur()
        }
      }
    }, [onChange, selected])

  const selectables = options.filter(framework => !selected.includes(framework.value));

  return (
    <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
      <div
        className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
      >
        <div className="flex flex-wrap gap-1">
          {selected.map(value => {
            const framework = options.find(f => f.value === value)
            if (!framework) return null;
            return (
              <Badge key={framework.value} variant="secondary">
                {framework.label}
                <button
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      handleUnselect(framework)
                    }
                  }}
                  onMouseDown={e => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onClick={() => handleUnselect(framework)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            )
          })}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && selectables.length > 0 ?
          <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
<CommandList>
              <CommandGroup heading="Suggestions">
                {selectables.map(framework => (
                    <CommandItem
                    key={framework.value}
                    onMouseDown={(e: { preventDefault: () => void; stopPropagation: () => void }) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    onSelect={() => {
                        setInputValue("")
                        onChange(prev => [...prev, framework.value])
                    }}
                    className={"cursor-pointer"}
                    >
                    {framework.label}
                    </CommandItem>
                ))}
                </CommandGroup>
            </CommandList>
          </div>
        : null}
      </div>
    </Command>
  )
}
