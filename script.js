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

document.addEventListener('DOMContentLoaded', async () => {
    const words = await fetchRandomWords();

    const wordList = document.getElementById('wordList');

    words.forEach(word => {
        const wordElement = document.createElement('div');
        wordElement.textContent = word;
        wordElement.addEventListener('click', () => {
            document.getElementById('highlight').textContent = word;
        });
        wordList.appendChild(wordElement);
    });

    const wordElements = document.querySelectorAll('.word-list div');
    wordElements.forEach(wordElement => {
        wordElement.addEventListener('click', () => {
            wordElements.forEach(el => el.classList.remove('active'));
            wordElement.classList.add('active');
        });
    });

    wordList.addEventListener('scroll', () => {
        const scrollTop = wordList.scrollTop;
        const elementHeight = wordElements[0].offsetHeight;
        const index = Math.round(scrollTop / elementHeight);
        const word = words[index];
        document.getElementById('highlight').textContent = word;
    });
});
