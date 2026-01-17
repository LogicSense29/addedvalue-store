'use-client'
import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";

function Logo() {
  return (
    <Link
      href='/'
      className='relative text-xl sm:text-2xl lg:text-3xl font-semibold flex items-center text-slate-700'>
      <span className=''>AddedValue</span>
      <span className='text-sm mr-1 self-start'>.store</span>

      <Image src={assets.logo} className='w-7 sm:w-10' />
    </Link>
  );
}

export default Logo;


// 'use-client'
// import { assets } from "@/assets/assets";
// import Image from "next/image";
// import Link from "next/link";

// function Logo() {
//   return (
//     <Link
//       href='/'
//       className='relative text-2xl lg:text-3xl font-semibold flex items-center text-slate-700'>
//       {/* <span className='text-green-600'>go</span>cart
//               <span className='text-green-600 text-5xl leading-0'>.</span>
//               <p className='absolute text-xs font-semibold -top-1 -right-8 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-green-500'>
//                 plus
//               </p> */}
//       <span className=''>AddedValue</span>
//       <span className='text-sm mr-1 self-start'>.store</span>
//       {/* <span className='text-green-600 text-5xl leading-0'>.</span>store */}

//       <Image src={assets.logo} className='w-10' />
//     </Link>
//   );
// }

// export default Logo