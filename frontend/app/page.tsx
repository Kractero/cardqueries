"use client"

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { badges, flags, governments, trophies } from './(helpers)/categories'
import { trophiesDict } from './(helpers)/categories'
import { Dropdown } from './(components)/Dropdown'
import { ComboBox } from './(components)/ComboBox'
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import FormItem from './(components)/FormItem'
import { Clipboard, Trash } from 'lucide-react'
import { MultipleInput } from './(components)/MultipleInput'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { SingleInput } from './(components)/SingleInput'
import { Input } from '@/components/ui/input'

export default function Home() {

  const [queries, setQueries] = useState<string[]>([])
  const [collectionType, setCollectionType] = useState("Collection")
  const [render, setRender] = useState("Cards")
  const [route, setRoute] = useState(true)
  const [manualInput, setManualInput] = useState("")

  const router = useRouter()

  useEffect(() => {
    let queries = localStorage.getItem('queries')
    if (queries) setQueries(JSON.parse(queries))
  }, [])

  function multipleInputQueryBuilder(formData: FormData, formKey: FormDataEntryValue | null, iterableKeys: string[], queryString: string[], paramStr: string) {
    const keys = formKey ? iterableKeys.filter(key => {
      if (paramStr === 'category') return key.includes(paramStr.replace(/\d+$/, '').replace('!', '')) && !key.includes('card')
      else return key.includes(paramStr.replace(/\d+$/, '').replace('!', ''))}) : [];
    if (keys.length > 0) {
      let paramValues = [`${paramStr.includes('!') ? paramStr.replace('!', '') : paramStr}=`]
      for (const key of keys) {
        const value = (formData.get(key) as string)!.replaceAll(' ', '_').replace(paramStr, '').toLowerCase();
        if (value) paramValues.push(key.includes('!') || paramStr.includes('!') ? `!${value.toString()}` : value.toString())
      }
      queryString.push(paramValues.join(',').replace(',', ''))
    }
  }

  useEffect(() => {
    setManualInput("");
  }, [route]);

  async function makeRequest(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    let query = ["?"]

    const uniqueKeys: Set<string> = new Set();
    const uniqueEntries: [string, FormDataEntryValue][] = [];

    for (const [key, value] of Array.from(formData.entries())) {
      const baseKey = key.replace(/\d+$/, '').replace('!', '');
      if (!uniqueKeys.has(baseKey)) {
        uniqueKeys.add(baseKey);
        uniqueEntries.push([key, value]);
      }
    }
    if (route === true) {
      const keywords = ['season', 'region', 'badges', 'cardcategory', 'category', 'flag', 'motto', 'type', 'name'];
      for (const [key, value] of uniqueEntries) {
        if (value) {
          if (key === 'manual') {
            queries.unshift(value.toString())
            localStorage.setItem('queries', JSON.stringify(queries))
            setQueries(queries)
            router.push(`/query?${formData.get('manual')?.toString()}`)
            return
          }
          const iterableKeys = [...Array.from(formData.keys())]
          if (keywords.some(keyword => key.includes(keyword))) {
            if (key.includes('category') && key !== 'cardcategory') {
              multipleInputQueryBuilder(formData, formData.get('category'), iterableKeys, query, key.replace('!', ''));
            } else if (value !== 'all') {
              multipleInputQueryBuilder(formData, formData.get(key), iterableKeys, query, key.replace('!', ''));
            }
          }
          if (key === 'trophies') {
            const trophyKeys = value ? [...Array.from(formData.keys())].filter(key => key.includes('trophies') || key.includes('%')) : [];
            if (trophyKeys.length > 0) {
              let trophies = ["trophies="]
              for (const trophyKey of trophyKeys) {
                if (trophyKey.includes('trophies') && formData.get(trophyKey)) trophies.push(trophiesDict[formData.get(trophyKey)! as string].replaceAll(' ', '_'))
                if (trophyKey.includes('%') || trophyKey === '1t') trophies.push(`-${(formData.get(trophyKey) as string)}`)
              }
              query.push(trophies.join(',').replace(',', '').replaceAll(',-', '-'))
            }
          }
          if (key.includes(collectionType.toLowerCase())) multipleInputQueryBuilder(formData, formData.get(key.toLowerCase()), iterableKeys, query, key.toLowerCase());
          if (key === 'exnation') query.push(`exnation`)
        }
      }
    } else {
      for (const [key, value] of uniqueEntries) {
        if (value) {
          const iterableKeys = [...Array.from(formData.keys())]
          multipleInputQueryBuilder(formData, formData.get(key), iterableKeys, query, key.replace('!', ''));
        }
      }
    }
    let baseString = query.join('&').replace('&', '')
    queries.unshift(baseString)
    localStorage.setItem('queries', JSON.stringify(queries));
    setQueries(Array.from(queries))
    if (formData.get('mode') === 'on') baseString += "&mode=name"
    router.push(`/query${baseString}`)
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-12">
      <div className='mt-2 mb-2 text-center'>
        <h1 className="text-7xl my-2 mb-10 tracking-tight">Card <span className='text-purple-700'>Queries</span></h1>
        <Link className='h-full w-full' href="/docs"><Button className='rounded-md text-sm font-medium px-4 py-2 my-2'>Docs</Button></Link>
      </div>
      <div className="relative flex flex-col">
        <div className='flex justify-center gap-4 mb-5'>
          <Button onClick={() => setRoute(!route)} className={`${route === true ? "" : 'bg-primary/20 hover:bg-primary/40'} text-sm px-2 py-1`}>/cards</Button>
          <Button onClick={() => setRoute(!route)} className={`${route === false ? "" : 'bg-primary/20 hover:bg-primary/40'}`}>/collection</Button>
        </div>
        {route === true ?
          <form className='flex flex-col items-center' onSubmit={(e) => makeRequest(e)} name='card'>
            <p>Enter your query manually, or fill out the form.</p>
            <p className='mb-6 text-xs'>(IE: name=testlandia)</p>
            <Input className='mb-6 w-full' placeholder={"/card?"} name="manual" value={manualInput} onChange={(e) => setManualInput(e.target.value)} />
            <FormItem label='Filter Season'>
              <MultipleInput name='season' max={2} child={<Dropdown items={["All", "Season 1", "Season 2", "Season 3"]} defindex={0} />} />
            </FormItem>
            <FormItem label='Pick Trophies'>
              <MultipleInput name='trophies' max={trophies.length - 1} child={<ComboBox items={trophies} />} />
            </FormItem>
            <FormItem label='Pick Badges'>
              <MultipleInput name='badges' max={badges.length} child={<ComboBox items={badges} />} />
            </FormItem>
            <FormItem label='WA Category'>
              <MultipleInput name='category' max={governments.length - 1} child={<ComboBox items={governments} />} />
            </FormItem>
            <FormItem label='Rarity'>
              <MultipleInput name='cardcategory' max={6} child={<Dropdown items={["All", "Common", "Uncommon", "Rare", "Ultra-Rare", "Epic", "Legendary"]} defindex={0} />} />
            </FormItem>
            <FormItem label='Region'>
              <MultipleInput name='region' child={<SingleInput />} />
            </FormItem>
            <FormItem label='Ex-Nation? (s1 only)'>
              <div className='flex gap-2'>
                <input type="checkbox" id="exnation" name="exnation" />
                <label htmlFor="exnation">Ex-Nation</label>
              </div>
            </FormItem>
            <FormItem label='Flag'>
              <MultipleInput name='flag' max={flags.length - 1} child={<ComboBox items={flags} />} />
            </FormItem>
            <FormItem label='Motto'>
              <MultipleInput name='motto' child={<SingleInput />} />
            </FormItem>
            <FormItem label='Name'>
              <MultipleInput name='name' child={<SingleInput />} />
            </FormItem>
            <FormItem label='Type'>
              <MultipleInput name='type' child={<SingleInput />} />
            </FormItem>
            <div className='flex flex-col sm:grid sm:grid-cols-2 m-2 w-72 sm:w-96 gap-4 items-center justify-center'>
              <div className='flex items-center gap-4'>
                <Switch id="collection" onCheckedChange={() => setCollectionType(collectionType === 'Collection' ? 'Deck' : 'Collection')} />
                <Label htmlFor="collection">{collectionType}</Label>
              </div>
              <MultipleInput nullable={false} max={2} name={collectionType.toLowerCase()} child={<SingleInput />} />
            </div>
            <div className="flex flex-col gap-2 items-center mt-6">
              <Switch name="mode" id="mode" onCheckedChange={() => render === "Cards" ? setRender('Names') : setRender('Cards')} />
              <Label htmlFor="mode">{render}</Label>
            </div>
            <Button variant={"outline"}
              data-umami-event="Search Query" className="mt-6 transition duration-500 bg-purple-700 hover:bg-purple-500 border-none" type='submit'>Search</Button>
          </form>
          :
          <form className='flex flex-col items-center' onSubmit={(e) => makeRequest(e)} name='card'>
            <p>Enter your query manually, or fill out the form.</p>
            <p className='mb-6 text-xs'>(IE: collection=1,deck=testlandia)</p>
            <Input className='mb-6 w-full' placeholder={"/collection?"} name="manual" value={manualInput} onChange={(e) => setManualInput(e.target.value)} />
            <FormItem label='Collection'>
              <MultipleInput name='collection' nullable={false} child={<SingleInput />} />
            </FormItem>
            <FormItem label='Deck'>
              <MultipleInput name='deck' nullable={false} max={1} child={<SingleInput />} />
            </FormItem>
            <Button variant={"outline"}
              data-umami-event="Collection Query" className="mt-6 transition duration-500 bg-purple-700 hover:bg-purple-500 border-none" type='submit'>Search</Button>
          </form>
        }
      </div>
      <div className='flex flex-col mt-16 gap-4'>
        <p className='text-lg font-bold mb-2 text-center'>Previous Queries</p>
        {queries.map((query, i) => {
          return (
            <div key={query + i} className='grid-cols-[25px_auto_1fr] grid gap-4'>
              <Trash className='hover:cursor-pointer' onClick={() => {
                setQueries(prevQueries => prevQueries.filter((_, index) => index !== i));
                localStorage.setItem('queries', JSON.stringify(queries.filter((_, index) => index !== i)));
              }} />
              <Clipboard className='hover:cursor-pointer' onClick={() => navigator.clipboard.writeText(query)} />
              <a className='hover:text-purple-700 hover:cursor-pointer' data-umami-event="Viewed Previous Query"
                onClick={() => window.location.href = `/query${query}`}>{query.length > 45 ? query.slice(0, 45) + '...' : query}
              </a>
            </div>
          )
        })}
      </div>
      <img className='my-8' src='https://ucarecdn.com/8c89fbf7-f54f-4297-b569-f3fae95568d4/' />
      <Link href="/dev"><Button className='rounded-md text-sm font-medium px-4 py-2 my-2'>Stack</Button></Link>
    </main>
  )
}
