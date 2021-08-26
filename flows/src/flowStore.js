import React, { createContext, useContext } from "react";
import FlowContent from "./flowcontent";
import { SDK } from "./sdkInit";

class FlowStore {
  constructor() {
    this.isLoading = false;
    this.hasError = false;
    this.flow = null;
    this.error = null;
    this.onError = (error) => {
      this.setIsLoading(false);
      this.setHasError(true);
      this.setError(error.message);
      console.log(error);
    };
    this.executeFlow = async (value, state, flowID) => {
      console.log(value);
      try {
        const flowdata =
          state === "continue"
            ? await SDK.client.flow[state](flowID, value)
            : await SDK.client.flow[state](value);
        console.log(flowdata.data);
        return flowdata.data;
      } catch (error) {
        this.onError(error);
      }
    };
    this.onFlowInit = async (init, data) => {
      this.getData(init, data);
      try {
        this.setHasError(false);
        this.setIsLoading(true);
        // Ternary check if state = init => init state : continue state
        const response = init
          ? await this.executeFlow(data.instanceID, "init")
          : await this.executeFlow(data.values, "continue", data.id);
        this.setIsLoading(false);
        console.log(response);
        this.setFlow(response);
        return response;
      } catch (error) {
        this.onError(error);
      }
    };

    this.getData = async (init, data) => {
      try {
        // this.setHasError(false);
        // this.setIsLoading(true);
        // Ternary check if state = init => init state : continue state
        const response = init
          ? await this.executeFlow(data.instanceID, "init")
          : await this.executeFlow(data.values, "continue", data.id);
        // this.setIsLoading(false);
        console.log(response);
        return response;
        // this.setFlow(response);
      } catch (error) {
        this.onError(error);
      }
    };
    this.onFlowBackAction = async (ID) => {
      try {
        this.setHasError(false);
        this.setIsLoading(true);
        const response = await this.executeFlow(ID, "back");
        this.setIsLoading(false);
        this.setFlow(response);
      } catch (error) {
        this.onError(error);
      }
    };
  }
  setIsLoading(value) {
    this.isLoading = value;
  }
  setError(value) {
    this.error = value;
  }
  setHasError(value) {
    this.hasError = value;
  }
  setFlow(value) {
    this.flow = value;
  }
}
const flowContext = createContext(new FlowStore());
const FlowProvider = ({ store, children }) => {
  return React.createElement(flowContext.Provider, { value: store }, children);
};
const useFlow = () => {
  return useContext(flowContext);
};
export { FlowStore, FlowProvider, useFlow };
