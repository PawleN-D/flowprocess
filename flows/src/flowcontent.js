import React, { useState, useEffect } from "react";
import { FlowStore } from "./flowStore.js";
import { SDK } from "./sdkInit";
import useFlow from "./hook.js";

function FlowContent(props) {
  const flowStore = new FlowStore();
  const [data, setData] = useState(flowStore.flow);

  const credentials = {
    appKey: "D167BC13-0848-4A8A-9823-9D8B9DACE899",
    secret: "xs4crm@iris",
  };
  SDK.client.auth.appLogin(credentials).then((res) => {
    console.log("Done");
  });

  const instanceID = "BP_Reparatieverzoek";
  const flow1 = useFlow();

  useEffect(() => {
    console.log(flow1);
  });

  useEffect(() => {
    console.log("Hie");
    console.log(flow1);
  }, [flow1]);

  useEffect(() => {
    if (instanceID)
      flowStore.onFlowInit(true, { instanceID: instanceID, values: [{}] });
  }, [instanceID]);

  const backFlow = (id, screen) => {
    flowStore.onFlowBackAction(id);
  };
  const initValues = (elements) => {
    var obj = Object.fromEntries(
      elements !== null && elements !== undefined
        ? elements.map((e) => {
            return [e.data.outputKey, ""];
          })
        : []
    );
    delete obj["undefined"];
    delete obj["/"];
    return obj ? obj : {};
  };
  // const [theArrayOfObjects, setTheArrayOfObjects] flow= useState("");
  // const elements = flowStore.flow;
  // console.log(elements);

  return (
    <div key="flow-contanier">
      <div className="tempcont">Hello</div>
    </div>
  );
}

export default FlowContent;
