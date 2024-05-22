const BASE_URL = "http://localhost:5000/api/users";

export async function signup(values) {
  try {
    const response = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    const message = await response.json();
    return message;
  } catch (error) {
    console.error(error);
  }
}

export async function signin(values) {
  try {
    const response = await fetch(`${BASE_URL}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    const newUser = await response.json();
    return newUser;
  } catch (error) {
    console.error(error);
  }
}

export async function searchById(_id) {
  try {
    const response = await fetch(`${BASE_URL}/findId`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id: _id }),
    });
    const newUser = await response.json();
    return newUser;
  } catch (error) {
    console.error(error);
  }
}

export async function forgotPwd(mail) {
  try {
    const response = await fetch(`${BASE_URL}/forgotPassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mail),
    });
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

export async function changePwd(password, token) {
  const message = {
    password: password.password,
    token,
  };
  try {
    const response = await fetch(`${BASE_URL}/changePassword`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

export async function changePwdAsConnected(message) {
  try {
    const response = await fetch(`${BASE_URL}/changePasswordAsConnected`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

export async function updateUser(values) {
  try {
    const response = await fetch(`${BASE_URL}/updateUser`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    const message = await response.json();
    return message;
  } catch (error) {
    console.error(error);
  }
}