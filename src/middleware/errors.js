export const unknownEndpoint = (req, res) => {
  res.status(404).json({ msg: 'Unknown endpoint' });
};

export const handleValidationErrors = (err, res, next) => {
  const errors = {};
  Object.keys(err.errors).forEach(key => {
    errors[key] = err.errors[key].message;
  });
  res.status(422).json(errors);
};
