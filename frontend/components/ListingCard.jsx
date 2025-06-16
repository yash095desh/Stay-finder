import React from 'react'
import { Card, CardContent } from './ui/card'
import Image from 'next/image'
import { Bath, BedDouble, Send, Wifi } from 'lucide-react'
import { Button } from './ui/button'
import Link from 'next/link'

const ListingCard = ({data}) => {
  return (
    <Card className={" w-full max-w-sm"}>
        <CardContent className={' flex flex-col gap-2 flex-start'}>
            <div className="relative w-full h-40 rounded-xl overflow-hidden">
                <Image
                src={data.images[0]}
                alt="listing thumbnail"
                fill
                className="object-cover "
                />
            </div>
            <div>
                <h1 className='font-bold tracking-tighter text-xl truncate mt-4'>{data.title}</h1>
                <p className="text-medium tracking-tighter">{data?.location.city} , {data?.location?.country}</p>
            </div>
            <div className='flex items-center justify-between '>
                <div className=' flex items-center gap-2 '>
                    <BedDouble className=' size-4 text-muted-foreground'/>
                    <span className='text-muted-foreground font-semibold text-sm'>2 Bed</span>
                </div>
                <div className=' flex items-center gap-2'>
                    <Bath className=' size-4 text-muted-foreground'/>
                    <span className='text-muted-foreground font-semibold text-sm'>2 Bath</span>
                </div>
                <div className=' flex items-center gap-2'>
                    <Wifi className=' size-4 text-muted-foreground'/>
                    <span className='text-muted-foreground font-semibold text-sm'>Free Wifi</span>
                </div>
            </div>
            <p className='text-sm text-tight tracking-tight text-foreground-muted line-clamp-4 my-2'>{data.description}</p>
            <Button className={' w-full py-6 bg-blue-600 hover:bg-blue-400 text-white font-semibold text-lg' }>
                <Link href={"/listing/:id"} className=' flex items-center gap-2'>
                    <Send className='size-5 mr-2'/>
                    <span className=''> Visit</span>
                </Link>
            </Button>
        </CardContent>
    </Card>
  )
}

export default ListingCard