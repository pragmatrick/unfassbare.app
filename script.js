async function fetchWords(n = "") {
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

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

document.addEventListener('DOMContentLoaded', async () => {
    const words = await fetchWords();
    const shuffledWords = shuffleArray(words);
    const wordListContainer = document.getElementById('wordListContainer');
    const wordList = document.getElementById('wordList');
    let listSorted = false;

    setHighlightWidth(shuffledWords);
    populateWordList(wordList, shuffledWords);
    setupInfiniteScroll();
    updateSlogan();

    wordListContainer.addEventListener('scroll', () => {
        handleInfiniteScroll();
        updateSlogan();
    });
    
    document.getElementById('sort-button').addEventListener('click', function () {
        listSorted = !listSorted;
        if (listSorted) {
            populateWordList(wordList, words);
            document.getElementById('sort-icon').src="images/sort-alphabetical.svg";
        }
        else {
            populateWordList(wordList, shuffledWords);
            document.getElementById('sort-icon').src="images/sort-random.svg";
        }
        updateSlogan();
    });

    document.getElementById('slogan').addEventListener('click', () => {
        const sloganText = `${document.getElementById('part1').textContent} ${document.getElementById('highlight').textContent} ${document.getElementById('part2').textContent}`;
        navigator.clipboard.writeText(sloganText);
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

    function updateSlogan() {
        const wordElements = wordList.children;
        const containerRect = wordListContainer.getBoundingClientRect();
        const middle = containerRect.top + containerRect.height / 2;
        
        // Find the word element that is closest to the middle of the container
        let closest = null;
        let closestDist = Infinity;

        for (const wordElement of wordElements) {
            const rect = wordElement.getBoundingClientRect();
            const dist = Math.abs(middle - rect.top - rect.height / 2);
            if (dist < closestDist) {
                closest = wordElement;
                closestDist = dist;
            }
        }

        if (closest) {
            document.getElementById('highlight').textContent = closest.textContent+"EN";
        }
    }

    function getMaxWidth(words) {
        const tempElement = document.createElement('h1');
        tempElement.style.position = 'absolute';
        tempElement.style.visibility = 'hidden';
        tempElement.style.whiteSpace = 'nowrap';
        document.body.appendChild(tempElement);

        let maxWidth = 0;
        words.forEach(word => {
            tempElement.textContent = word+"EN";
            const width = tempElement.offsetWidth;
            if (width > maxWidth) {
                maxWidth = width;
            }
        });

        document.body.removeChild(tempElement);
        return maxWidth;
    }

    function setHighlightWidth(shuffledWords) {
        const maxWidth = getMaxWidth(shuffledWords);
        const slogan = document.getElementById('slogan');
        const part1 = document.getElementById('part1');
        const highlightElement = document.getElementById('highlight');
        const part2 = document.getElementById('part2');

        // Set the width of the highlight element
        highlightElement.style.display = 'inline-block';
        highlightElement.style.width = `${maxWidth}px`;

        // Adjust the positioning of part1 and part2
        slogan.style.justifyContent = 'center';
        slogan.style.alignItems = 'center';
        slogan.style.gap = '10px';

        // Center the word list relative to the highlight element
        const offset = (slogan.offsetWidth - highlightElement.offsetWidth) / 2;
        slogan.style.paddingLeft = `${offset/2+10}px`;
        slogan.style.visibility = 'visible';
    }

    function handleInfiniteScroll() {
        const scrollTop = wordListContainer.scrollTop;
        const scrollHeight = wordListContainer.scrollHeight;
        const containerHeight = wordListContainer.clientHeight;

        if (scrollTop <= 0) {
            wordListContainer.scrollTop = scrollHeight / 2;
        } else if (scrollTop + containerHeight >= scrollHeight) {
            wordListContainer.scrollTop = scrollHeight / 2 - containerHeight;
        }
    }

    // Prepend and append clones of the word list to create the infinite effect
    function setupInfiniteScroll() {
        // Adjust the scroll position to the div containing the word list
        wordListContainer.scrollTop = wordList.clientHeight;
    }
});
