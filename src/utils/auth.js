// src/utils/auth.js
export function tryLogin(email, password, success, fail, saveToken) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(
    (user) => user.id === email && user.password === password
  );
  if (user) {
    if (saveToken) {
      localStorage.setItem("isLoggedIn", true);
    } else {
      sessionStorage.setItem("isLoggedIn", true);
    }
    success(user);
  } else {
    fail();
  }
}

export function tryRegister(email, password, success, fail) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const userExists = users.some((existingUser) => existingUser.id === email);
  if (!userExists) {
    users.push({ id: email, password: password });
    localStorage.setItem("users", JSON.stringify(users));
    success();
  } else {
    fail();
  }
}
