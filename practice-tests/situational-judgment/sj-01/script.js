// Test data structure
const scenarios = [
    {
        id: 1,
        title: "Superluxe Hotels",
        description: "You are a trainee manager on a two year programme working for Superluxe Hotels, a national chain of 4 and 5 star hotels. The programme ensures that trainees gain experience in all areas of hotel and hospitality management through a rotational scheme of 4 month placements. You are currently undertaking your 'Guest Services' placement and you are based at the Alpston Grand, a five-star property and one of Superluxe's flagship hotels. You are working as second-in-command in the Grand Hotel Guest Services team; you report directly to the Guest Relations Manager. The primary job of the Guest Services team is to ensure that customers of the hotel receive an efficient and friendly welcome and departure, while ensuring the reception and front of house departments operate in an organised manner. The team must ensure a professional, friendly and courteous service is provided to all guests and that all complaints the hotel receives are handled properly. The Guest Services staff must also implement Superluxe occupancy policy which is to try to maximise occupancy on a daily basis.",
        questions: [
            {
                question: "It is 7.30pm. You are on duty at the concierge desk when a guest calls down to say that they have just checked in and are extremely unhappy with the cleanliness of their room. They say that the sink has hair in it, the tea cups are smeared and the curtains are dusty. The guest is only at the Grand for one night and has a business meeting in Alpston first thing in the morning.",
                options: [
                    {
                        text: "Apologise to the customer and say that you will ensure that the room is cleaned thoroughly within the next hour.",
                        explanation: "A reasonable response as you are offering to put the problem right; however the customer may not want to wait that long for a clean room, especially as he has an early morning meeting and may wish to get some rest this evening."
                    },
                    {
                        text: "Apologise and offer the customer a different room immediately; if necessary an upgraded room if no others are available in his original price range.",
                        explanation: "This is the most effective response as the customer will not have to wait for the situation to be rectified and he should be immediately satisfied. Make sure that the new room has been checked by you or someone else, however, before it is assigned."
                    },
                    {
                        text: "Apologise and offer the customer a discount on his room rate.",
                        explanation: "Not a particularly appropriate response although the customer may be pleased to receive a discount they will still be unhappy to be left in a dirty room."
                    },
                    {
                        text: "Apologise and arrange a complimentary room service meal and bottle of wine to be sent to the room.",
                        explanation: "This is the least effective response as the customer will still have a less than satisfactory room. Also, you don't really know whether the customer wants a meal and wine, he may have already eaten or may not want to drink before an important business meeting. It is unlikely to ensure his satisfaction with your hotel."
                    }
                ],
                competency: "Customer Service",
                mostEffective: 1,
                leastEffective: 3
            },
            {
                question: "It is 8pm on a Thursday evening in February. Fifty percent of the hotel's 300 rooms are currently occupied and a customer without a previous reservation has just arrived at the reception desk. The customer has enquired about the price of a standard double room. You have informed her that the room rate is £120 per night, including breakfast. The customer then asks whether you can let her have the room and breakfast for £80.",
                options: [
                    {
                        text: "Give her information on the town's inexpensive B&B accommodation and how to find it.",
                        explanation: "Not a particularly appropriate response as your aim to maximise room occupancy is not being pursued at all; although you are being helpful to the customer and therefore she may leave with a positive view of Superluxe Hotels."
                    },
                    {
                        text: "Say that you can offer her the room at £100 for the night and breakfast.",
                        explanation: "The most effective response as she was unlikely to have been expecting her first price to be accepted and was probably looking for you to split the difference between your first price and hers. In this way you have increased the hotel occupancy and ensured extra income to cover the fixed running costs which would be incurred whether or not that guest ended up staying."
                    },
                    {
                        text: "Say that the room rate is £120 and there are no discounts available.",
                        explanation: "This is the least effective response as the Superluxe policy is to maximise occupancy and half of the rooms are currently empty in the hotel. It is 8pm and therefore you are unlikely to fill the remaining 150 rooms, you may as well offer the customer some kind of deal to entice her to stay. The fixed costs of running the hotel remain the same whether it is empty or full."
                    },
                    {
                        text: "Say that if she returns at 9pm you will probably be able to give her a discount on the standard room rate then.",
                        explanation: "A reasonable response as it allows an extra hour for any other walk-in customers to arrive, at which point you will have a clear idea of the likely final occupancy for the night and be able to bargain with her confidently. She is unlikely to be put off by having to wait if she senses that she will probably get a discount at the end of the process, although there is a small risk that you will lose her custom."
                    }
                ],
                competency: "Analysis & Decision-Making",
                mostEffective: 1,
                leastEffective: 2
            }
        ]
    },
    {
        id: 2,
        title: "Handy Goods Ltd.",
        description: "You are a Field Sales Representative for Handy Goods Ltd. Your company supplies independent corner shops and convenience stores with non-food 'home essential' products such as sewing thread, scissors, paperclips, nail clippers, bootlaces, drawing pins, liquid paper etc. Your brand prides itself on providing all the items that the stores' customers might find it handy to be able to pick up along with their milk, bread and newspapers rather than having to make a special trip to the town centre shops. You have a range of 200 products and each is priced to allow your customers to be competitive with the High Street retailers. You are able to give discounts for bulk purchases. Your sales area is Saldringham City, its suburbs and outlying villages. You have 93 shops on your patch and you are tasked with visiting each one at least once each month. You spend an average of 20 to 30 minutes in a shop when you visit your customers.",
        questions: [
            {
                question: "You are visiting The Pop-in Shop convenience store on Bentley Road, Saldringham this morning. You have a friendly relationship with the proprietor, Ellen Gurty. Ellen has a regular order for a large number of your stationery lines such as pens, pencils, notepads, paper, wall tack and clear tape. However Ellen is grumbling today as trade hasn't been brilliant for her of late and one of your rival suppliers, MoreThanPens Direct, has approached her with a great introductory deal on stationery. They are a specialist office goods supplier and are usually more expensive than Handy Goods, although the quality of their products is also slightly superior. The deal that MoreThanPens have offered Ellen is a bargain, and she has told you today that she has been sorely tempted. You are authorised to give a 15% one-off discount to customers who say they might switch suppliers. You aren't sure how serious Ellen is about swapping as you know she enjoys your visits and the MoreThanPens representative will not hang around for a cup of tea like you do as his patch is much larger.",
                options: [
                    {
                        text: "Say to Ellen that you can understand that she is tempted by the offer from MoreThanPens and empathise with her recent poor sales. Talk to her about the likelihood that when the introductory offer runs out the prices could go higher than Handy Goods. Say you'd really like to talk to her this morning about what Handy Goods can do to keep her as a customer.",
                        explanation: "The most effective response. You are communicating fully to Ellen how important she is as a customer and giving her the key piece of information about the prices being 'introductory' only for the rival supplier. Also, you are not giving away the 15% discount without any need but giving yourself an opportunity to use it if necessary when talking to Ellen about her relationship with Handy Goods."
                    },
                    {
                        text: "Ignore Ellen's grumblings and have a nice cup of tea and a chat with her about her grandchildren; that always seems to cheer her up.",
                        explanation: "The least effective response. You are ignoring the possibility that Ellen is serious about changing suppliers and you are not communicating with her about the issue to let her know that you really value her custom."
                    },
                    {
                        text: "Have a chat with Ellen and ask her what her sales problems have been caused by. Say you can help her out with a 10% discount on this order if that will be helpful.",
                        explanation: "The second most effective response. You are giving a chance for Ellen to talk and listening to her answer about recent sales may give you some useful information. However, you need to ensure that she is fully aware of the difference between Handy Goods and MoreThanPens in the long-run."
                    },
                    {
                        text: "Offer her a 15% discount on her latest order from Handy Goods. This will undercut MoreThanPens quite neatly.",
                        explanation: "The third most effective response. You aren't giving Ellen the information that would be useful for her to make a decision about the relative expensiveness of MoreThanPens in the long-run. It may not be necessary to offer the discount at all once she has that information to consider. Also you could do more to engage in conversation with Ellen, which is clearly one of the things she values about her relationship with Handy Goods."
                    }
                ],
                competency: "Effective Communication",
                mostEffective: 0,
                leastEffective: 1
            },
            {
                question: "It is a Monday morning in May. You have five shop visits booked in today all for shops in the central area of Saldringham City. You were then planning on returning to the office for the later part of the afternoon in order to catch up on a backlog of paperwork. Your manager has just called you to say that your colleague Wendy is off sick today. Wendy had three appointments today in Alpston which is a town about 40 minutes' drive from Saldringham. Your manager is calling to ask whether you can cover any of the appointments as you are the closest sales rep to Wendy's patch.",
                options: [
                    {
                        text: "Apologise to your manager and explain that you would love to help but that you have a full schedule today and therefore you are unable to do so. Your paperwork needs to take precedence here otherwise you risk falling behind.",
                        explanation: "The least effective response. You are not considering the performance of the sales team as a whole only your own tasks and outputs. You are also ignoring the company / brand and how it will be affected by the missed visits. Perhaps you could negotiate with your manager to complete the paperwork a little late this time, given the exceptional circumstances."
                    },
                    {
                        text: "Say that you are busy today but may be able to take one of the visits on Wendy's behalf, if other colleagues could cover the other two.",
                        explanation: "The third most effective response. You are the closest sales rep and therefore it would probably be more efficient for the team as a whole if you could do all three appointments once you are in Alpston."
                    },
                    {
                        text: "Agree to take all three appointments. You can attend all of your 5 visits this morning and there will still be time to drive to Alpston and visit the three customers there.",
                        explanation: "The most effective response. You are contributing to the whole team performance, not just worrying about your own patch. You would need to check the scheduling of both your and Wendy's visits of course, in order that you could make sure that the timetable was achievable and realistic for you."
                    },
                    {
                        text: "Agree to take all three appointments and call two of your customers to see if you can re-schedule their visits for tomorrow.",
                        explanation: "The second most effective response. You are seeing the 'whole team' picture and working to maintain a good performance over both patches. However there should be a way of fitting all the appointments, yours and Wendy's, into the day without having to cancel any visits."
                    }
                ],
                competency: "Teamwork",
                mostEffective: 2,
                leastEffective: 0
            }
        ]
    },
    {
        id: 3,
        title: "Greenwinds Energy",
        description: "You are a customer advisor at the UK contact centre for Greenwinds Energy. Greenwinds is a renewable-source electricity and gas supplier to European domestic and business customers. Your role is to answer inbound telephone calls and emails from customers in the UK, answering questions and queries about Greenwinds products and services and dealing with customer complaints and issues. You work in a team of 15 and you report into a Customer Service Team Leader. Greenwinds has recently introduced a 'one-rate' policy for all its energy packages. Customers will be charged the same rate per unit of electricity or gas regardless of their method of payment or when their peak usage of energy is. This has many advantages including, greater clarity of charging, no encouragement for use of electrical appliances at night, which can be unsafe, and no discrimination against people using pre-pay meters, pre pay cards or monthly cheque payment, all of whom are traditionally the less prosperous customers.",
        questions: [
            {
                question: "A customer has come through to you with a complaint about Greenwinds billing system. He is a new customer who has used the Greenwinds Dual Fuel electricity and gas product for a month. He says that he wasn't told by the doorstep sales person when he signed up that the electricity would not be split into off-peak and peak rate units. With his previous supplier he had been used to maximising his energy use at night in order to benefit from the cheaper rate electricity. He was under the impression that he would be able to continue to do this with Greenwinds and now he is very upset as he has realised, upon receiving his first bill, that this is not the case.",
                options: [
                    {
                        text: "Apologise for the confusion but state that the Greenwinds charging policy is clearly written on the joining contract and on the website.",
                        explanation: "This is the least effective response as you are doing nothing to assist the customer in any way and simply leaving him to remain angry at Greenwinds and possibly publicise his complaints another way i.e. internet or broadcast media."
                    },
                    {
                        text: "Apologise for the confusion and ask the customer for more detail about the sales conversation, including the salesperson's name or description. Say that you will ask your manager to investigate the way that the contract was sold and to look at whether any miscommunication had happened on the doorstep. Say you will get back to the customer on a daily basis to keep him updated of progress.",
                        explanation: "This is the most effective response as the customer will feel that he is being taken seriously and have a chance to calm down. You will remain in contact with him regularly and can use this opportunity to talk about Greenwinds and keep him apprised of the investigation. Finding out what happened on the doorstep can help to decide whether the salesperson did or did not mention the 'one-rate' policy. And if not, were they deliberately misleading the customer or did they make a genuine mistake in failing to mention the policy. Once this is established the salesperson can receive training or coaching to improve their performance or the company can take other measures as appropriate. Also the customer can be dealt with fairly, either by allowing him to cancel his contract or by awarding him a fair gesture of apology such as a discounted rate, etc."
                    },
                    {
                        text: "Apologise for the confusion and offer the customer a goodwill waiver of one month's standing charge.",
                        explanation: "A reasonable response but will not get to the heart of the allegations of poor service and poor selling made by the customer. The customer may still have negative feelings toward Greenwinds and seek to end their contract as soon as possible."
                    },
                    {
                        text: "Apologise for the confusion and say that you are sorry to hear that he is feeling upset and hope that Greenwinds excellent service and eco-friendly product will make up for the initial misunderstanding in the long-run.",
                        explanation: "Not a particularly appropriate response as, despite your empathy and kindness, there is no practical action offered to the customer and he may still feel dissatisfied upon putting the phone down."
                    }
                ],
                competency: "Service Ethos",
                mostEffective: 1,
                leastEffective: 0
            },
            {
                question: "You have recently noticed that your fellow team member, Sandy, is raising his voice quite frequently at the customers and has terminated a few calls early when customers have been expressing dissatisfaction in a rude or discourteous way. Another colleague told you in confidence that Sandy has got problems at home, his wife recently lost her job, they are experiencing financial strain and it is taking its toll on their relationship. Sandy is worried that his wife is depressed and he is finding it hard to concentrate on work properly. You sit next to Sandy in the contact centre and you have noticed his behaviour becoming more erratic over the last few weeks.",
                options: [
                    {
                        text: "Do nothing. It is not your responsibility to intervene with Sandy, it is up to the Customer Service Team Leader to respond if his work is suffering. You feel that Sandy would be upset and offended if you 'poked your nose in' with his personal problems.",
                        explanation: "Not a particularly appropriate response as you are doing nothing to address the problem. Sandy's behaviour, if left unchecked, could have a negative impact on customers and the team as a whole."
                    },
                    {
                        text: "Speak to Sandy and say that you want him to know that you are always available for a chat if he ever needs someone to talk to. Ask him if there is anything that you can do to help and support him at work as you have noticed him dealing with customers differently recently, not in his usual friendly, calm manner.",
                        explanation: "This is the most effective response as you are showing Sandy that you are aware that he may be feeling stressed and upset at the moment. On the other hand, you are leaving it up to him to tell you what he feels comfortable with and offering practical support as well."
                    },
                    {
                        text: "Say to Sandy that you have noticed that his personal life is affecting his work and say that he had better watch out that the Team Leader doesn't give him a formal warning about the way he is dealing with customers.",
                        explanation: "This is the least effective response as you are increasing the pressure on Sandy in a rather hostile way and you are not offering anything in the way of support or help."
                    },
                    {
                        text: "Tell your Team Leader that you are worried about Sandy and that you know that he has some problems at home. Say to the Team Leader that you are happy to take on some of Sandy's workload whilst he is feeling stressed and under pressure.",
                        explanation: "A reasonable response as it will ensure that Sandy's problems and behaviour are addressed. However, Sandy may feel that you have 'gone behind his back' which may upset him further. It would probably be better to approach him directly first and give him a chance to address his own problems, before talking to the Team Leader."
                    }
                ],
                competency: "Teamwork",
                mostEffective: 1,
                leastEffective: 2
            }
        ]
    },
    {
        id: 4,
        title: "JoinedUp",
        description: "You are an advisor working in a customer contact centre for a large telecommunications company called JoinedUp. The company provides mobile phone services and handsets, broadband internet and landline services to domestic and business customers in the UK and Europe.",
        questions: [
            {
                question: "A customer has called the contact centre and is interested in changing her mobile phone tariff and handset as her annual contract is due for renewal next month. She has come through to you and has said that she is finding the information on the website very confusing and isn't sure which would be the best tariff for her and how to get the latest 'smartphone' as inexpensively as possible. She says that her phone, text and data usage is liable to stay pretty much the same in the coming year as it was in the past 12 months. She is confident in her choice of handset.",
                options: [
                    {
                        text: "Tell her that you will take a detailed look at her account and then email her the details of the three best price packages for her. State that you will call her in an hour or two (or some other time convenient to her), once she has had a chance to read the email and talk her through the information and answer any questions.",
                        explanation: "The Very Effective response. This tailors the information and reduces the amount of information that the customer has to trawl through and also gives her the chance to receive the information in two ways – orally and in a written format – and also gives her a chance to have any questions answered."
                    },
                    {
                        text: "Talk through the information about all the various available tariffs with her and the related prices of the handset she wants.",
                        explanation: "The Ineffective response. This does little to reduce the amount of information that the customer has to trawl through and only gives her the information in only one format. She has already said that she finds the website unhelpful and therefore when she gets off the phone she will not have anything in writing to which to refer."
                    },
                    {
                        text: "State that the best place to find all the information is the website and that if she puts the name of the handset that she requires into the search engine then she will find some useful information.",
                        explanation: "The Counterproductive response. She has already said that she finds the website confusing and you haven't established whether she has tried this 'search' approach already anyway."
                    },
                    {
                        text: "Ask her to wait whilst you take a thorough look at her account and then talk her through the details of the two or three best price packages for her. Once you have established her preferred package through the conversation, then email her the details of this including the cost of the handset.",
                        explanation: "The Effective response. This tailors the information and reduces the amount of information that the customer has to trawl through and it also gives her some of the information in written format; however it is less effective than the best response because she is being required to make decisions based on oral information only"
                    },
                    {
                        text: "Tell her that you will take a detailed look at her account and then email her the details of the two or three best price packages for her.",
                        explanation: "The Slightly Effective response. This tailors the information and reduces the amount of information that the customer has to trawl through, however it only allows her the information in one format. It also makes it more difficult for her to ask questions as she will have to call back and possibly talk to someone else rather than to you."
                    }
                ],
                competency: "Effective Communication",
                mostEffective: 0,
                leastEffective: 2
            },
            {
                question: "You have just finished a customer call and turned to your colleague, Alexis, who looked troubled and concerned. You asked what was wrong and she said that she had just had to put a customer through to the team leader because she wasn't able to explain a new mobile phone text & data tariff which had just been released by JoinedUp today. The team leader briefed the team about the new tariff this morning and said that it was important to promote it as it had been designed to compete directly with an offer made by a competitor in TV ads last week.",
                options: [
                    {
                        text: "Offer to talk Alexis through the new tariff and answer any questions she may have.",
                        explanation: "The Very Effective response. You are being directly supportive and helpful to your colleague and improving the team's chances of performing effectively."
                    },
                    {
                        text: "As time is tight you write down a few key points about the tariff and leave it on her work station for her to have as a reminder if another customer enquires.",
                        explanation: "The Slightly Effective response. It may help her but it would be better if you gave her time to ask questions so you could directly address the points with which she was struggling."
                    },
                    {
                        text: "Say that the tariff is very straightforward to understand really and that she'll soon get the hang of it.",
                        explanation: "The Counterproductive response. This will undermine her confidence as she is clearly not finding the tariff straightforward and she may also now be reluctant to ask anyone else for help for fear of looking stupid."
                    },
                    {
                        text: "Suggest that Alexis asks the team leader for another briefing on the tariff and that it's nothing to be worried about as you have sometimes found new products difficult to fathom at first.",
                        explanation: "The Effective response. You are being emotionally supportive if not immediately offering practical help yourself but making a reasonable suggestion to Alexis."
                    },
                    {
                        text: "Tell her that you'll email her the briefing document that your team leader handed out this morning to remind her of the details of the tariff.",
                        explanation: "The Ineffective response. It may be that Alexis has lost the original document but not very likely. It is more likely that she can't understand it and in that sense you are not being particularly helpful."
                    }
                ],
                competency: "Teamwork",
                mostEffective: 0,
                leastEffective: 2
            }
        ]
    }
];

