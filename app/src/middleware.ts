import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import auth from './lib/auth';
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    try {
      const search = (request.nextUrl.searchParams)
      const access_token:any = request.cookies.get('x-access-token');
        const res = (await auth.isAuthenticated(access_token?.value));
        const ifAuth = await res.json();

      // SET HEADERS
      request.headers.set('authorization', access_token);

     // RERWITE
     if(request.nextUrl.pathname.startsWith('/office/') && ifAuth?.isVerified){
          // if you're not an admin and you're on the admin path.
          if(!ifAuth?.isAdmin && request.nextUrl.pathname.startsWith('/office/admin')){
            return NextResponse.rewrite(new URL("/office/dashboard", request.url));
          }

          // if you're an admin and you are on the client path
          if(!ifAuth?.isAdmin && request.nextUrl.pathname.startsWith('/office/admin')){
            return NextResponse.rewrite(new URL("/office/admin", request.url));
          }

          // Is Admin
          if(ifAuth?.isAdmin){
              return NextResponse.rewrite(new URL(request.nextUrl.pathname, request.url));
          }else {
            return NextResponse.rewrite(new URL(request.nextUrl.pathname, request.url));
          }
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
          return NextResponse.rewrite(new URL('/login  ', request.url));
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