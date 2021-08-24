import AsyncStorage from "@react-native-async-storage/async-storage";
import { IRIS, Storage } from '@databalk/iris-sdk-js'
export namespace SDK {
    class storage extends Storage {
        constructor(prefix = '') {
        super(prefix)
        }
    
        get(key:string) { 
            AsyncStorage.getItem(key).then((value)=>{
                if (value !== null) {
                return value;
                }
                return null;
            })
        }
    
        set(key:string, value:string) { 
            AsyncStorage.setItem(key, value).then((e)=>{
                if(e != null){
                    return value;
                }
                return null
            })
        }
    
        delete(key:string){              
                AsyncStorage.removeItem(key).then((e)=>{
                    return e
            })
        }
    }
    
    export  const client = new IRIS('https://TeamBP-VeraDev.azurewebsites.net', {
                storage: new storage() 
            });
}
    
    
    
  
  
