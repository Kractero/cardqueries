import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Home } from "lucide-react";
import '../styles.css'
import { S1S2Card } from "../(components)/S1S2Card";
import { S3Card } from "../(components)/S3Card";

export default function Dev() {
    return (
        <main className="flex min-h-screen flex-col items-center p-12 max-w-7xl">
            <div className='mt-2 mb-10 text-center'>
                <h1 className="text-7xl my-2 tracking-tight">Card <span className='text-purple-700'>Queries</span></h1>
                <Link href="/"><Button className='rounded-md text-sm font-medium px-4 py-2 my-2'><Home /></Button></Link>
            </div>
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                Stack
            </h2>
            <div className="flex flex-wrap justify-center">
            <S1S2Card card={{
                badges: {}, description: "", trophies: {},
                cardcategory: "uncommon",
                category: "Frontend Framework",
                flag: "./NextJS.png",
                id: 2,
                motto: "The React Framework for the Web",
                name: "Next.js",
                region: "Vercel",
                season: 2,
                type: "React Framework"
            }} opt="Used by some of the world's largest companies, Next.js enables you to create full-stack Web applications by extending the latest React features, and integrating powerful Rust-based JavaScript tooling for the fastest builds." url="https://nextjs.org/" />
            <S1S2Card card={{
                badges: {}, description: "", trophies: {},
                cardcategory: "rare",
                category: "CSS Framework",
                flag: "./Tailwind.png",
                id: 3,
                motto: "Rapidly build modern websites without ever leaving your HTML.",
                name: "TailwindCSS",
                region: "Tailwind Labs",
                season: 2,
                type: "CSS Utility"
            }} opt="A utility-first CSS framework packed with classes like flex, pt-4, text-center and rotate-90 that can be composed to build any design, directly in your markup." url="https://tailwindcss.com/" />
            <S1S2Card card={{
                badges: {}, description: "", trophies: {},
                cardcategory: "legendary",
                category: "CSS Components",
                flag: "./Shadcn.png",
                id: 1,
                motto: "Build your component library.",
                name: "shadcn/ui",
                region: "shadcn",
                season: 2,
                type: "CSS Components"
            }} opt="Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source." url="https://ui.shadcn.com/" />
            </div>
            <div className="flex flex-wrap justify-center">
                <S1S2Card card={{
                badges: {}, description: "", trophies: {},
                cardcategory: "common",
                category: "SQL Database",
                flag: "./PostgreSQL.png",
                id: 4,
                motto: "The World's Most Advanced Open Source Relational Database.",
                name: "PostgreSQL",
                region: "PostgreSQL Group",
                season: 1,
                type: "Database"
            }} opt="PostgreSQL is a powerful, open source object-relational database system with over 35 years of active development that has earned it a strong reputation for reliability, feature robustness, and performance." url="https://www.postgresql.org/" />
            <S1S2Card card={{
                badges: {}, description: "", trophies: {},
                cardcategory: "rare",
                category: "Data Cache",
                flag: "./Redis.png",
                id: 5,
                motto: "A vibrant, open source database ",
                name: "Redis",
                region: "Redis Ltd",
                season: 1,
                type: "In-Memory Data Store"
            }} opt="The open source, in-memory data store used by millions of developers as a database, cache, streaming engine, and message broker." url="https://redis.io/" />
            <S1S2Card card={{
                badges: {}, description: "", trophies: {},
                cardcategory: "ultra-rare",
                category: "Web Framework",
                flag: "./FastAPI.png",
                id: 6,
                motto: "FastAPI framework, high performance, easy to learn, fast to code, ready for production",
                name: "FastAPI",
                region: "Tiangolo",
                season: 1,
                type: "Python Framework"
            }} opt="FastAPI is a modern, fast (high-performance), web framework for building APIs with Python 3.7+ based on standard Python type hints." url="https://fastapi.tiangolo.com/" />
            </div>
            <div className="flex flex-wrap justify-center">
            <S3Card card={{
                badges: {}, description: "", trophies: {},
                cardcategory: "rare",
                category: "Containers",
                flag: "./Docker.png",
                id: 7,
                motto: "Develop faster. Run anywhere.",
                name: "Docker",
                region: "Docker Inc",
                season: 3,
                type: "Virtualization"
            }} opt="Accelerate how you build, share, and run modern applications. Docker makes development efficient and predictable." url="https://www.docker.com/" />
            <S3Card card={{
                badges: {}, description: "", trophies: {},
                cardcategory: "epic",
                category: "Continuous Integration",
                flag: "./GithubActions.png",
                id: 8,
                motto: "Automate your workflow from idea to production",
                name: "GitHub Actions",
                region: "GitHub",
                season: 3,
                type: "Development Workflow"
            }} opt="GitHub Actions makes it easy to automate all your software workflows, now with world-class CI/CD." url="https://docs.github.com/en/actions" />
            <S3Card card={{
                badges: {}, description: "", trophies: {},
                cardcategory: "legendary",
                category: "Cloud Provider",
                flag: "./Hetzner.png",
                id: 9,
                motto: "Experience the Hetzner Cloud difference!.",
                name: "Hetzner",
                region: "Hetzner",
                season: 3,
                type: "Virtual Private Server"
            }} opt="A little money gets you lots of cloud. Flexible cloud servers with high-end-hardware." url="https://www.hetzner.com/" />
            </div>
            <p className="leading-7 [&:not(:first-child)]:mt-6">Credit to UPC/r3n for API inspiration.</p>
        </main>
    )
}