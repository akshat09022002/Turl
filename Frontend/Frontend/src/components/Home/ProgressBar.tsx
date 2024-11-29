import { Progress } from "@/components/ui/progress";
import React, { useEffect, useState } from "react";

const ProgressBar = ({
  setState,
  urlResult,
  pauseTimer,
}: {
  setState: React.Dispatch<React.SetStateAction<string>>;
  urlResult: string;
  pauseTimer: boolean;
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (pauseTimer) {
      if (intervalId) clearInterval(intervalId);
    } else {
      setProgress(0);
      const duration = 30000;
      const interval = 100;
      const step = (100 / duration) * interval;

      intervalId = setInterval(() => {
        setProgress((prev: number) => {
          if (prev >= 100) {
            if (intervalId) clearInterval(intervalId);
            setState("");
            return 100;
          }
          return prev + step;
        });
      }, interval);

      return () => {
        if (intervalId) clearInterval(intervalId);
      };
    }
  }, [urlResult, pauseTimer]);

  return (
    <div className=" w-full rounded-md absolute top-[0.5px] px-1 left-0">
      <Progress
        value={progress}
        className="bg-[#3a1d87] h-[2px] sm:h-1 rounded-md"
      />
    </div>
  );
};

export default ProgressBar;
