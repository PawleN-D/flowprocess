import { makeAutoObservable } from "mobx";
import React, { createContext, useContext, FC } from "react";
import { Flow } from "./models";
import { SDK } from "../../../network/sdk";
class FlowStore {
    isLoading: boolean = false
    hasError: boolean = false
    flow: Flow | null = null;
    error: string | null = null;
    constructor() {
        makeAutoObservable(this);
    }
    setIsLoading(value: boolean) {
        this.isLoading = value;
    }
    setError(value: string) {
        this.error = value;
    }
    setHasError(value: boolean) {
        this.hasError = value;
    }
    setFlow(value: Flow) {
        this.flow = value;
    }
    onError = (error:any) => {
        this.setIsLoading(false);
        this.setHasError(true);
        this.setError(error.message)
        console.log(error);
    }
    executeFlow = async (value:any, state:'init' | 'continue' | 'back', flowID?:any) => {
        console.log(value)
        try {
            const flowdata:any = state=='continue'? await SDK.client.flow[state](flowID, value): await SDK.client.flow[state](value)   
            console.log(flowdata)                                         
            return flowdata.data              
        } catch (error:any) {
                this.onError(error)  
        }
    }
    onFlowInit = async (init: boolean, data: { instanceID?: string, id?: number, values: any }) => {
        try {  
            this.setHasError(false);
            this.setIsLoading(true);
            // Ternary check if state = init => init state : continue state 
            const response = init? await this.executeFlow(data.instanceID, 'init'): await this.executeFlow(data.values, 'continue', data.id)
            this.setIsLoading(false);
            this.setFlow(response);
        } catch (error:any) {
            this.onError(error)            
        }
    }
    onFlowBackAction = async (ID: number) => {
        try {
            this.setHasError(false);
            this.setIsLoading(true);
            const response = await this.executeFlow(ID, 'back');
            this.setIsLoading(false);
            this.setFlow(response);
        } catch (error:any) {
            this.onError(error)
        }
    }
}
const flowContext = createContext<FlowStore>(new FlowStore());
const FlowProvider: FC<{ store: FlowStore }> = ({ store, children }) => {
    return (
        <flowContext.Provider value={store}>{children}</flowContext.Provider>
    );
};
const useFlow = () => {
    return useContext(flowContext);
};
export { FlowStore, FlowProvider, useFlow };