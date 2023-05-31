import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import auth from './lib/auth';
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    try {
      const search = (request.nextUrl.searchParams)
      const access_token:any = request.cookies.get('x-access-token');
      const req = (await auth.isAuthenticated(access_token?.value));
      const ifAuth = await req.json();

      // SET HEADERS
      const requestHeaders = new Headers(request.headers);
      request.headers.set('authorization', "access_token");
      // console.log(request.headers.get('authorization')) 

      // RERWITE
      if(request.nextUrl.pathname.startsWith('/office/') && ifAuth?.isVerified){
        return NextResponse.rewrite(new URL(request.nextUrl.pathname, request.url));
      }

      // VERIFICATION 
      if (request.nextUrl.pathname.startsWith('/verification')){
        if(!search.get("token")) {
          return NextResponse.redirect(new URL('/login  ', request.url));
        }

        //make dead request to the APi @lib
        let isAuth:any = await auth.checkVerifedUser(search.get("token") as string)
        isAuth = await isAuth.json()
        console.log(isAuth, search.get("token"))
        if(!isAuth.data?.accessToken) {
          return NextResponse.redirect(new URL('/login  ', request.url));
        }

        request.cookies.set("x-access-token", isAuth.data?.accessToken)
      }

      if(request.nextUrl.pathname.startsWith('/office') && !ifAuth?.isVerified) {
          return NextResponse.redirect(new URL('/login  ', request.url));
      }

      // RE-ROUTE UNPROTECTED ROUTE
      let checkroutes:boolean = false;
      ['/login', '/register', '/', '/forget-password', '/verification'].forEach((pathname:string) => {
        if(request.nextUrl.pathname.startsWith(pathname) && ifAuth?.isVerified) {
            checkroutes = true;
        }
      })
      if(checkroutes) return NextResponse.redirect(new URL('/office/dashboard', request.url));


    } catch (error) {
      console.log(error)
      throw error;
    }

}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/office/:path*', '/verification', '/', '/login', '/register', '/forget-password'],
};