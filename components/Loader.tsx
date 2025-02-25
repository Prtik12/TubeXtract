"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SimpleLoader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Remove everything after 3 seconds
    const timeout = setTimeout(() => setShow(false), 3000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black flex items-center justify-center z-50"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            TubeXtract
          </motion.h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
