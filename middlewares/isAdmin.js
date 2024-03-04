const isAdminCheck = (req, res, next) => {
  const { isAdmin } = req.user;

  console.log("isAdmin chek === ", req.user);
  if (!isAdmin) {
    return res.status(403).json({ message: "You are not admin" });
  }
  next();
};

export default isAdminCheck;
