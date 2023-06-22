export const auth = (req, res, next) => {
  const user = req.query.user;

  if (user != 'admin') {
    return res.status(401).json({ msg: 'Unauthorized ' });
  }

  next();
};
