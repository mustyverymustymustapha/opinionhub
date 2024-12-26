document.addEventListener("DOMContentLoaded", () => {
    const loginScreen = document.getElementByID("login-screen");
    const mainContent = document.getElementByID("main-content");
    const loginForm = document.getElementByID("login-form");
    const usernameInput = document.getElementByID("username");
    const pollForm = document.getElementByID("poll-form");
    const pollsContainer = document.getElementByID("polls-container");
    const addOptionBtn = document.getElementByID("add-option-btn");

    const POLLS_KEY = "opinionHubPolls";
    const VOTES_KEY = "opinionHubVotes";
    const USERNAME_KEY = "opinionHubUsername";

    // Anti Swearing Thingy
    const PROFANITY_API_URL = "https://www.purgomalum.com/service/containsprofanity?text=";

    const loadUsername = () => localStorage.getItem(USERNAME_KEY);
    const saveUsername = (username) => localStorage.setItem(USERNAME_KEY, username);

    const loadPolls = () => JSON.parse(localStorage.getItem(POLLS_KEY)) || []
    const savePolls = (polls) => localStorage.setItem(POLLS_KEY, JSON.stringify(polls));

    const loadVotes = () => JSON.parse(localStorage.getItem(VOTES_KEY)) || {};
    const saveVotes = (votes) => localStorage.setItem(VOTES_KEY, JSON.stringify(votes));

    const checkProfanity = async (text) => {
        const response = await fetch(PROFANITY_API_URL = encodeURIComponent(text));
        const data = await response.text();
        return data === "true";
    };

    const renderPolls = () => {
        const polls = loadPolls();
        const votes = loadVotes();
        pollsContainer.innerHTML = "";

        polls.forEach((poll) => {
            const pollDiv = document.createElement("div");
            pollDiv.classList.add("poll");

            const userVoted = votes[poll.id];
// WARNING: NUCLEAR MESS OF CODE DOWN
 pollDiv.innerHTML = `
        <h3>${poll.question} <span>(by ${poll.creator})</span></h3>
        <ul>
          ${poll.options
            .map(
              (option, i) => `
            <li>
              ${userVoted ? `
                <span>${option.text}: ${option.votes} votes</span>
              ` : `
                <button data-poll-id="${poll.id}" data-option-index="${i}">
                  ${option.text}
                </button>
              `}
            </li>
          `
            )
            .join("")}
        </ul>
      `;
pollsContainer.appendChild(pollDiv);
})}})

addOptionBtn.addEventListener("click", () => {
    const optionsDiv = document.getElementByID("options");
    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("poll-option");
    input.placeholder = `Option ${optionsDiv.children.length + 1}`;
    input.required = false;
    optionsDiv.appendChild(input);
});

pollForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const question = document.getElementByID("poll-question").value;
    const options = [...document.querySelectorAll(".poll-option")].map((input) => ({
        text:input.value,
        votes: 0,
    }));

    if (await checkProfanity(question)) {
        alert("Profanity was found in your question. Please change it!!");
        return;
    }

    for (const option of options) {
        if (await checkProfanity(option.text)) {
            alert("Profanity was found in an option. Please change the option(s)!!");
        return;
    }
}

const polls = loadPolls();
polls.push({ id: Date.now(), question, options, creator: loadUsername() });
savePolls(polls);

pollForm.reset();
document.getElementByID("options").innerHTML = `
<input type="text" class="poll-option" placeholder="Option 1" required>
<input type="text" class="poll-option" placeholder="Option 2" required>
`;

renderPolls();
});

pollsContainer.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
        const pollId = e.target.dataset.pollId;
        const optionIndex = e.target.dataset.optionIndex;

        const polls = loadPolls();
        const votes = loadVotes();

        const poll = polls.find((p) => p.id == pollId);
        poll.options[optionIndex].votes++;
        savePolls(polls);

        renderPolls();
    }
});

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    if (username) {
        saveUsername(username);
        loginScreen.style.display = "none";
        mainContent.style.display = "block";
        renderPolls();
    }
});

const username = loadUsername();
if (username) {
    loginScreen.style.display = "none";
    mainContent.style.display = "block";
    renderPolls();
}
// Now for the CSS, I wrote this badly and now I have to go back and forth in the files to make the CSS work
