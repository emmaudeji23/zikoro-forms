 
import { Form } from "lucide-react";
import Link from "next/link";

 

export default function Page() {
  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col justify-center text-xl items-center mx-auto gap-4 leading-loose">
         <Link 
          href={'/form-one'}
          className="border p-6 rounded-md bg-primary text-white flex flex-col gap-4 "
         >
          Click here to preview the first form
           <Form size={32}/>
         
         </Link>
      </div>
    </div>
  )
}
