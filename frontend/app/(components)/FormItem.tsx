import { ReactNode } from "react";

export default function FormItem({ children, label }: { children: ReactNode, label: string }) {
    return (
        <div className='flex flex-col sm:grid sm:grid-cols-2 m-2 w-72 sm:w-96 gap-4 items-center'>
            <p>{label}</p>
            {children}
        </div>
    )
}