chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "checkSpelling") {
        chrome.storage.local.get('API_KEY', (result) => checkSpelling(result.API_KEY));
    }
    if (request.action === "checkFacts") {
        chrome.storage.local.get('API_KEY', (result) => checkFacts(result.API_KEY));
    }
    if (request.action === "checkComments") {
        chrome.storage.local.get('API_KEY', (result) => checkComments(result.API_KEY));
    }
   
  });


async function checkSpelling(API_KEY) {
    if(!document.getElementsByClassName('rts')[0]) {
        alert(`Нисте на сајту Радио-телевизије Србије`)
        return
    }; 
    if(!window.confirm(`Да ли желите да пошаљете текст ChatGPT-ju?`)) return;

    const text = document.getElementById('content').innerText;
    const prompt = "Детаљно прегледај новински чланак на српском. Пронађи граматичке грешке. Сваку реч или фразу за коју пронађеш грешку, стави под наводнике и потом у низ []. У одговору врати само низ. Ако нема грешака, врати само празан низ []. Ево чланка:  ";
    const description = 'Ви сте асистент за проверу граматике са знањем српског језика. Пажљиво анализирајте дати текст да ли постоје граматичке, правописне или стилске грешке';

    try {
        let answer = await callChatGPT(text, prompt, description, API_KEY);
        let strippedAnswer = extractArrayFromString(answer);
        strippedAnswer = JSON.parse(strippedAnswer);
        if((!strippedAnswer) || (strippedAnswer == []) || (strippedAnswer == '')) {
            alert('ChatGPT није пронашао грешке');
            return
        }
        alert('ChatGPT је пронашао следеће грешке: ' + strippedAnswer);
        strippedAnswer.forEach((elem, i) => {
            highlightTextByKeyword(elem)
        });
    } catch (error) {
        alert(error.message);
    }

    function highlightTextByKeyword(keyword) {
        const bodyText = document.body.innerHTML;
        const regex = new RegExp(`(${keyword})`, "gi"); 
        const highlightedText = bodyText.replace(regex, `<span class="highlight">$1</span>`);
    
        document.body.innerHTML = highlightedText;
    
        const style = document.createElement("style");
        style.innerHTML = `
        .highlight {
            background-color: yellow;
            color: black;
            font-weight: bold;
        }
        `;
        document.head.appendChild(style);
    }

}