// Initialize variables
let currentScenarioIndex = 0;
let currentQuestionIndex = 0;
let userAnswers = [];

// Initialize the test
function initTest() {
    displayCurrentScenario();
    displayCurrentQuestion();
    updateNavigation();
}

// Display the current scenario
function displayCurrentScenario() {
    const scenario = scenarios[currentScenarioIndex];
    document.getElementById('scenario-title').textContent = scenario.title;
    document.getElementById('scenario-description').textContent = scenario.description;
}

// Display the current question
function displayCurrentQuestion() {
    const scenario = scenarios[currentScenarioIndex];
    const question = scenario.questions[currentQuestionIndex];
    
    document.getElementById('question-text').textContent = question.question;
    
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.innerHTML = `
            <input type="radio" name="answer" id="option${index}" value="${index}">
            <label for="option${index}">${option.text}</label>
        `;
        optionElement.onclick = () => selectOption(index);
        optionsContainer.appendChild(optionElement);
    });
}

// Handle option selection
function selectOption(index) {
    const radio = document.getElementById(`option${index}`);
    radio.checked = true;
    
    // Remove selected class from all options
    document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
    
    // Add selected class to chosen option
    document.querySelectorAll('.option')[index].classList.add('selected');
}

// Update navigation buttons
function updateNavigation() {
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const submitButton = document.getElementById('submit-button');
    
    prevButton.style.display = currentScenarioIndex === 0 && currentQuestionIndex === 0 ? 'none' : 'block';
    nextButton.style.display = isLastQuestion() ? 'none' : 'block';
    submitButton.style.display = isLastQuestion() ? 'block' : 'none';
}

