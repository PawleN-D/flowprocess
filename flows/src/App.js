import React, { useState, useEffect } from "react";
import { FlowProvider, FlowStore } from "./flowStore.js";
import { SDK } from "./sdkInit";

import FlowContent from "./flowcontent";
import "./App.css";

function App() {
  const credentials = {
    appKey: "D167BC13-0848-4A8A-9823-9D8B9DACE899",
    secret: "xs4crm@iris",
  };
  SDK.client.auth.appLogin(credentials).then((res) => {
    console.log("Done");
  });

  const flowStore = new FlowStore();
  console.log();
  const instanceID = "BP_Reparatieverzoek";

  useEffect(() => {
    const fetchData = async () => {
      if (instanceID) {
        await flowStore.onFlowInit(true, {
          instanceID: instanceID,
          values: [{}],
        });
      }
    };
    fetchData();
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

  return (
    <FlowProvider store={flowStore}>
      <div className="App">
        <FlowContent
        //initFlow={initFlow}
        // token={token}
        // flow={"BP_Reparatieverzoek"}
        // continueFlow={continueFlow}
        />
      </div>
    </FlowProvider>
  );
}

export default App;
