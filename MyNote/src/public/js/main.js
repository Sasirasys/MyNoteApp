const userService_url = `http://localhost:3001`;

const signUp = async (username, password) => {
  const url = `${userService_url}/user/signup`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });
  const data = await response.json();
  $("#login-message").text(data.msg);
};

$(document).ready(function () {
  $("#signup-button").on("click", (event) => {
    event.preventDefault(); // Stops the button from refreshing the page

    const username = $("#username").val();
    const password = $("#password").val();
    signUp(username, password);
  });
});
