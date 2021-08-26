import { useState, useEffect } from "react";
import { FlowStore } from "./flowStore";

export default function useFlow() {
  const [data, setData] = useState();
  const flowStore = new FlowStore();
  const flw = flowStore.flow;

  useEffect(() => {
    if (flw) {
      setData(flw);
    }
  }, [flw]);
  return data;
}
