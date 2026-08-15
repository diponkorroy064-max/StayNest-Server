let jwtVerify, createRemoteJWKSet;

const loadJose = async () => {
    if (!jwtVerify || !createRemoteJWKSet) {
        const jose = await import("jose");
        jwtVerify = jose.jwtVerify;
        createRemoteJWKSet = jose.createRemoteJWKSet;
    }
};

let JWKS;

const getJWKS = async (authUrl) => {
    await loadJose();
    if (!JWKS) {
        JWKS = createRemoteJWKSet(new URL(`${authUrl}/api/auth/jwks`));
    }
    return JWKS;
};

const authenticate = async (req, res, next) => {
    const AUTH_URL = process.env.BETTER_AUTH_URL || "https://staynest-vert-beta.vercel.app";

    try {
        await loadJose();

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authentication token is required or invalid format.",
            });
        }

        const token = authHeader.substring(7);

        if (!token) {
            return res.status(401).json({
                message: "Authentication token is missing.",
            });
        }

        const jwksSet = await getJWKS(AUTH_URL);

        const { payload } = await jwtVerify(token, jwksSet, {
            issuer: AUTH_URL,
            audience: AUTH_URL,
        });

        req.user = payload;
        next();
    } catch (error) {
        console.error("JWT verification failed:", error.message);
        return res.status(401).json({
            message: "Invalid or expired authentication token.",
            error: error.message,
        });
    }
};

module.exports = authenticate;
