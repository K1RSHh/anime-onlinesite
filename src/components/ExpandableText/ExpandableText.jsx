import { useState } from "react";
// eslint-disable-next-line
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

const ExpandableText = ({ text, maxLength = 300 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text || text.length <= maxLength) {
    return <p className="text-stone-300 leading-relaxed">{text}</p>;
  }

  return (
    <div className="relative">
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? "auto" : 100 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden text-stone-300 leading-relaxed relative"
      >
        <p className="text-lg/5">{text}</p>
      </motion.div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-sm  font-bold text-fuchsia-500 hover:text-fuchsia-300 flex items-center gap-1 transition-colors outline-none"
      >
        {isExpanded ? (
          <>
            Show Less <ChevronUp size={16} />
          </>
        ) : (
          <>
            Read More <ChevronDown size={16} />
          </>
        )}
      </button>
    </div>
  );
};

export default ExpandableText;