async function checkFacts(API_KEY) {
    if(!document.getElementsByClassName('rts')[0]) {
        alert(`Нисте на сајту Радио-телевизије Србије`)
        return
    }; 
    if(!window.confirm(`Да ли желите да пошаљете текст ChatGPT-ju?`)) return;

    const text = document.getElementById('content').innerText;
    const prompt = "Детаљно прегледај новински чланак на српском. Пронађи речи, делове реченица или реченице које би могле да буду формулисане стилски, логички или граматички исправније. Направи json објекат за сваку реч или реченицу коју пронађеш и стави објекте у низ []. Први property json објекта треба да се зове 'phrase' и да за вредност има речи или реченицу, под наводницима, која би могла да буде формулисана другачије. Други property треба да се зове 'correction' и да има вредност предложене исправке, под наводницима. Дакле, овако треба да изгледа json објекат: {phrase: 'овде иде реч или реченица која би могла да се формулише другачије', correction: 'овде иде предложена корекција'}. Одговори само низом [] у којем су json објекти. Ако нема пронађених речи или реченица које би могле да буду формулисане другачије, врати само празан низ []. Ево чланка:  ";
    const description = 'Ви сте асистент за проверу језичког стила са знањем српског језика. Пажљиво анализирајте дати новински чланак у стилу сајта Радио-телевизије Србије';

    try {
        let answer = await callChatGPT(text, prompt, description, API_KEY);
        let strippedAnswer = extractArrayFromString(answer);
        strippedAnswer = JSON.parse(strippedAnswer);
        if((!strippedAnswer) || (strippedAnswer == []) || (strippedAnswer == '')) {
            alert('ChatGPT није пронашао стилске грешке');
            return
        }
        alert('ChatGPT је препоручује следеће исправке:');
        strippedAnswer.forEach((elem, i) => {
            highlightTextByKeyword(elem)
        });
    } catch (error) {
        alert(error.message);
    }

    function highlightTextByKeyword(obj) {
        const correction = obj.correction;
        const bodyText = document.body.innerHTML;
        const regex = new RegExp(`(${obj.phrase})`, "gi");
        const highlightedText = bodyText.replace(regex, `<span class = "answer"><span class="highlight">$1</span><span class = "correction" style = "min-width: ${correction.split(' ').length > 1? '250px' : ''};}">${correction}</span></span>`);
    
        document.body.innerHTML = highlightedText;
    
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
            background-color: rgb(101, 255, 59);
            color: black;
            position: absolute;
            
            padding: 5px 10px 5px 10px;
            z-index: 1;
            font-size: 1rem;
            border-radius: 0% 10% 0% 10%;
            
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
}

async function checkComments(API_KEY) {
    if(!document.getElementsByClassName('coomentsTable')[0]) {
        alert(`Нисте у коментарима`)
        return
    }
    if(!window.confirm(`Да ли желите да пошаљете коментаре ChatGPT-ju?`)) return;


    const text = document.getElementsByClassName('tbody')[0].innerText
    const prompt = "Детаљно прегледај коментаре читалаца на новинске чланке на српском, на сајту Радио-телевизије Србије. Пронађи речи, делове реченица или реченице које су увредљиве. Направи json објекат за сваку реч или реченицу коју пронађеш и стави објекте у низ []. Први property json објекта треба да се зове 'phrase' и да за вредност има речи или реченицу, под наводницима, које су увредљиве. Други property треба да се зове 'explanation' и да за вредност има објашњење, под наводницима, зашто су пронађене речи увредљиве. Дакле, овако треба да изгледа json објекат: {phrase: 'овде иде реч или реченица који су увредљиви', explanation: 'овде иде објашњење'}. Одговори само низом [] у којем су json објекти. Ако нема пронађених речи или реченица које су увредљиве, врати само празан низ []. Ево коментара:  ";
    const description = 'Ви сте асистент за проверу коментара читалаца сајта Радио-телевизије Србије. Пажљиво анализирајте дате коментаре и пронађите увредљиве речи, фразе или реченице'

    try {
        let answer = await callChatGPT(text, prompt, description, API_KEY);
        let strippedAnswer = extractArrayFromString(answer);
        strippedAnswer = JSON.parse(strippedAnswer);
        if((!strippedAnswer) || (strippedAnswer == []) || (strippedAnswer == '')) {
            alert('ChatGPT није пронашао увреде');
            return
        }
        alert('ChatGPT препоручује следеће исправке:');
        strippedAnswer.forEach((elem, i) => {
            highlightTextByKeyword(elem)
        });
    } catch (error) {
        alert(error.message);
    }

    function highlightTextByKeyword(obj) {
        const explanation = obj.explanation;
        const bodyText = document.body.innerHTML;
        const regex = new RegExp(`(${obj.phrase})`, "gi"); // Case-insensitive search for keyword
        const highlightedText = bodyText.replace(regex, `<span class = "answer"><span class="highlight">$1</span><span class = "correction" style = "min-width: ${explanation.split(' ').length > 1? '250px' : ''};}">${explanation}</span></span>`);
    
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
            background-color: rgb(101, 255, 59);
            color: black;
            position: absolute;
            
            padding: 5px 10px 5px 10px;
            z-index: 1;
            font-size: 1rem;
            border-radius: 0% 10% 0% 10%;
            
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
}

  /////////// funkcije 
  
  function extractArrayFromString(inputString) {
    const match = inputString.match(/\[.*\]/s);
    
    if (match) {
        return match[0]; 
    } else {
        return null; 
    }
  }

 
    
    async function callChatGPT(text, prompt, description, API_KEY) {
        
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [
                { role: 'system', content: description},
                { role: 'user', content: prompt + text}
                ],
                temperature: 0.2,
                max_tokens: 3200,
                top_p: 1
    
            })
            });
        
            if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
        
            const data = await response.json();
            return data.choices[0].message.content; 
        } catch (error) {
            return error.message
        }
        }

