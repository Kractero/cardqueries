import { Query } from "./query";

export const metadata =  {
    title: `Card Queries - Query`,
    description: "Card Queries"
}

export default function QueryPage() {
    return (
        <main className="flex min-h-screen flex-col items-center p-12">
            <div className='mt-2 mb-10 text-center'>
                <h1 className="text-7xl my-2 tracking-tight">Card <span className='text-purple-700'>Queries</span></h1>
            </div>
            <Query />
        </main>
    )
}