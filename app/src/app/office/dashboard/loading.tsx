import ButtonSpinner from "@/components/utils/buttonSpinner";

export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
      <div className="w-full transition-all duration-300 min-h-[100vh] fixed top-0 left-0 bg-[url(/gradient.svg)] bg-[100%] bg-cover bg-no-repeat flex justify-center items-center">
           <div className="flex flex-col items-center">
           <ButtonSpinner />
          <div className="text-[#4873eb99] mt-2 animate-ping text-2xl font-extrabold">FLUTTERCURVE<span className="text-[#4b56f572]">.COM</span></div>
           </div>
      </div>
    );
  }