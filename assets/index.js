document.addEventListener("DOMContentLoaded", () => {
  const getWinnerButton = document.getElementById("get-winner");
  getWinnerButton.addEventListener("click", handleGetWinnerClick);
});

function handleGetWinnerClick() {
  const numberOfWinnersInput = document.getElementById("nr-winners");
  const numberOfWinners = parseInt(numberOfWinnersInput.value);

  // Validate number of winners input
  if (numberOfWinners <= 0 || isNaN(numberOfWinners)) {
    alert("Please enter a valid number of winners (greater than zero).");
    numberOfWinnersInput.focus(); // Focus back on the input for correction
    return;
  }

  const htmlMarkup = document.getElementById("html-markup").value;

  // Validate HTML markup input
  if (!htmlMarkup.trim()) {
    alert("Please input HTML Markup from Instagram page.");
    return;
  }

  const ulMatches = htmlMarkup.match(/<ul\b[^>]*>(.*?)<\/ul>/gis) || [];

  // Validate number of winners against total contestants
  const totalContestants = ulMatches.length;
  if (numberOfWinners > totalContestants) {
    alert(
      `Number of winners (${numberOfWinners}) cannot exceed total contestants (${totalContestants}).`
    );
    numberOfWinnersInput.focus(); // Focus back on the input for correction
    return;
  }

  displayTotalContestants(totalContestants);
  const contestants = extractContestants(ulMatches);
  const winners = pickRandomWinners(contestants, numberOfWinners);
  displayWinners(winners);
}

function displayTotalContestants(count) {
  const resultBox = document.getElementById("competitors");
  resultBox.innerHTML = `Total contestants: <strong>${count}</strong>`;
}

function extractContestants(ulMatches, uniqueContestants) {
  const contestants = [];
  const aRegex = /<a\b[^>]*>([\s\S]*?)<\/a>/gi;
  const timeRegex = /<time\s+class\s*=\s*["']([^"']*)["']/i;

  ulMatches.forEach((ul) => {
    let match;
    while ((match = aRegex.exec(ul))) {
      const contestantHtml = match[0]; // Full HTML of the <a> tag
      if (timeRegex.test(contestantHtml)) {
        continue; // Skip if <time> tag with class is found
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
  // Check length and character validity
  if (
    contestant.length > 1 &&
    contestant.length < 30 &&
    /^[a-zA-Z0-9.]*$/.test(contestant)
  ) {
    // Check uniqueness if required
    if (uniqueContestants && existingContestants.includes(contestant)) {
      return false; // Not unique and should be skipped
    }
    return true;
  }
  return false; // Does not meet criteria
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
