import { Input } from "@/components/ui/input"

interface Props { name?: string, include?: boolean }

export function SingleInput({ name, include }: Props) {
    return (
        <Input name={include ? name : `!${name}`} className={`w-[180px] ${include ? '' : 'border-red-600'}`} />
    )
}