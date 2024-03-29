/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites(){
        return [
            {
                source:'/api/:slug*',
                destination:`${process.env.API_PREFIX}/api/:slug*`, // 404 除了路径，也有看参数是否正确
            }
        ]
    }
};

export default nextConfig;
