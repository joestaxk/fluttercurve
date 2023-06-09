import auth from "../lib/auth";

interface helpersInterface {
    forceLogoutAdmin: () => Promise<void>;
    logoutAdmin: () => Promise<void>;
    forceLogoutUser: () => Promise<void>;
    getCookie: (name: string) => string | null;
    deleteCookie: (name: string) => void;
    logoutUser: () => Promise<void>;
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
        location.href = "/login"
    } catch (error) {
        console.log(error)
    }
}


helpers.logoutAdmin = async function() {
    try {
        const logout = await auth.logout(helpers.getCookie("xat") as any);
        if(logout){
            helpers.deleteCookie("xat")
            helpers.deleteLocalItem('admin_data')
            location.href = "/login"
        }
        } catch (error) {
            console.log(error)
        }
}


helpers.logoutUser = async function() {
    try {
        const logout = await auth.logout(helpers.getCookie("xat") as any);
        if(logout){
            helpers.deleteCookie("xat")
            helpers.deleteLocalItem('user_data')
            location.href = "/login"
        }
        } catch (error) {
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
        if(typeof value !== "string") {
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
  
export default helpers;