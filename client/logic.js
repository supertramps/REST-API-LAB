window.addEventListener("load", initSite);

function initSite() {
  getAllUsers();
}

// Get all users
async function getAllUsers() {
  const users = await makeRequest("/api/users", "GET");
  console.log(users.length);

  for (let i = 0; i < users.length; i++) {
    const userCard = document.createElement("div");
    const deleteButton = document.createElement("button");
    const editButton = document.createElement("button");
    const name = document.createElement("p");
    const age = document.createElement("p");
    const eyeColor = document.createElement("p");
    const id = document.createElement("p");
    const element = users[i];
    const inspectButton = document.createElement("button");

    inspectButton.classList.add("button");
    editButton.classList.add("editButton", "button");
    deleteButton.classList.add("deleteButton", "button");
    userCard.classList.add("userCard", "flex", "center");
    userCard.setAttribute("id", "user" + i);

    name.innerHTML = "Name:" + " " + element.name;
    age.innerHTML = "Age:" + " " + element.age;
    eyeColor.innerHTML = "Eye Color:" + " " + element.eyeColor;
    id.innerHTML = "ID:" + " " + element.id;
    editButton.innerHTML = "Edit";
    deleteButton.innerHTML = "Delete";
    inspectButton.innerHTML = "Inspect";

    editButton.onclick = function () {
      setModalContent(element.id);
      handleModal();
    };

    deleteButton.onclick = function () {
      deleteUser(element.id);
    };

    inspectButton.onclick = function () {
      getSpecificUser(element.id);
    };

    userCard.append(
      name,
      age,
      eyeColor,
      id,
      editButton,
      deleteButton,
      inspectButton
    );
    document.getElementById("userCard").appendChild(userCard);
  }
}
// Get a specific user
async function getSpecificUser(id) {
  const specificUser = await makeRequest("/api/users/" + id, "GET");
  hideResults();
  const userCard = document.createElement("div");
  const deleteButton = document.createElement("button");
  const editButton = document.createElement("button");
  const name = document.createElement("p");
  const age = document.createElement("p");
  const eyeColor = document.createElement("p");
  const chosenID = document.createElement("p");

  editButton.classList.add("editButton", "button");
  deleteButton.classList.add("deleteButton", "button");
  userCard.classList.add("userCard", "flex", "center");

  name.innerHTML = "Name:" + " " + specificUser.name;
  age.innerHTML = "Age:" + " " + specificUser.age;
  eyeColor.innerHTML = "Eye Color:" + " " + specificUser.eyeColor;
  chosenID.innerHTML = "ID:" + " " + specificUser.id;
  editButton.innerHTML = "Edit";
  deleteButton.innerHTML = "Delete";

  editButton.onclick = function () {
    setModalContent(specificUser.id);
    handleModal();
  };

  deleteButton.onclick = function () {
    deleteUser(specificUser.id);
  };

  userCard.append(name, age, eyeColor, chosenID, editButton, deleteButton);
  document.getElementById("userCard").appendChild(userCard);
}

function hideResults() {
  const textBox = document.getElementById("userCard");
  textBox.innerHTML = "";
}

async function setModalContent(id) {
  const user = await makeRequest("/api/users/" + id, "GET");
  const userName = document.getElementById("userName");
  const userAge = document.getElementById("age");
  const userEyeColor = document.getElementById("userEyeColor");
  userName.value = user.name;
  userAge.value = parseInt(user.age);
  userEyeColor.value = user.eyeColor;
  const submitButton = document.getElementById("submitButton");
  submitButton.addEventListener("click", () => {
    updateUser(id, userName.value, userAge.value, userEyeColor.value);
    window.location.reload();
  });
}

async function setEmptyModal() {
  const userName = document.getElementById("userName");
  const userAge = document.getElementById("age");
  const userEyeColor = document.getElementById("userEyeColor");
  const submitButton = document.getElementById("submitButton");
  submitButton.addEventListener("click", () => {
    saveNewUser(userName.value, parseInt(userAge.value), userEyeColor.value);
    window.location.reload();
  });
}
// Save a new user
async function saveNewUser(name, age, eyeColor) {
  const body = { name: name, eyeColor: eyeColor, age: age };

  await makeRequest("/api/users", "POST", body);
}

// Update specific user
function updateUser(id, name, age, eyeColor) {
  const body = { name: name, eyeColor: eyeColor, age: age };
  makeRequest("/api/users/" + id, "PUT", body);
}

// Delete a user
function deleteUser(id) {
  makeRequest("/api/users/" + id, "DELETE");
  window.location.reload();
}

async function makeRequest(url, method, body) {
  const response = await fetch(url, {
    method: method,
    body: JSON.stringify(body),
    headers: {
      "Content-type": "application/json",
    },
  });

  const result = await response.json();

  return result;
}

function handleModal() {
  // Get the modal
  var modal = document.getElementById("myModal");
  modal.style.display = "block";

  // Get the button that opens the modal
  var btn = document.getElementById("myBtn");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}
