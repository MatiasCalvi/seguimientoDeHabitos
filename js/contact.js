function showErrorMessage(message) {
  var errorMessagesContainer = document.getElementById(
    "errorMessagesContainer"
  );
  var errorMessage = document.createElement("div");
  errorMessage.textContent = message;
  errorMessage.classList.add("error-message");

  errorMessage.addEventListener("click", function () {
    errorMessage.classList.add("hide");
    errorMessage.addEventListener("transitionend", function () {
      errorMessage.remove();
    });
  });

  errorMessagesContainer.appendChild(errorMessage);
  errorMessagesContainer.style.display = "block";

  function startFadeOut() {
    errorMessage.classList.add("hide");
    errorMessage.addEventListener("transitionend", function () {
      errorMessage.remove();
      if (!errorMessagesContainer.children.length) {
        errorMessagesContainer.style.display = "none";
      }
    });
  }

  var timeoutId = setTimeout(startFadeOut, 3000);

  errorMessage.addEventListener("click", function () {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(startFadeOut, 2000);
  });
}

function addErrorClass(element) {
  element.classList.add("error");
}

function removeErrorClass(element) {
  element.classList.remove("error");
}

function validateName(name, element) {
  var namePattern = /^[A-Z][^\d\s!@#$%&()*^_]+$/;
  if (!namePattern.test(name)) {
    addErrorClass(element);
    return {
      code: -1,
      message:
        "Names must begin with a capital letter and contain no numbers, spaces, or special characters.",
    };
  }
  removeErrorClass(element);
  return {
    code: 1,
    message: "",
  };
}

function validatePhone(phone, element) {
  var phonePattern = /^\d{10}$/;
  if (!phonePattern.test(phone)) {
    addErrorClass(element);
    return {
      code: -2,
      message: "The phone number must be 10 digits long and numeric.",
    };
  }
  removeErrorClass(element);
  return {
    code: 1,
    message: "",
  };
}

function validateEmail(email, element) {
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.endsWith(".com") || !emailPattern.test(email)) {
    addErrorClass(element);
    return {
      code: -3,
      message: "The email must end in '.com' and contain no spaces.",
    };
  }
  removeErrorClass(element);
  return {
    code: 1,
    message: "",
  };
}

function validateForm() {
  var nameInput = document.getElementById("name");
  var phoneInput = document.getElementById("phone");
  var emailInput = document.getElementById("email");
  var messageInput = document.getElementById("message");

  var nameError = validateName(nameInput.value, nameInput);
  var phoneError = validatePhone(phoneInput.value, phoneInput);
  var emailError = validateEmail(emailInput.value, emailInput);

  var errors = [nameError, phoneError, emailError].filter(function (error) {
    return error.code !== 1;
  });

  if (errors.length > 0) {
    errors.forEach(function (error) {
      showErrorMessage(error.message);
    });
    return { code: -7, message: "Form error." };
  }

  nameInput.value = "";
  phoneInput.value = "";
  emailInput.value = "";
  messageInput.value = "";

  return { code: 1, message: "successfully" };
}

document
  .getElementById("registrationForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    removeErrorClass(document.getElementById("name"));
    removeErrorClass(document.getElementById("phone"));
    removeErrorClass(document.getElementById("email"));

    var validationResult = validateForm();

    if (validationResult.code === 1) {
      swal("¡Good job!", "Form submitted successfully!", "success")
      .then(
        function () {
          document.querySelector(
            '.agreement input[type="checkbox"]'
          ).checked = false;
        }
      );
    } else {
      console.log(validationResult.code);
      console.log(validationResult.message);
    }
  });
