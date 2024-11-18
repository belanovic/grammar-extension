

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
    textArticle.value = localStorage.getItem('textArticle');
    btnArticleSend.addEventListener('click', (e) => arrangeArticle(textArticle))
    const btnArticleStrip = document.getElementsByClassName('btnArticleStrip')[0];
    btnArticleStrip.addEventListener('click', () => {
        textArticle.value = removeLargeHexadecimalParts(textArticle.value);
        function removeLargeHexadecimalParts(text) {
            let strippedText = text.replace(/[a-f0-9\s]{20}/gi, 'a');
            strippedText = strippedText.replace(/(a)\1+/g, '\n\n'); 
            return strippedText
        }
    })
    textArticle.addEventListener('change', (e) => {
        localStorage.setItem('textArticle', e.target.value);
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

}) 

async function arrangeArticle(textArticle) {
    async function sendText() {
        
        if(!window.confirm(`Да ли желите да пошаљете текст ChatGPT-ju?`)) return;
        try {
            const response = await fetch(/* 'http://localhost:3000/chatGPT/article'  */'https://grammar-backend.onrender.com/chatGPT/article', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify({
                    text: textArticle.value,
                    prompt: "Среди овај новински текст на српском, у стилу чланака на сајту Радио-телевизије Србије. Немој да уклониш регуларан текст, само исправи шта је потребно. Уклони сувишне размаке између речи, направи пасусе, исправи словне грешке, али немој да изоставиш ниједан део регуларног текста. Имена и презимена треба само да почињу великим словом. Текст треба да буде на ћирилици. Измисли пет занимљивих наслова на основу текста. Ево текста: ",
                    description: 'Ви сте асистент за сређивање новинских текстова на српском језику за сајт Радио-телевизије Србије'
                })
            });
            const responseBody = await response.text();
            return responseBody
        } catch (error) {
            alert(error.message);
            return
        }
    }

    let answer = await sendText();

    answer = JSON.parse(answer);
    
    
    if((!answer) || (answer == []) || (answer == '')) {
        alert('ChatGPT није средио текст');
        return
    };
    textArticle.value = answer;
}

