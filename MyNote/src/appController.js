const loginPage = async (req, res) => {
  const url = `http://${process.env.USERSERVICE_HOST}:3001/user/get-all`;
  const response = await fetch(url);
  const { data: data } = await response.json();

  console.log("TESTDATA:", data);

  res.render("loginPage", {
    message: data[0].username,
  });
};

module.exports = { loginPage };
