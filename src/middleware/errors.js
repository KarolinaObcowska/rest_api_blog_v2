export const unknownEndpoint = (req, res) => {
    res.status(404).json({ msg: "Unknown endpoint"})
}

export const errorHandler = (err, req, res, next) => {
    console.log(hello)
    if (err.name === "CastError" && err.kind === "ObjectId") {
        return res.status(400).json({ msg: "malformed id" });
      }
      if (err.name === "ValidationError") {
        let errors = {};
        Object.keys(err.errors).forEach((key) => {
          errors[key] = err.errors[key].message;
        });
        return res.status(400).json(errors);
      }
      if (err.name === "MongoServerError" && err.code === 11000) {
        return res
          .status(500)
          .json({ msg: "Username already exists!" });
      }
      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
            msg: "invalid token",
        });
      }
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ msg: "token expired" });
      }
    
      return next(err);
}