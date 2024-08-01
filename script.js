async function fetchRandomWords(n = "") {
    try {
        if (!Number.isInteger(n)) n = "";
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

    const shuffledWords = shuffleArray(words);

    const wordListContainer = document.getElementById('wordListContainer');
    const wordList = document.getElementById('wordList');

    populateWordList(wordList, shuffledWords);

    // Calculate the maximum width of the words and set the highlight width accordingly
    const maxWidth = getMaxWidth(shuffledWords);
    setHighlightWidth(maxWidth);

    const highlightElement = document.getElementById('highlight');

    wordListContainer.addEventListener('scroll', () => {
        handleInfiniteScroll();
        updateSlogan();
    });

    function populateWordList(container, words) {
        container.innerHTML = '';
        words.forEach(word => {
            const wordElement = document.createElement('div');
            wordElement.textContent = word;
            container.appendChild(wordElement);
        });

        // Duplicate the list to create an infinite scrolling effect
        words.forEach(word => {
            const wordElement = document.createElement('div');
            wordElement.textContent = word;
            container.appendChild(wordElement);
        });
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function updateSlogan() {
        const wordElements = wordList.children;
        const containerRect = wordListContainer.getBoundingClientRect();
        const middle = containerRect.top + containerRect.height / 2;
        let closest = wordElements[0];
        let closestDist = Math.abs(middle - closest.getBoundingClientRect().top);

        for (const wordElement of wordElements) {
            const dist = Math.abs(middle - wordElement.getBoundingClientRect().top);
            if (dist < closestDist) {
                closest = wordElement;
                closestDist = dist;
            }
        }

        highlightElement.textContent = closest.textContent;
    }

    function getMaxWidth(words) {
        const tempElement = document.createElement('div');
        tempElement.style.position = 'absolute';
        tempElement.style.visibility = 'hidden';
        tempElement.style.whiteSpace = 'nowrap';
        document.body.appendChild(tempElement);

        let maxWidth = 0;
        words.forEach(word => {
            tempElement.textContent = word;
            const width = tempElement.offsetWidth;
            if (width > maxWidth) {
                maxWidth = width;
            }
        });

        document.body.removeChild(tempElement);
        return maxWidth;
    }

    function setHighlightWidth(maxWidth) {
        const highlightElement = document.getElementById('highlight');
        const part1 = document.getElementById('part1');
        const part2 = document.getElementById('part2');

        // Set the width of the highlight element
        highlightElement.style.display = 'inline-block';
        highlightElement.style.width = `${maxWidth}px`;

        // Adjust the positioning of part1 and part2
        const slogan = document.querySelector('.slogan');
        slogan.style.display = 'flex';
        slogan.style.justifyContent = 'center';
        slogan.style.alignItems = 'center';
        slogan.style.gap = '10px';
    }

    updateSlogan();
});