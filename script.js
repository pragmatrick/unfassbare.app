async function fetchRandomWords(n = "") {
    try {
        if (!Number.isInteger(n)) n = ""
        const response = await fetch(`/api/get/?words=${n}`);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const wordsArray = await response.json();
        return wordsArray;
    } catch (error) {
        console.error('Error fetching words:', error);
        alert('There was an error fetching words. Please try again later.');
        return [];
    }
}

async function fetchNewWord() {
    const words = await fetchRandomWords(1);
    document.getElementById('word').innerText = words[0];
}

async function fetchAllWords() {
    const words = await fetchRandomWords(null);
    document.getElementById('all-words').innerText = words.join(', ');
}