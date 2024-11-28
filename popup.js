 

document.addEventListener("DOMContentLoaded", function() {
   

    const tab = document.getElementsByClassName('tab');
    
    const operation = document.getElementsByClassName('operation');

    tab[0].addEventListener('click', () => {
        tab[0].classList.add('active');
        tab[1].classList.remove('active');
        tab[2].classList.remove('active');
        tab[3].classList.remove('active');

        operation[0].classList.add('active');
        operation[1].classList.remove('active');
        operation[2].classList.remove('active');
        operation[3].classList.remove('active');
    })
    tab[1].addEventListener('click', () => {
        tab[0].classList.remove('active');
        tab[1].classList.add('active');
        tab[2].classList.remove('active');
        tab[3].classList.remove('active');

        operation[0].classList.remove('active');
        operation[1].classList.add('active');
        operation[2].classList.remove('active');
        operation[3].classList.remove('active');
    })
    tab[2].addEventListener('click', () => {
        tab[0].classList.remove('active');
        tab[1].classList.remove('active');
        tab[2].classList.add('active');
        tab[3].classList.remove('active');

        operation[0].classList.remove('active');
        operation[1].classList.remove('active');
        operation[2].classList.add('active');
        operation[3].classList.remove('active');
    })
    tab[3].addEventListener('click', () => {
        tab[0].classList.remove('active');
        tab[1].classList.remove('active');
        tab[2].classList.remove('active');
        tab[3].classList.add('active');

        operation[0].classList.remove('active');
        operation[1].classList.remove('active');
        operation[2].classList.remove('active');
        operation[3].classList.add('active');
    })


    const btnSpelling = document.getElementsByClassName('spelling')[0];
    const btnFacts = document.getElementsByClassName('facts')[0];
    const btnComments = document.getElementsByClassName('btnComments')[0];
    const btnArticleSend = document.getElementsByClassName('btnArticleSend')[0];
    const btnArticleStrip = document.getElementsByClassName('btnArticleStrip')[0];
    const btnArticleCopy = document.getElementsByClassName('btnArticleCopy')[0];
    const textArticle = document.getElementsByClassName('textArticle')[0];
    const textOverlay = document.getElementsByClassName('textOverlay')[0];

    chrome.storage.local.get('textArticle', (result) => textArticle.value = result.textArticle);
    
 /*    setOverlay(textOverlay, 'show'); */

    chrome.storage.local.get('requestArticlePending', (result) => {
        if(result.requestArticlePending == true) {
            setOverlay(textOverlay, 'show')
        }
        if(result.requestArticlePending == false) {
            setOverlay(textOverlay, 'hide')
        }
    });

    

    btnArticleStrip.addEventListener('click', () => {
        textArticle.value = removeLargeHexadecimalParts(textArticle.value);
        chrome.storage.local.set({textArticle: textArticle.value});
        function removeLargeHexadecimalParts(text) {
            let strippedText = text.replace(/[a-f0-9\s]{20}/gi, 'a');
            strippedText = strippedText.replace(/(a)\1+/g, '\n\n'); 
            return strippedText
        }
    })
    btnArticleCopy.addEventListener('click', () => {
        navigator.clipboard.writeText(textArticle.value);
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
    btnComments.addEventListener('click', function() {
        
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.runtime.sendMessage({ action: "checkComments", tabId: tabs[0].id });
        });
    })
    btnArticleSend.addEventListener('click', function() {
        if(!window.confirm(`Да ли желите да пошаљете текст ChatGPT-ju?`)) return;
        setOverlay(textOverlay, 'show');
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.runtime.sendMessage({ action: "arrangeArticle", tabId: tabs[0].id });
        });
    })
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        setOverlay(textOverlay, 'hide');
        if (message.type === 'textArranged') {
            chrome.storage.local.get('textArticle', (result) => textArticle.value = result.textArticle);
          }
       
    })

}) 


function setOverlay(overlay, option) {
    if(option == 'show') {
        overlay.style.display = 'flex';
        overlay.style.transition = "all 0.5s";
        overlay.style.background = 'rgba(0, 0, 0, 1)';
    }
    if(option == 'hide') {
        overlay.style.transition = "all 0.5s";
        overlay.style.background = 'rgba(0, 0, 0, 0)';
        overlay.style.display = 'none';
    }
}