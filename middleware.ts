import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
    "/","/home","/sign-in","/sign-up","/forgot-password","/reset-password","/verify-email"
]);
const isPublicApiRoute  = createRouteMatcher([
    "/",
]);

export default clerkMiddleware((auth, req)=>{
    const {userId} = auth()
    const currenURl = new URL (req.url)  
    const ishome = currenURl.pathname === "/"
    const isApiRequest = currenURl.pathname.startsWith("/api")  

    //user is logged in and trying to access public route like sign-in log-in
    if(userId && isPublicRoute(req) && !ishome){
        return NextResponse.redirect(new URL ("/", req.url))
    }

    // user is not logged in and trying to access private route
    if(!userId){

        if(!isPublicRoute(req) && !isPublicApiRoute(req)){
            return NextResponse.redirect(new URL ("/sign-in", req.url))
        }

        if(isApiRequest && !isPublicApiRoute(req)){
            return NextResponse.redirect(new URL ("/sign-in", req.url))
        }

    }
    return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
 }