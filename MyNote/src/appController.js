const loginPage = (req, res) => {
  res.render("loginPage");
};

const notePage = async (req, res) => {
  res.render("notePage");
};

module.exports = { loginPage, notePage };
