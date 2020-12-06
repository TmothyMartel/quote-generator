const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');
const errorText = document.getElementById('error-text');
let getQuoteAttempts = 0;
function showLoadingSpinner() {
    loader.hidden = false;
    quoteContainer.hidden = true;
}

function removeLoadingSpinner() {
    if (!loader.hidden) {
        quoteContainer.hidden = false;
        loader.hidden = true;
    }
}

// Get Quote From API
async function getQuote() {
    showLoadingSpinner();
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const apiUrl = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
    
    try {
        const response = await fetch(proxyUrl + apiUrl);
        const data = await response.json();
        
        // if author field is blank, make author text unkown.
        (data.quoteAuthor === '') ? authorText.innerText = "Unknown" : authorText.innerText = data.quoteAuthor;

        // reduce font size for long quotes
        (data.quoteText.length > 120) ? quoteText.classList.add('long-quote') : quoteText.classList.remove('long-quote') 
        quoteText.innerText = data.quoteText;
       
        removeLoadingSpinner();
    } catch (error) {
        if (getQuoteAttempts < 8) {
            getQuote();
            getQuoteAttempts++;
        } else {
            errorText.innerText = "An error has occured please try again in a few minutes";
            removeLoadingSpinner();
        }
        
        
    }
}

// share quote as a tweet
function tweetQuote() {
    const quote = quoteText.innerText;
    const author = authorText.innerText;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
    window.open(twitterUrl, '_blank')
}

// Event Listeners
newQuoteBtn.addEventListener('click', getQuote);
twitterBtn.addEventListener('click', tweetQuote);

// on load;
getQuote();

