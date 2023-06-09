import auth from "../lib/auth";
import instance from "../lib/requestService";

interface helpersInterface {
    calculateFixerData: (from: string, to: string, amt: number) => number;
    checkConversion: (from: string, to: string, amount: number) => Promise<void>;
    reqAllKycData: (id: string, filename: string) => Promise<string | undefined>;
    reqAllUserImg: (getAvatar: string) => Promise<string | undefined>;
    loadAdminImg: () => Promise<string | undefined>;
    logoutUser: (showAlert: any) => Promise<void>;
    getLocalItemStr: (key: string) => string | undefined;
    loadImg: () => Promise<string | undefined>;
    forceLogoutAdmin: () => Promise<void>;
    logoutAdmin: () => Promise<void>;
    forceLogoutUser: () => Promise<void>;
    getCookie: (name: string) => string | null;
    deleteCookie: (name: string) => void;
    deleteLocalItem: (key: string) => void;
    getLocalItem: (key: any) => void;
    storeLocalItem: (key: any, value: any) => void;
    currencyFormatLong: (num: number, currency: string) => string | undefined;
    currencyFormat: (num: number, currency: string) => string | undefined;
}
var helpers = {} as helpersInterface;

helpers.forceLogoutUser = async function() {
    try {
        // const logout = await auth.logout(helpers.getCookie("xat") as any);
        helpers.deleteCookie("xat")
        helpers.deleteLocalItem('user_data')
        helpers.deleteLocalItem('profile_data')
        location.href = "/login"
    } catch (error) {
        console.log(error)
    }
}



helpers.forceLogoutAdmin = async function() {
    try {
        // const logout = await auth.logout(helpers.getCookie("xat") as any);
        helpers.deleteCookie("xat")
        helpers.deleteLocalItem('admin_data')
        helpers.deleteLocalItem('profile_data')
        helpers.deleteLocalItem('currency_data')
        location.href = "/login"
    } catch (error) {
        console.log(error)
    }
}


helpers.logoutAdmin = async function() {
    try {
        helpers.deleteCookie("xat")
        helpers.deleteLocalItem('admin_data')
        helpers.deleteLocalItem('profile_data')
        helpers.deleteLocalItem('currency_data')
        const logout = await auth.logout(helpers.getCookie("xat") as any);
        if(logout){
            location.href = "/login"
        }
        } catch (error) {
            console.log(error)
        }
}


helpers.logoutUser = async function(showAlert:any) {
    try {
        helpers.deleteCookie("xat")
        helpers.deleteLocalItem('user_data')
        helpers.deleteLocalItem('profile_data')
        helpers.deleteLocalItem('currency_data')
        const logout = await auth.logout(helpers.getCookie("xat") as any);
        if(logout){
            location.href = "/login"
            return;
        }
        } catch (error:any) {
            showAlert("error", error.response?.message||"Reload page")
            console.log(error)
        }
}

helpers.currencyFormat = function(num:number, currency:string) {
    if(currency) {
        return (new Intl.NumberFormat("en-US", {
            notation: "compact",
            compactDisplay: "short",
            style: "currency",
            currency: currency ? currency : "USD",
        }).format(num));
    }
}
helpers.currencyFormatLong = function(num:number, currency:string) {
    if(currency) {
        return (new Intl.NumberFormat("en-US", {
            notation: "standard",
            compactDisplay: "long",
            style: "currency",
            currency: currency ? currency : "USD",
        }).format(num));
    }
}


helpers.storeLocalItem = function(key, value) {
    try{
        if(value && typeof value !== "string") {
            value = JSON.stringify(value)
        }
        localStorage.setItem(key, value)
    }catch(error:any) {
        console.log(error)
    }
}

helpers.getLocalItem = function(key:string) {
    let data;
    try{
        data = JSON.parse(localStorage.getItem(key) as string)
    }catch(error:any) {
        console.log(error)
    }

    return data;
}

helpers.getLocalItemStr = function(key:string) {
    let data;
    try{
        data = localStorage.getItem(key) as string
    }catch(error:any) {
        console.log(error)
    }

    return data;
}



helpers.deleteLocalItem = function(key:string) {
    try{
       localStorage.removeItem(key)
    }catch(error:any) {
        console.log(error)
    }
}

// Function to delete a cookie by setting its expiration to a past date
helpers.deleteCookie = function (name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
  
  // Function to retrieve the value of a cookie by name
  helpers.getCookie = function (name: string) {
    const cookieString: string = document.cookie;
    const cookies: string[] = cookieString.split(';');
  
    for (let i = 0; i < cookies.length; i++) {
      const cookie: string = cookies[i].trim();
  
      // Check if the cookie starts with the provided name
      if (cookie.startsWith(name + '=')) {
        // Extract and return the cookie value
        return cookie.substring(name.length + 1);
      }
    }
    
    // Return null if the cookie is not found
    return null;
  }
  

  helpers.loadImg = async function() {
    try {
        const getAvatar:any = helpers.getLocalItem('user_data');
        if(!getAvatar['avatar']) return;
        const x:any = await instance.get(`/client/profile/${getAvatar['avatar']}`, {responseType: "blob", headers: {Authorization: helpers.getCookie('xat')}});
        const createBlob = URL.createObjectURL(x.data);
        return createBlob;
    } catch (error) {
       console.log(error)
    }
}

helpers.loadAdminImg = async function() {
    try {
        const getAvatar:any = helpers.getLocalItem('admin_data');
        if(!getAvatar['avatar']) return;
        const response:any = await instance.get(`/client/profile/${getAvatar['avatar']}`, {responseType: "arraybuffer", headers: {Authorization: helpers.getCookie('xat')}});
        const blob = new Blob([response.data], { type: response.headers["content-type"] });
        const createBlob = URL.createObjectURL(blob);
        return createBlob;
    } catch (error) {
       console.log(error)
    }
}

helpers.reqAllUserImg = async function(getAvatar: string) {
    if (!getAvatar) return undefined;
    try {
      const response = await instance.get(`/client/profile/${getAvatar}`, {
        responseType: "arraybuffer",
        headers: { Authorization: helpers.getCookie('xat') },
      });
      const blob = new Blob([response.data], { type: response.headers["content-type"] });
      const createBlob = URL.createObjectURL(blob);
      return createBlob;
    } catch (error) {
      console.log(error);
      throw error; // Optionally, throw the error or return a default value
    }
  };
  
  helpers.reqAllKycData = async function(id:string, filename:string) {
    if (!filename) return undefined;
    try {
      const response = await instance.post(`/admin/getKycData`, {id, filename}, {
        responseType: "arraybuffer",
        headers: { Authorization: helpers.getCookie('xat') },
      });
      const blob = new Blob([response.data], { type: response.headers["content-type"] });
      const createBlob = URL.createObjectURL(blob);
      return createBlob;
    } catch (error) {
      console.log(error);
      throw error; // Optionally, throw the error or return a default value
    }
  };

  helpers.calculateFixerData = function(from: string, to: string, amt: any):number {
    const getData:any = helpers.getLocalItem("currency_data")
    if(!getData) return 0;
    // get the fixer data.
    const conversion = getData[to]/getData[from]
    // make the conversion
    const perfConversion:number = parseInt(amt as any) * conversion;
    // return data
    return parseInt(perfConversion.toFixed())
}

export default helpers;