const getBearerToken = (req) => {
  const bearerHeader = req.headers["authorization"];

  if (!bearerHeader) return null;

  const bearer = bearerHeader.split(" ");
  const bearerToken = bearer[1];

  return bearerToken;
};

module.exports = { getBearerToken };
