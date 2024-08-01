async function fetchRandomWords(n = "") {
    try {
        if (!Number.isInteger(n)) n = ""
        const response = await fetch(`/api/get?words=${n}`);
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
        wordList.appendChild(wordElement);
    });

    const wordElements = document.querySelectorAll('.word-list div');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        const middlePoint = scrollTop + (windowHeight / 2);
        wordElements.forEach((element, index) => {
            const rect = element.getBoundingClientRect();
            const elementMiddle = rect.top + window.scrollY + (rect.height / 2);
            if (elementMiddle > middlePoint - rect.height / 2 && elementMiddle < middlePoint + rect.height / 2) {
                document.getElementById('highlight').textContent = element.textContent;
            }
        });
    });
});
