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

    const shuffledWords = shuffleArray(words);

    const wordListContainer = document.createElement('div');
    wordListContainer.classList.add('word-list-container');
    document.body.appendChild(wordListContainer);

    const wordList = document.createElement('div');
    wordList.classList.add('word-list');
    wordListContainer.appendChild(wordList);

    populateWordList(wordList, shuffledWords);

    let isScrolling = false;
    let maxWidth = getMaxWidth(shuffledWords);

    // Update slogan with max width
    const sloganElement = document.querySelector('.slogan');
    sloganElement.style.width = `${maxWidth}px`;

    window.addEventListener('wheel', (event) => {
        if (isScrolling) return;
        isScrolling = true;
        
        const direction = Math.sign(event.deltaY);
        scrollWordList(direction);

        setTimeout(() => {
            isScrolling = false;
        }, 300); // Adjust the delay to control the scroll speed
    });

    function populateWordList(container, words) {
        container.innerHTML = '';
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

    function scrollWordList(direction) {
        const wordElements = wordList.children;
        const wordHeight = wordElements[0].offsetHeight;

        wordList.style.transition = 'none';
        wordList.style.transform = `translateY(${direction * wordHeight}px)`;

        setTimeout(() => {
            wordList.style.transition = 'transform 0.3s ease-in-out';
            wordList.style.transform = `translateY(0px)`;

            if (direction > 0) {
                wordList.insertBefore(wordList.lastElementChild, wordList.firstElementChild);
            } else {
                wordList.appendChild(wordList.firstElementChild);
            }

            updateSlogan();
        }, 0);
    }

    function updateSlogan() {
        const middleIndex = Math.floor(wordList.children.length / 2);
        const middleWord = wordList.children[middleIndex].textContent;
        document.getElementById('highlight').textContent = middleWord;
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

    updateSlogan();
});
