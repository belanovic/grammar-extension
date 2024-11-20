

document.addEventListener("DOMContentLoaded", function() {

    const tab = document.getElementsByClassName('tab');
    const operation = document.getElementsByClassName('operation');

    tab[0].addEventListener('click', () => {
        tab[0].classList.add('active');
        tab[1].classList.remove('active');
        tab[2].classList.remove('active');

        operation[0].classList.add('active');
        operation[1].classList.remove('active');
        operation[2].classList.remove('active');
    })
    tab[1].addEventListener('click', () => {
        tab[0].classList.remove('active');
        tab[1].classList.add('active');
        tab[2].classList.remove('active');

        operation[0].classList.remove('active');
        operation[1].classList.add('active');
        operation[2].classList.remove('active');
    })
    tab[2].addEventListener('click', () => {
        tab[0].classList.remove('active');
        tab[1].classList.remove('active');
        tab[2].classList.add('active');

        operation[0].classList.remove('active');
        operation[1].classList.remove('active');
        operation[2].classList.add('active');
    })


    const btnSpelling = document.getElementsByClassName('spelling')[0];
    const btnFacts = document.getElementsByClassName('facts')[0];
    const btnArticleSend = document.getElementsByClassName('btnArticleSend')[0];
    const textArticle = document.getElementsByClassName('textArticle')[0];

    chrome.storage.local.get('textArticle', (result) => textArticle.value = result.textArticle);
    

    const btnArticleStrip = document.getElementsByClassName('btnArticleStrip')[0];

    btnArticleStrip.addEventListener('click', () => {
        textArticle.value = removeLargeHexadecimalParts(textArticle.value);
        function removeLargeHexadecimalParts(text) {
            let strippedText = text.replace(/[a-f0-9\s]{20}/gi, 'a');
            strippedText = strippedText.replace(/(a)\1+/g, '\n\n'); 
            return strippedText
        }
    })
    textArticle.addEventListener('input', (e) => {
        chrome.storage.local.set({textArticle: e.target.value});
    })

    
    btnSpelling.addEventListener('click', function() {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.runtime.sendMessage({ action: "checkSpelling", tabId: tabs[0].id });
        });
    })
    btnFacts.addEventListener('click', function() {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.runtime.sendMessage({ action: "checkFacts", tabId: tabs[0].id });
        });
    })
    btnArticleSend.addEventListener('click', function() {
        if(!window.confirm(`Да ли желите да пошаљете текст ChatGPT-ju?`)) return;
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.runtime.sendMessage({ action: "arrangeArticle", tabId: tabs[0].id });
        });
    })
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === 'textArranged') {
            chrome.storage.local.get('textArticle', (result) => textArticle.value = result.textArticle);
          }
        sendResponse({ status: 'Message received by popup' });
    })

}) 