// Check if current question is the last one
function isLastQuestion() {
    return currentScenarioIndex === scenarios.length - 1 && 
           currentQuestionIndex === scenarios[currentScenarioIndex].questions.length - 1;
}

// Handle navigation
function navigate(direction) {
    if (direction === 'prev') {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
        } else if (currentScenarioIndex > 0) {
            currentScenarioIndex--;
            currentQuestionIndex = scenarios[currentScenarioIndex].questions.length - 1;
        }
    } else if (direction === 'next') {
        if (currentQuestionIndex < scenarios[currentScenarioIndex].questions.length - 1) {
            currentQuestionIndex++;
        } else if (currentScenarioIndex < scenarios.length - 1) {
            currentScenarioIndex++;
            currentQuestionIndex = 0;
        }
    }
    
    displayCurrentScenario();
    displayCurrentQuestion();
    updateNavigation();
}

// Calculate score and show results
function calculateScore() {
    let score = 0;
    let totalQuestions = 0;
    
    scenarios.forEach((scenario, scenarioIndex) => {
        scenario.questions.forEach((question, questionIndex) => {
            totalQuestions++;
            const userAnswer = document.querySelector(`input[name="answer"]:checked`);
            if (userAnswer) {
                const selectedIndex = parseInt(userAnswer.value);
                if (selectedIndex === question.mostEffective) {
                    score++;
                }
            }
        });
    });
    
    const percentage = (score / totalQuestions) * 100;
    
    // Create results page
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'results-container';
    resultsContainer.innerHTML = `
        <h2>Test Results</h2>
        <p>Your score: ${score} out of ${totalQuestions} (${percentage.toFixed(1)}%)</p>
        <div class="results-details"></div>
    `;
    
    // Add detailed results
    const detailsContainer = resultsContainer.querySelector('.results-details');
    scenarios.forEach((scenario, scenarioIndex) => {
        scenario.questions.forEach((question, questionIndex) => {
            const userAnswer = document.querySelector(`input[name="answer"]:checked`);
            const selectedIndex = userAnswer ? parseInt(userAnswer.value) : -1;
            
            const questionResult = document.createElement('div');
            questionResult.className = 'question-result';
            questionResult.innerHTML = `
                <h3>${scenario.title} - Question ${questionIndex + 1}</h3>
                <p>${question.question}</p>
                <div class="answer-details">
                    <p>Your answer: ${selectedIndex >= 0 ? question.options[selectedIndex].text : 'Not answered'}</p>
                    <p>Most effective answer: ${question.options[question.mostEffective].text}</p>
                    <p>Explanation: ${question.options[question.mostEffective].explanation}</p>
                </div>
            `;
            detailsContainer.appendChild(questionResult);
        });
    });
    
    // Replace main content with results
    document.querySelector('.question-container').innerHTML = '';
    document.querySelector('.question-container').appendChild(resultsContainer);
}

// Initialize the test when the page loads
window.onload = initTest; 