import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
interface Props { items: string[], name?: string, defindex: number, include?: boolean }

export function Dropdown({ items, name, defindex, include }: Props) {
    return (
        <Select name={include ? name : `!${name}`}>
            <SelectTrigger className={`w-[180px] ${include ? '' : 'border-red-600'}`}>
                <SelectValue placeholder={items[defindex]} />
            </SelectTrigger>
            <SelectContent>
                {items.map(item => {
                    return <SelectItem key={item} value={item.replace('Season ', '').toLowerCase()}>{item}</SelectItem>
                })}
            </SelectContent>
        </Select>
    )
}