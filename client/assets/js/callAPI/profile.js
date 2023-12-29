const base_url = "http://localhost:8080";

const api_update = base_url + "/users";

const token = localStorage.getItem("token");
const socket = io("http://localhost:8080", {
  query: { token },
});

let user_gobal;

socket.on("profile", ({ user }) => {
  user_gobal = user;
  displayProfile(user);
});

const displayProfile = async (user) => {
  const imageElement = document.getElementById("profile-image");
  const name = document.getElementById("fullname");
  const role = document.getElementById("role");
  const fullNameInput = document.getElementById("fullnameInput");
  const email = document.getElementById("email");

  name.innerHTML = user.fullname;
  role.innerHTML = user.role;
  imageElement.src = user.avatar;
  fullNameInput.value = user.fullname;
  email.innerText = user.email;
};

document
  .getElementById("editProfileIcon")
  .addEventListener("click", function () {
    let fullNameInput = document.getElementById("fullnameInput");
    let saveIcon = document.getElementById("saveProfileIcon");

    //   // Remove the 'readonly' attribute to make the fields editable
    fullNameInput.removeAttribute("readonly");

    //   // Add 'form-control' class to make it look like a regular input field
    fullNameInput.classList.add("form-control");

    //   // Remove 'form-control-plaintext' class to change appearance to editable
    fullNameInput.classList.remove("form-control-plaintext");

    //   // Show the 'Save' icon
    saveIcon.style.display = "inline";

    //   // Hide the 'Edit' icon
    this.style.display = "none";

    //   // Focus on the 'Full Name' input
    fullNameInput.focus();
    document.getElementById("saveProfileIcon").style.display = "inline";
    this.style.display = "none";
  });

document
  .getElementById("saveProfileIcon")
  .addEventListener("click", function () {
    let fullNameInput = document.getElementById("fullnameInput");
    // Make the fields read-only again
    fullNameInput.setAttribute("readonly", true);

    // Switch the input classes back to 'form-control-plaintext'
    fullNameInput.classList.remove("form-control");
    fullNameInput.classList.add("form-control-plaintext");

    // Hide the 'Save' icon and show the 'Edit' icon
    document.getElementById("editProfileIcon").style.display = "inline";
    this.style.display = "none";

    // Here you should also handle the saving of the data, for example, sending it to the server
    let data = {
      fullname: fullNameInput.value,
    };
    if(data.fullname === user_gobal.fullname){
      return;
    }
    fetch(`${api_update}/${user_gobal._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code !== 200) {
          swal({
            title: "Error!",
            text: data.message,
            icon: "error",
            button: "OK",
          });
        } else {
          swal({
            title: "Success!",
            text: "Update profile successfully",
            icon: "success",
            button: "OK",
          });
          displayProfile(data.user);
          user_gobal = data.user;
        }
      });
  });

document.addEventListener("DOMContentLoaded", function () {
  var changePwdButton = document.getElementById("change-pwd-btn");
  var changePwdModal = new bootstrap.Modal(
    document.getElementById("change-pwd-display")
  );

  changePwdButton.addEventListener("click", function () {
    changePwdModal.show();
  });
});

document.getElementById("change-pwd-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const oldPassword = document.getElementById("current-password").value;
  const newPassword = document.getElementById("new-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  if(newPassword !== confirmPassword){
    swal({
      title: "Error!",
      text: "Confirm password is not matched",
      icon: "error",
      button: "OK",
    });
    return;
  }
  let data = {
    oldPassword,
    newPassword
  };
  fetch(`${api_update}/change-password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.code !== 200) {
        swal({
          title: "Error!",
          text: data.message,
          icon: "error",
          button: "OK",
        });
      } else {
        swal({
          title: "Success!",
          text: "Change password successfully",
          icon: "success",
          button: "OK",
        });
        document.getElementById("change-pwd-form").reset();
      }
    });
});

const toastSlide = () => {
  const toatMain = document.getElementById("toast");
  
  if (toatMain) {
    const toast = document.createElement("div");
    toast.classList.add("toast__item");
    toast.innerHTML = `
        <i class="fa-solid fa-circle-exclamation"></i>
        <span>Chức năng này đang được phát triển, bạn vui lòng thử lại sau !</span>
    `;
    toatMain.appendChild(toast);
    
    setTimeout(function () {
      toatMain.removeChild(toast);
    }, 4000);
  }
}