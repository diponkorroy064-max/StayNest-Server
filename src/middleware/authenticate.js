const { jwtVerify, createRemoteJWKSet} = require("jose");
const AUTH_URL = process.env.BETTER_AUTH_URI;
// console.log("AUTH_URL:", AUTH_URL);
// console.log("JWKS URL:",`${AUTH_URL}/api/auth/jwks`);

const JWKS = createRemoteJWKSet( new URL(`${AUTH_URL}/api/auth/jwks`));


const authenticate = async (req, res, next) => {
    try {
        console.log("\n========== AUTHENTICATE ==========");
        const authHeader = req.headers.authorization;
        // console.log("Authorization header:", authHeader);
        console.log("Authorization:", authHeader ? "RECEIVED" : "MISSING");

        if (!authHeader) {
            return res.status(401).json({
                message: "Authentication token is required.",
            });
        }

        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Invalid authorization format.",
            });
        }
        const token = authHeader.substring(7);
        console.log("Token received:", !!token);
        console.log("Token length:", token.length);

        if (!token) {
            return res.status(401).json({
                message: "Authentication token is missing.",
            });
        }
        // console.log("JWT received");

        const { payload } = await jwtVerify(
            token,
            JWKS,
            {
                issuer: AUTH_URL,
                audience: AUTH_URL,
            }
        );
        // console.log("JWT payload:", payload);
        req.user = payload;
        next();
    } catch (error) {
        console.error("JWT verification failed:");
        console.error("name:", error.name);
        console.error("message:", error.message);

        console.error("========== JWT ERROR ==========");
        console.error("Name:", error.name);
        console.error("Message:", error.message);
        console.error("Code:", error.code);
        console.error("================================");

        return res.status(401).json({
            message: "Invalid or expired authentication token.",
            error: error.message,
        });
    }
};

module.exports = authenticate;
