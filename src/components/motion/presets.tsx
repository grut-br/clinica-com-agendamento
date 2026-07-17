"use client";

import type { ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/cn";

export const fadeVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, y: 4, transition: { duration: 0.14, ease: "easeIn" } },
};

export const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.14, ease: "easeIn" } },
};

export const slideVariants: Variants = {
  hidden: { opacity: 0, x: 12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.22, ease: "easeOut" } },
  exit: { opacity: 0, x: 8, transition: { duration: 0.16, ease: "easeIn" } },
};

const motionProps = {
  initial: "hidden",
  animate: "visible",
  exit: "exit",
  viewport: { once: true, amount: 0.15 },
};

export function Fade({ children, className }: { children: ReactNode; className?: string }) {
  return <motion.div {...motionProps} variants={fadeVariants} className={cn(className)}>{children}</motion.div>;
}

export function Scale({ children, className }: { children: ReactNode; className?: string }) {
  return <motion.div {...motionProps} variants={scaleVariants} className={cn(className)}>{children}</motion.div>;
}

export function PageTransition({ children, className }: { children: ReactNode; className?: string }) {
  return <motion.div {...motionProps} variants={fadeVariants} className={cn(className)}>{children}</motion.div>;
}

export function DialogMotion({ children, className }: { children: ReactNode; className?: string }) {
  return <motion.div {...motionProps} variants={scaleVariants} className={cn(className)}>{children}</motion.div>;
}

export function TooltipMotion({ children, className }: { children: ReactNode; className?: string }) {
  return <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.15, ease: "easeOut" }} className={cn(className)}>{children}</motion.div>;
}

export function AccordionMotion({ children, className }: { children: ReactNode; className?: string }) {
  return <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18, ease: "easeOut" }} className={cn(className)}>{children}</motion.div>;
}

export function TabsMotion({ children, className }: { children: ReactNode; className?: string }) {
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.18, ease: "easeOut" }} className={cn(className)}>{children}</motion.div>;
}

export function HoverScale({ children, className }: { children: ReactNode; className?: string }) {
  return <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} transition={{ duration: 0.15, ease: "easeOut" }} className={cn(className)}>{children}</motion.div>;
}
