import ButtonSpinner, { Pageloader } from "@/components/utils/buttonSpinner";
import PageLoader from "next/dist/client/page-loader";

export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
        <div className="flex flex-col items-center">
           <Pageloader />
            <div className="text-[#4873eb99] mt-2 animate-ping text-xl font-extrabold">FLUTTERCURVE<span className="text-[#4b56f572]">.COM</span></div>
        </div>
    );
  }