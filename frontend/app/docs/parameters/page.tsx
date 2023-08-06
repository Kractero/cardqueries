import { badges, flags, governments, trophiesDict } from "@/app/(helpers)/categories";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

export default function Parameters() {
    return (
        <main className="flex min-h-screen flex-col items-center p-12">
                        <div className='mt-2 mb-10 text-center'>
                <h1 className="text-7xl my-2 tracking-tight">Card <span className='text-purple-700'>Queries</span></h1>
                <div className="flex justify-center gap-2">
                    <Link href="/"><Button className='rounded-md text-sm font-medium px-4 py-2 my-2'><Home /></Button></Link>
                    <Link href="/docs"><Button className='rounded-md text-sm font-medium px-4 py-2 my-2'><ArrowLeft /></Button></Link>
                </div>
            </div>
        <div>
            <h2 className="scroll-m-20 border-b text-3xl font-semibold tracking-tight transition-colors first:mt-0 mb-4">
                Valid Parameters
            </h2>
            <p className="ml-6 mb-2">Possible Badges:</p>
            <ul className="ml-6 mb-4 list-disc [&>li]:mt-2 [&>li]:ml-4 [&>li]:text-sm">
                <li>Sans</li>
                {badges.slice(2).map(badge => <li key={badge}>{badge}</li>)}
            </ul>
            <p className="ml-6 mb-2">Possible Trophies:</p>
            <ul className="ml-6 mb-4 list-disc [&>li]:mt-2 [&>li]:ml-4 [&>li]:text-sm">
                {Object.entries(trophiesDict).sort().map(([key, value]) => {
                    const formattedKey = key.split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                        .join(' ');
                    return (
                        <li className="grid grid-cols-2" key={formattedKey}>
                            <p>{formattedKey}</p>
                            <p>-&gt; <span className="font-bold">{value}</span></p>
                        </li>
                    );
                })}
            </ul>
            <p className="ml-6 mb-2">Possible Categories:</p>
            <ul className="ml-6 mb-4 list-disc [&>li]:mt-2 [&>li]:ml-4 [&>li]:text-sm">
                {governments.map(government => <li key={government}>{government}</li>)}
            </ul>
            <p className="ml-6 mb-2">Possible Flags:</p>
            <ul className="ml-6 mb-4 list-disc [&>li]:mt-2 [&>li]:ml-4 [&>li]:text-sm">
                {flags.map(flag => <li key={flag}>{flag}</li>)}
            </ul>
        </div>
        </main>
    )
}