"use client"
import Navigation from "@/components/dashboard/Navigation";
import  { Suspense } from "react"
import Loading from "./loading";
import { motion } from "framer-motion";
import Router from "next/router";

export default function DashboardLayout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode;
  }) {


    return (
      <>
        <section>
          <motion.div
            initial={{opacity: 0}}
            animate={{ opacity:1 }}
            transition={{ delay: 1, stiffness: ""}}
          >
            <main className="xxl:pl-[330px] xl:pl-[300px] pl-0 bg-[#fafbff] min-h-[100vh]">
                {children}
            </main>
          </motion.div>
      </section>
      </>
    );
  }
