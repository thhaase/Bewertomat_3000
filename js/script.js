document.addEventListener('DOMContentLoaded', function() {
    fetch('data/gutachten_phrases.json')
        .then(response => response.json())
        .then(data => populateCategories(data))
        .catch(error => console.error('Error loading JSON:', error));

    document.getElementById('deleteText').addEventListener('click', function() {
        document.getElementById('phraseField').value = ''; // Clear the textfield
    });

    document.getElementById('copyText').addEventListener('click', function() {
        const phraseField = document.getElementById('phraseField');
        phraseField.select(); // Select the text
        document.execCommand('copy'); // Copy the text to clipboard
        window.getSelection().removeAllRanges(); // Deselect the text
    });
});

function populateCategories(data) {
    const topbar = document.getElementById('topbar');
    topbar.innerHTML = '';

    Object.keys(data).forEach(section => {
        let sectionDiv = document.createElement('div');
        sectionDiv.className = 'menu';
        sectionDiv.innerText = section;
        sectionDiv.addEventListener('click', function() {
            clearSelected(topbar); // Remove 'selected' class from all in the topbar
            this.classList.add('selected'); // Highlight this category
            populateRatings(section, data[section]); // Prepare ratings buttons
            clearPhrases(); // Clear any previously displayed phrases
        });
        topbar.appendChild(sectionDiv);
    });
}

function populateRatings(section, ratings) {
    const ratingsBar = document.getElementById('ratingsBar') || document.createElement('div');
    ratingsBar.innerHTML = ''; // Clear previous content each time a new main category is selected
    ratingsBar.id = 'ratingsBar';

    Object.keys(ratings).forEach(rating => {
        let ratingDiv = document.createElement('div');
        ratingDiv.className = `rating ${rating}`;
        ratingDiv.innerText = rating.charAt(0).toUpperCase() + rating.slice(1);
        ratingDiv.addEventListener('click', function() {
            clearSelected(ratingsBar); // Remove 'selected' class from all in the ratings bar
            this.classList.add('selected'); // Highlight the clicked rating
            showPhrases(ratings[rating]); // Now show phrases for the selected rating
        });
        ratingsBar.appendChild(ratingDiv);
    });

    const existingRatingsBar = document.getElementById('ratingsBar');
    if (!existingRatingsBar) {
        document.body.insertBefore(ratingsBar, document.getElementById('phraseField'));
    }
}

function clearSelected(parentElement) {
    parentElement.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
}

function clearPhrases() {
    const phrasesList = document.getElementById('phrasesList');
    if (phrasesList) {
        phrasesList.innerHTML = ''; // Clear the phrases list
    }
}

function showPhrases(phrases) {
    const phrasesList = document.getElementById('phrasesList') || document.createElement('ul');
    phrasesList.innerHTML = ''; // Clear previous phrases
    phrasesList.id = 'phrasesList';

    phrases.forEach(phrase => {
        let listItem = document.createElement('li');
        listItem.innerText = phrase;
        listItem.addEventListener('click', () => {
            const phraseField = document.getElementById('phraseField');
            phraseField.value += phrase + " "; // Append phrase directly behind each other
        });
        phrasesList.appendChild(listItem);
    });

    const existingPhrasesList = document.getElementById('phrasesList');
    if (!existingPhrasesList) {
        document.body.insertBefore(phrasesList, document.getElementById('phraseField'));
    } else {
        existingPhrasesList.replaceWith(phrasesList);
    }
}
