/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler:{
        styledComponents: true
    },
    images:{
        remotePatterns:[
            {
                protocol: "https",
                hostname: "**"    
            },
            {
                protocol: "http",
                hostname: "**"    
            },
            {
                protocol: "https",
                hostname: "files.edgestore.dev",
                pathname: "**"
            }
        ]
    },
}

module.exports = nextConfig
