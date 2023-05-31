"use client"
import Navigation from "@/components/dashboard/Navigation";
import  { Suspense } from "react"
import Loading from "./loading";
import { motion } from "framer-motion";

export default function DashboardLayout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode;
  }) {
    return (
      <section>
          <motion.div
            initial={{opacity: 0}}
            animate={{ opacity:1 }}
            transition={{ delay: 1, stiffness: ""}}
          >
            <Navigation />
            <main className="pl-[330px] bg-[#fafbff] min-h-[100vh]">
                {children}
            </main>
          </motion.div>
      </section>
    );
  }