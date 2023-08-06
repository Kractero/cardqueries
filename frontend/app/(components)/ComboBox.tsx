"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface Props { items: string[], name?: string, include?: boolean }

export function ComboBox({ items, name, include }: Props) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")

    return (
        <>
            <input className="hidden" name={include ? name : `!${name}`} value={value} type="hidden" />
            <div className="flex flex-col gap-2">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={`w-[180px] justify-between button ${include ? '' : 'border-red-600'}`}
                        name={include ? name : `!${name}`}
                    >
                        {value
                            ? items.find(item => item.toLowerCase() === value)
                            : `No ${name && name.replace(/\d/g, "")}`}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[180px] p-0">
                    <Command>
                        <CommandInput name={include ? name : `!${name}`} placeholder={`Search ${name}...`} />
                        <CommandEmpty>No {name} found.</CommandEmpty>
                        <CommandGroup>
                            {items.map((item) => (
                                <CommandItem
                                    key={item}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === item ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {item.replace(/\d/g, "")}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
            {name?.includes("trophies") && value && value !== "Sans" && !value.includes('!') && include && <>
                <RadioGroup className="flex" defaultValue="" name={`${include ? value : `!${value}`}%`}>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1t" id="1st" />
                        <Label htmlFor="1st">1t</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1" id="1percent" />
                        <Label htmlFor="1percent">1%</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="5" id="5percent" />
                        <Label htmlFor="5percent">5%</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="10" id="10percent" />
                        <Label htmlFor="10percent">10%</Label>
                    </div>
                </RadioGroup>
            </>}
            </div>
        </>
    )
}
