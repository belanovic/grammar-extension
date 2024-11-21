  
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "checkSpelling") {
        checkSpelling();
    }
    if (request.action === "checkFacts") {
        checkFacts();
    }
   
  });


async function checkSpelling() {
    async function sendText() {
        
        if(!window.confirm(`Да ли желите да пошаљете текст ChatGPT-ju?`)) return;
        try {
            const response = await fetch(/* 'http://localhost:3000/chatGPT/spelling'  */'https://grammar-backend.onrender.com/chatGPT/spelling', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify({
                    text: document.getElementById('content').innerText,
                    prompt: "Детаљно прегледај новински чланак на српском. Пронађи граматичке грешке. Сваку реч или фразу за коју пронађеш грешку, стави под наводнике и потом у низ []. У одговору врати само низ. Ако нема грешака, врати само празан низ []. Ево чланка:  ",
                    description: 'Ви сте асистент за проверу граматике са знањем српског језика. Пажљиво анализирајте дати текст да ли постоје граматичке, правописне или стилске грешке'
                })
            });
            const responseBody = await response.json();
            return responseBody
        } catch (error) {
            alert(error.message);
            return
        }
    }

    function highlightTextByKeyword(keyword) {
        const correction = 'ovo je neka korekcikja ij tako dalje i i neki savet';
        const bodyText = document.body.innerHTML;
        const regex = new RegExp(`(${keyword})`, "gi"); // Case-insensitive search for keyword
        const highlightedText = bodyText.replace(regex, `<span class = "answer"><span class="highlight">$1</span><span class = "correction">${correction}</span></span>`);
    
        document.body.innerHTML = highlightedText;
    
        // Apply CSS style to the highlight class
        const style = document.createElement("style");
        style.innerHTML = `
        .answer {
            display: inline;
            position: relative;
        }
        .highlight {
            background-color: yellow;
            color: black;
            font-weight: bold;
        }
        .correction {
            display: none;
            background-color: lightgreen;
            color: black;
            position: absolute;
            width: 200px;
        }
        .answer:hover .correction {
            display: inline;
        }
        `;
        document.head.appendChild(style);
    }
    

    let answer = await sendText();
    answer = JSON.parse(answer);
    
    
    if((!answer) || (answer == []) || (answer == '')) {
        alert('ChatGPT није пронашао грешке');
        return
    };
    alert('ChatGPT је пронашао следеће грешке: ' + answer);
    answer.forEach((elem, i) => {
        highlightTextByKeyword(elem)
    });

}



async function checkFacts() {
    async function sendText() {
        
        if(!window.confirm(`Да ли желите да пошаљете текст ChatGPT-ju?`)) return;
        try {
            const response = await fetch('http://localhost:3000/chatGPT/facts'/*  'https://grammar-backend.onrender.com/chatGPT/facts' */, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify({
                    text: document.getElementById('content').innerText,
                    prompt: "Детаљно прегледај новински чланак на српском. Пронађи речи, делове реченица или реченице које би могле да буду формулисане стилски, логички или граматички исправније. Направи json објекат за сваку реч или реченицу коју пронађеш и стави објекте у низ []. Први property json објекта треба да се зове 'phrase' и да за вредност има речи или реченицу, под наводницима, која би могла да буде формулисана другачије. Други property треба да се зове 'correction' и да има вредност предложене исправке, под наводницима. Дакле, овако треба да изгледа json објекат: {phrase: 'овде иде реч или реченица која би могла да се формулише другачије', correction: 'овде иде предложена корекција'}. Одговори само низом [] у којем су json објекти. Ако нема пронађених речи или реченица које би могле да буду формулисане другачије, врати само празан низ []. Ево чланка:  ",
                    description: 'Ви сте асистент за проверу језичког стила са знањем српског језика. Пажљиво анализирајте дати новински чланак у стилу сајта Радио-телевизије Србије'
                })
            });
            const responseBody = await response.json();
            return responseBody
        } catch (error) {
            alert(error.message);
            return
        }
    }
    function highlightTextByKeyword(obj) {
        const correction = obj.correction;
        const bodyText = document.body.innerHTML;
        const regex = new RegExp(`(${obj.phrase})`, "gi"); // Case-insensitive search for keyword
        const highlightedText = bodyText.replace(regex, `<span class = "answer"><span class="highlight">$1</span><span class = "correction">${correction}</span></span>`);
    
        document.body.innerHTML = highlightedText;
    
        // Apply CSS style to the highlight class
        const style = document.createElement("style");
        style.innerHTML = `
        .answer {
            display: inline;
            position: relative;

        }
        .highlight {
            background-color: yellow;
            color: black;
            font-weight: bold;
        }
        .correction {
            display: none;
            background-color: lightgreen;
            color: black;
            position: absolute;
            width: 200px;
            z-index: 1;
        }
        .answer:hover .correction {
            display: inline;
        }
        .correction:active .correction {
            display: inline;
        }
        `;
        document.head.appendChild(style);
    }
    

    let answer = await sendText();

    answer = JSON.parse(answer);
    
    
    if((!answer) || (answer == []) || (answer == '')) {
        alert('ChatGPT није пронашао грешке');
        return
    };
    alert('ChatGPT је пронашао следеће грешке: ' + answer);
    answer.forEach((elem, i) => {
        highlightTextByKeyword(elem)
    });

}

