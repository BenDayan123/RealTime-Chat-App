import { getServerSession } from "next-auth/next"
import { NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware"

export async function middleware(_: NextRequest) {
    console.log(1)
    const session = await getServerSession();
    console.log(session)
    if(!session){
        console.log("401 nigga!")
        return NextResponse.redirect(new URL("https://www.google.com"));
        // return new NextResponse(
        //     JSON.stringify({ success: false, message: 'authentication failed' }),
        //     { status: 401, headers: { 'content-type': 'application/json' } }
        //   )
    }
    return NextResponse.next();

}


export const config = { matcher: ["/chat", "/chat/:path*", "/api/:path*"] }