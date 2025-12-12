"use client";
import Image from "next/image";
import { Icon } from "@iconify/react";
// import background from "@/public/images/auth/line.png";
import background from "@/public/images/auth/mountain.png"
import RegForm from "./reg-form";

// const RegPage = () => {
//   const [openVideo, setOpenVideo] = useState(false);
//   return (
//     <>
//       <div className="min-h-screen bg-background  flex items-center  overflow-hidden w-full">
//         <div className="min-h-screen basis-full flex flex-wrap w-full  justify-center overflow-y-auto">
//           <div
//             className="basis-1/2 bg-primary w-full  relative hidden xl:flex justify-center items-center bg-gradient-to-br
//           from-primary-600 via-primary-400 to-primary-600">
//             <Image
//               src={background}
//               alt="image"
//               className="absolute top-0 left-0 w-full h-full "
//             />
//             <div className="relative z-10 backdrop-blur bg-primary-foreground/40 py-14 px-16 2xl:py-[84px] 2xl:pl-[50px] 2xl:pr-[136px] rounded max-w-[640px]">
//               <div>
//                 <Button
//                   className="bg-transparent hover:bg-transparent h-fit w-fit p-0"
//                   onClick={() => setOpenVideo(true)}
//                 >
//                   <Icon
//                     icon="heroicons:play-solid"
//                     className="text-primary-foreground h-[78px] w-[78px] -ml-2"
//                   />
//                 </Button>

//                 <div className="text-4xl leading-[50px] 2xl:text-6xl 2xl:leading-[72px] font-semibold mt-2.5">
//                   <span className="text-default-600 dark:text-default-300 ">
//                     Unlock <br />
//                     Your Project <br />
//                   </span>
//                   <span className="text-default-900 dark:text-default-50">
//                     Performance
//                   </span>
//                 </div>
//                 <div className="mt-5 2xl:mt-8 text-default-900 dark:text-default-200  text-2xl font-medium">
//                   You will never know everything. <br />
//                   But you will know more...
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className=" min-h-screen basis-full md:basis-1/2 w-full px-4 py-5 flex justify-center items-center">
//             <div className="lg:w-[480px] ">
//               <RegForm />
//             </div>
//           </div>
//         </div>
//       </div>
//       <Dialog open={openVideo}>
//         <DialogContent size="lg" className="p-0" hiddenCloseIcon>
//           <Button
//             size="icon"
//             onClick={() => setOpenVideo(false)}
//             className="absolute -top-4 -right-4 bg-default-900"
//           >
//             <X className="w-6 h-6" />
//           </Button>
//           <iframe
//             width="100%"
//             height="315"
//             src="https://www.youtube.com/embed/8D6b3McyhhU?si=zGOlY311c21dR70j"
//             title="YouTube video player"
//             frameBorder="0"
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//             allowFullScreen 
//           ></iframe>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default RegPage;

const RegisterPage = () => {

  return (
    <div className="loginwrapper bg-card flex items-center min-h-screen overflow-hidden w-full">
      <div className="lg-inner-column  flex w-full flex-wrap justify-center lg:justify-end overflow-y-auto py-10">
        <Image src={background} alt="image" className="absolute top-0 left-0 w-full h-full" />
        <div className="basis-full lg:basis-1/2 w-full  flex justify-end items-center relative lg:pr-12 xl:pr-20 2xl:pr-[110px] px-5">
          <div className="w-full md:w-[440px] xl:w-[570px]  px-5 py-7 md:p-10 lg:p-16  bg-background rounded-xl">
            <RegForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
