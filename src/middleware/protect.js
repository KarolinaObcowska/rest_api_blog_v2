import jwt from 'jsonwebtoken';

export const signJwt = (email, id) => {
    const token = jwt.sign(
        {
            email: email,
            userId: id.toString()
        },
        'supersecretjsonwebtokenkey',
        {
            expiresIn: '3h'
        }
    )
    return token;
}
export const protect = (req, res, next) => {
    const header = req.get('Authorization');
    if (!header) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
      }
    const token = header.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'supersecretjsonwebtokenkey')
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }
    if (!decodedToken) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;
    next();
}