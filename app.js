 document.addEventListener("DOMContentLoaded", () => {
  const loginScreen = document.getElementById("login-screen");
  const mainContent = document.getElementById("main-content");
  const loginForm = document.getElementById("login-form");
  const usernameInput = document.getElementById("username");
  const pollForm = document.getElementById("poll-form");
  const pollQuestionInput = document.getElementById("poll-question");
  const optionsContainer = document.getElementById("options");
  const addOptionBtn = document.getElementById("add-option-btn");
  const pollsContainer = document.getElementById("polls-container");

  const USERNAME_KEY = "opinionHubUsername";
  const POLLS_KEY = "opinionHubPolls";

  const loadUsername = () => localStorage.getItem(USERNAME_KEY);
  const saveUsername = (username) => localStorage.setItem(USERNAME_KEY, username);
  const loadPolls = () => JSON.parse(localStorage.getItem(POLLS_KEY)) || [];
  const savePolls = (polls) => localStorage.setItem(POLLS_KEY, JSON.stringify(polls));

  const displayPolls = () => {
    pollsContainer.innerHTML = "";
    const polls = loadPolls();
    polls.forEach((poll, pollIndex) => {
      const pollElement = document.createElement("div");
      pollElement.className = "poll";
      const pollQuestion = document.createElement("h3");
      pollQuestion.textContent = poll.question;
      pollElement.appendChild(pollQuestion);
      const optionsList = document.createElement("ul");
      poll.options.forEach((option, optionIndex) => {
        const optionItem = document.createElement("li");
        const optionButton = document.createElement("button");
        optionButton.textContent = `${option.text} (${option.votes} votes)`;
        optionButton.addEventListener("click", () => {
          polls[pollIndex].options[optionIndex].votes++;
          savePolls(polls);
          displayPolls();
        });
        optionItem.appendChild(optionButton);
        optionsList.appendChild(optionItem);
      });
      pollElement.appendChild(optionsList);
      pollsContainer.appendChild(pollElement);
    });
  };

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    if (username) {
      saveUsername(username);
      loginScreen.style.display = "none";
      mainContent.style.display = "block";
      displayPolls();
    } else {
      alert("Please enter a valid name!");
    }
  });

  pollForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const question = pollQuestionInput.value.trim();
    const options = Array.from(optionsContainer.getElementsByClassName("poll-option"))
      .map((input) => input.value.trim())
      .filter((value) => value !== "")
      .map((text) => ({ text, votes: 0 }));
    if (question && options.length >= 2) {
      const polls = loadPolls();
      polls.push({ question, options });
      savePolls(polls);
      pollQuestionInput.value = "";
      optionsContainer.innerHTML = `
        <input type="text" class="poll-option" placeholder="Option 1" required>
        <input type="text" class="poll-option" placeholder="Option 2" required>
      `;
      displayPolls();
    } else {
      alert("Please enter a question and at least two options.");
    }
  });

  addOptionBtn.addEventListener("click", () => {
    const optionCount = optionsContainer.getElementsByClassName("poll-option").length;
    if (optionCount < 5) {
      const newOption = document.createElement("input");
      newOption.type = "text";
      newOption.className = "poll-option";
      newOption.placeholder = `Option ${optionCount + 1}`;
      optionsContainer.appendChild(newOption);
    } else {
      alert("You can add up to 5 options only.");
    }
  });

  const username = loadUsername();
  if (username) {
    loginScreen.style.display = "none";
    mainContent.style.display = "block";
    displayPolls();
  }
});

// Now for the CSS, I wrote this badly and now I have to go back and forth in the files to make the CSS work
