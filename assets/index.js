document.addEventListener("DOMContentLoaded", () => {
  const getWinnerButton = document.getElementById("get-winner");
  getWinnerButton.addEventListener("click", handleGetWinnerClick);
});

function handleGetWinnerClick() {
  const numberOfWinnersInput = document.getElementById("nr-winners");
  const numberOfWinners = parseInt(numberOfWinnersInput.value);
  if (numberOfWinners <= 0 || isNaN(numberOfWinners)) {
    alert("Please enter a valid number of winners (greater than zero).");
    numberOfWinnersInput.focus();
    return;
  }

  const htmlMarkup = document.getElementById("html-markup").value;
  if (!htmlMarkup.trim()) {
    alert("Please input HTML Markup from Instagram page.");
    return;
  }

  const ulMatches = htmlMarkup.match(/<ul\b[^>]*>(.*?)<\/ul>/gis) || [];

  const totalContestants = ulMatches.length;
  if (numberOfWinners > totalContestants) {
    alert(
      `Number of winners (${numberOfWinners}) cannot exceed total contestants (${totalContestants}).`
    );
    numberOfWinnersInput.focus();

    return;
  }

  displayTotalContestants(totalContestants);
  const contestants = extractContestants(ulMatches);
  displayContestants(contestants);
  const winners = pickRandomWinners(contestants, numberOfWinners);
  displayWinners(winners);
}

function displayTotalContestants(count) {
  const resultBox = document.getElementById("competitors");
  resultBox.innerHTML = `Total contestants: <strong>${count}</strong>`;
}

function displayContestants(contestants) {
  const listCompetitors = document.getElementById("list-competitors");
  const contestantsHtml = contestants
    .map((contestant) => `<strong>${contestant}</strong>`)
    .join(", ");
  listCompetitors.innerHTML = "Contestants: " + contestantsHtml;
}

function extractContestants(ulMatches, uniqueContestants) {
  const contestants = [];
  const aRegex = /<a\b[^>]*>([\s\S]*?)<\/a>/gi;
  const timeRegex = /<time\s+class\s*=\s*["']([^"']*)["']/i;

  ulMatches.forEach((ul) => {
    let match;
    while ((match = aRegex.exec(ul))) {
      const contestantHtml = match[0];
      if (timeRegex.test(contestantHtml)) {
        continue;
      }

      const contestant = match[1].replace(/<\/?[^>]+(>|$)/g, "").trim();
      if (isValidContestant(contestant, uniqueContestants, contestants)) {
        contestants.push(contestant);
      }
    }
  });

  return contestants;
}

function isValidContestant(contestant, uniqueContestants, existingContestants) {
  if (
    contestant.length > 1 &&
    contestant.length < 30 &&
    /^[a-zA-Z0-9.]*$/.test(contestant)
  ) {
    if (uniqueContestants && existingContestants.includes(contestant)) {
      return false;
    }
    return true;
  }
  return false;
}

function pickRandomWinners(contestants, numberOfWinners) {
  const shuffledContestants = [...contestants].sort(() => Math.random() - 0.5);
  return shuffledContestants.slice(0, numberOfWinners);
}

function displayWinners(winners) {
  const winnersBox = document.getElementById("winners");
  const winnersHtml = winners
    .map((winner) => `<strong>${winner}</strong>`)
    .join(", ");
  winnersBox.innerHTML = `<div class="winner-box">Winner(s): ${winnersHtml}</div>`;
}
