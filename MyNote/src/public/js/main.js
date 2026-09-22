const userService_url = `http://localhost:3001`;

const signUp = async (username, password) => {
  console.log("test print :", username, password);
  const url = `${userService_url}/user/signup`;
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });
  const data = await response.json();
  //   console.log(data);
  return data.msg;
};
