// Test data structure
const scenarios = [
    {
        id: 1,
        title: "Superluxe Hotels",
        description: "You work as a Guest Services Manager at Superluxe Hotels, a chain of luxury hotels. Your role involves ensuring guest satisfaction, managing staff, and handling any issues that arise during guests' stays.",
        questions: [
            {
                question: "A guest has just checked into their room and comes down to the reception desk looking very unhappy. They say that their room is not clean enough and they are not satisfied with the standard of housekeeping. They are quite angry and are demanding to speak to the manager.",
                options: [
                    {
                        text: "Apologize sincerely and offer to have the room cleaned again immediately while they wait in the hotel bar, where you'll arrange for a complimentary drink.",
                        explanation: "The Very Effective response. You are acknowledging the guest's feelings, taking immediate action to resolve the issue, and offering a gesture of goodwill."
                    },
                    {
                        text: "Tell them that you are the manager and that you will personally inspect the room and ensure it is cleaned to their satisfaction.",
                        explanation: "The Effective response. You are taking responsibility and showing that you take their complaint seriously."
                    },
                    {
                        text: "Explain that the housekeeping staff are very busy at the moment but you'll try to get someone to clean the room as soon as possible.",
                        explanation: "The Ineffective response. You are making excuses and not prioritizing the guest's immediate needs."
                    },
                    {
                        text: "Ask them to point out exactly what is not clean enough so you can inform the housekeeping staff of their specific requirements.",
                        explanation: "The Counterproductive response. This could be seen as confrontational and might make the guest feel they need to justify their complaint."
                    }
                ],
                competency: "Customer Service",
                mostEffective: 0,
                leastEffective: 3
            },
            {
                question: "A regular business guest who stays at your hotel every month approaches you at reception. They say that they have noticed that the hotel across the road is offering rooms at a much lower rate and they are considering switching their business to them. They ask if you can match their rates.",
                options: [
                    {
                        text: "Explain that while you cannot match their exact rates, you can offer them a special loyalty rate and additional benefits that the other hotel cannot match.",
                        explanation: "The Very Effective response. You are acknowledging their concern while highlighting the unique value of staying at your hotel."
                    },
                    {
                        text: "Tell them that you understand their position and that you will speak to your manager about matching the rates.",
                        explanation: "The Effective response. You are showing empathy and taking action, though it would be better to have a solution ready."
                    },
                    {
                        text: "Point out that your hotel offers better quality service and facilities than the other hotel.",
                        explanation: "The Ineffective response. You are being defensive and not addressing their specific concern about the price."
                    },
                    {
                        text: "Say that you cannot change the rates as they are set by head office and there is nothing you can do.",
                        explanation: "The Counterproductive response. You are being dismissive and not trying to find a solution to retain their business."
                    }
                ],
                competency: "Customer Service",
                mostEffective: 0,
                leastEffective: 3
            },
            {
                question: "You are managing a hotel banquet for 150 people. The client has just called to say they need to increase the guest list to 200 people. The event is in two days' time.",
                options: [
                    {
                        text: "Check with the Catering team about capacity and availability, then confirm the booking with the client if possible.",
                        explanation: "The Very Effective response. You are ensuring all necessary checks are made before confirming the change."
                    },
                    {
                        text: "Tell the client that you'll do your best to accommodate the extra guests but can't guarantee it at this late stage.",
                        explanation: "The Effective response. You are being honest about the situation while showing willingness to help."
                    },
                    {
                        text: "Agree to the increase immediately to keep the client happy.",
                        explanation: "The Ineffective response. You are making a commitment without checking if it's possible to fulfill."
                    },
                    {
                        text: "Explain that it's too late to make changes and suggest they keep the original number of guests.",
                        explanation: "The Counterproductive response. You are being inflexible and not trying to find a solution."
                    }
                ],
                competency: "Problem Solving",
                mostEffective: 0,
                leastEffective: 3
            },
            {
                question: "A large group booking has been transferred to your hotel at the last minute. This means the housekeeping team will need to work extra hours to prepare the rooms.",
                options: [
                    {
                        text: "Communicate the situation to the housekeeping team, explain the benefits of the extra work, and ensure they are properly compensated.",
                        explanation: "The Very Effective response. You are being transparent, showing appreciation, and ensuring fair treatment."
                    },
                    {
                        text: "Ask the housekeeping team to work the extra hours and promise to make it up to them later.",
                        explanation: "The Effective response. You are acknowledging the extra effort, though the promise is vague."
                    },
                    {
                        text: "Tell the housekeeping team they need to work overtime as it's part of their job.",
                        explanation: "The Ineffective response. You are being dismissive of their concerns and not showing appreciation."
                    },
                    {
                        text: "Handle the situation without informing the housekeeping team, assuming they'll deal with it when they arrive.",
                        explanation: "The Counterproductive response. You are not communicating important information that affects their work."
                    }
                ],
                competency: "Team Management",
                mostEffective: 0,
                leastEffective: 3
            }
        ]
    },
    {
        id: 2,
        title: "Handy Goods Ltd.",
        description: "You work as a Field Sales Representative for Handy Goods Ltd., a company that supplies household goods to retail outlets. Your role involves visiting shops, taking orders, and building relationships with customers.",
        questions: [
            {
                question: "It's Monday morning in May and you have five shop visits booked in Saldringham City. Your manager calls to say that Wendy, a colleague who covers the Alpston area, is sick and asks if you can cover three of her appointments today.",
                options: [
                    {
                        text: "Agree to take all three appointments but explain that you'll need to reschedule some of your own visits to ensure you can give each customer proper attention.",
                        explanation: "The Very Effective response. You are being helpful while ensuring quality of service."
                    },
                    {
                        text: "Say that you'll try to fit in the appointments but can't guarantee you'll make it to all of them.",
                        explanation: "The Effective response. You are willing to help but being honest about potential limitations."
                    },
                    {
                        text: "Refuse to take any of the appointments as you already have a full schedule.",
                        explanation: "The Ineffective response. You are not being flexible or helpful to the team."
                    },
                    {
                        text: "Agree to take all appointments without checking if it's realistic to do so.",
                        explanation: "The Counterproductive response. You are making commitments you might not be able to keep."
                    }
                ],
                competency: "Teamwork",
                mostEffective: 0,
                leastEffective: 3
            },
            {
                question: "At the Monday morning team briefing, your manager says that sales of children's pocket toys and games have been slow. Each Field Sales Representative will be reviewed fortnightly on their sales, with the highest achieving representative receiving a cash bonus.",
                options: [
                    {
                        text: "Focus on understanding customer needs and presenting the products well, while maintaining your usual professional approach.",
                        explanation: "The Very Effective response. You are maintaining quality service while working to improve sales."
                    },
                    {
                        text: "Badger customers to buy the products to ensure you meet your targets.",
                        explanation: "The Ineffective response. You are being pushy and potentially damaging customer relationships."
                    },
                    {
                        text: "Ensure you have good product knowledge and target the right customers for these products.",
                        explanation: "The Effective response. You are taking a strategic approach to improve sales."
                    },
                    {
                        text: "Ignore the competition and focus on your existing customers who always buy from you.",
                        explanation: "The Counterproductive response. You are being complacent and not trying to improve performance."
                    }
                ],
                competency: "Sales Performance",
                mostEffective: 0,
                leastEffective: 3
            },
            {
                question: "You are visiting a customer, Ruth Hardlow, who runs a convenience store. She tells you that she is considering switching to a rival supplier because their products are cheaper. She also mentions that she has had several returns of Handy Goods products due to 'shoddy quality'.",
                options: [
                    {
                        text: "Apologize for the quality issues, examine the returned products, and investigate the problem with your quality control team.",
                        explanation: "The Very Effective response. You are addressing the quality concerns directly and taking action."
                    },
                    {
                        text: "Offer a discount on future orders to compensate for the quality issues.",
                        explanation: "The Effective response. You are acknowledging the problem and offering a solution."
                    },
                    {
                        text: "Explain that all products go through rigorous quality control and suggest the issues might be due to mishandling.",
                        explanation: "The Ineffective response. You are being defensive and not addressing the customer's concerns."
                    },
                    {
                        text: "Tell her that quality issues are normal in the industry and she should expect some returns.",
                        explanation: "The Counterproductive response. You are being dismissive of serious quality concerns."
                    }
                ],
                competency: "Customer Service",
                mostEffective: 0,
                leastEffective: 3
            },
            {
                question: "You are visiting a convenience store where the proprietor is considering switching suppliers due to a competitive offer from a rival company. The rival is offering a 20% discount on their first order as an introductory offer.",
                options: [
                    {
                        text: "Explain that the rival's introductory offer is temporary and discuss the long-term value and reliability of your products.",
                        explanation: "The Very Effective response. You are addressing the immediate concern while highlighting long-term benefits."
                    },
                    {
                        text: "Match the rival's offer to keep the customer's business.",
                        explanation: "The Effective response. You are being competitive, though it's better to focus on value."
                    },
                    {
                        text: "Tell the customer they'll regret switching when the introductory offer ends.",
                        explanation: "The Ineffective response. You are being negative and not focusing on your own value proposition."
                    },
                    {
                        text: "Ignore the competition and focus on your existing product range.",
                        explanation: "The Counterproductive response. You are not addressing the customer's concerns about the competitive offer."
                    }
                ],
                competency: "Sales Strategy",
                mostEffective: 0,
                leastEffective: 3
            }
        ]
    },
    {
        id: 3,
        title: "Greenwinds Energy",
        description: "You work in the customer service department of Greenwinds Energy, a company that provides energy services to both domestic and business customers. Your role involves handling customer inquiries, resolving issues, and ensuring customer satisfaction.",
        questions: [
            {
                question: "A customer calls to complain about Greenwinds' billing system. They are a new user of the Greenwinds Dual Fuel product and are very angry that they were not informed that electricity rates would not be split into off-peak and peak rates.",
                options: [
                    {
                        text: "Apologize for the confusion, gather more details about the sales conversation, and assure them you'll investigate and keep them informed.",
                        explanation: "The Very Effective response. You are acknowledging the issue, gathering information, and promising follow-up."
                    },
                    {
                        text: "Explain that the terms were in the contract they signed and suggest they read it more carefully next time.",
                        explanation: "The Ineffective response. You are being defensive and not addressing their frustration."
                    },
                    {
                        text: "Offer to switch them to a different tariff that includes peak and off-peak rates.",
                        explanation: "The Effective response. You are offering a solution, though it would be better to investigate first."
                    },
                    {
                        text: "Tell them that all customers are on the same tariff and they should accept it.",
                        explanation: "The Counterproductive response. You are being dismissive and not trying to help."
                    }
                ],
                competency: "Customer Service",
                mostEffective: 0,
                leastEffective: 3
            },
            {
                question: "You notice that a team member, Sandy, has been behaving erratically recently. They seem distracted, are making more mistakes than usual, and have been taking longer breaks. You know they are having some personal issues at home.",
                options: [
                    {
                        text: "Speak with Sandy privately, show concern, and offer to help or support them in any way you can.",
                        explanation: "The Very Effective response. You are showing empathy and offering support while maintaining professionalism."
                    },
                    {
                        text: "Report Sandy's behavior to your manager and let them handle it.",
                        explanation: "The Effective response. You are addressing the issue, though it would be better to speak with Sandy first."
                    },
                    {
                        text: "Ignore the situation as it's not your responsibility.",
                        explanation: "The Ineffective response. You are not showing concern for a team member who needs support."
                    },
                    {
                        text: "Tell Sandy to sort out their personal issues as they're affecting their work.",
                        explanation: "The Counterproductive response. You are being insensitive and not offering support."
                    }
                ],
                competency: "Team Support",
                mostEffective: 0,
                leastEffective: 3
            },
            {
                question: "In a team meeting, your Team Leader discusses the declining customer satisfaction levels. They emphasize the need for improved service quality and set new targets for the team.",
                options: [
                    {
                        text: "Ask the Team Leader for specific examples of what constitutes good service quality and how you can meet these expectations.",
                        explanation: "The Very Effective response. You are seeking clarification to ensure you understand the expectations."
                    },
                    {
                        text: "Nod in agreement and promise to try harder.",
                        explanation: "The Ineffective response. You are not seeking to understand what specific improvements are needed."
                    },
                    {
                        text: "Share your ideas for improving service quality with the team.",
                        explanation: "The Effective response. You are being proactive and contributing to the solution."
                    },
                    {
                        text: "Suggest that the targets are unrealistic and need to be adjusted.",
                        explanation: "The Counterproductive response. You are being negative without offering constructive input."
                    }
                ],
                competency: "Team Communication",
                mostEffective: 0,
                leastEffective: 3
            },
            {
                question: "The IT system has crashed, affecting customer service operations. Calls are backing up and customers are waiting longer than usual for assistance.",
                options: [
                    {
                        text: "Take responsibility for follow-up calls to ensure customer queries are addressed once the system is back up.",
                        explanation: "The Very Effective response. You are taking initiative to ensure customer needs are met despite the technical issues."
                    },
                    {
                        text: "Wait for the system to come back online before taking any action.",
                        explanation: "The Ineffective response. You are not being proactive in managing the situation."
                    },
                    {
                        text: "Inform customers about the technical issues and provide an estimated wait time.",
                        explanation: "The Effective response. You are keeping customers informed and managing expectations."
                    },
                    {
                        text: "Blame the IT department for the delay and tell customers to call back later.",
                        explanation: "The Counterproductive response. You are being unprofessional and not helping customers."
                    }
                ],
                competency: "Problem Solving",
                mostEffective: 0,
                leastEffective: 3
            },
            {
                question: "A customer is interested in changing their mobile phone tariff and handset. They want to know the best options available.",
                options: [
                    {
                        text: "Email the customer the best price packages and follow up with a call to discuss any questions.",
                        explanation: "The Very Effective response. You are providing comprehensive information and ensuring follow-up."
                    },
                    {
                        text: "Tell the customer to check the website for the latest deals.",
                        explanation: "The Ineffective response. You are not providing personalized service or assistance."
                    },
                    {
                        text: "Explain the current offers over the phone and ask if they have any questions.",
                        explanation: "The Effective response. You are providing information and checking for understanding."
                    },
                    {
                        text: "Suggest they visit a store to see the handsets in person.",
                        explanation: "The Counterproductive response. You are not providing the information they requested."
                    }
                ],
                competency: "Customer Service",
                mostEffective: 0,
                leastEffective: 3
            }
        ]
    },
    {
        id: 4,
        title: "JoinedUp",
        description: "You work as a Customer Advisor in the call center of JoinedUp, a telecommunications company. Your role involves handling customer inquiries, resolving issues, and ensuring customer satisfaction.",
        questions: [
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
            },
            {
                question: "Your team leader called you over this morning and said that she thought you would like to know that, in the last quarter results, you were one of the JoinedUp top 20 UK customer advisors for call quality and efficiency. This means that, compared to other customer advisors, you had managed your calls effectively in terms of customer satisfaction and that you had answered the right number of calls per hour and your calls had mostly been of the target length suggested by JoinedUp. This result suggests that in this current quarter you have a chance of achieving a longstanding personal goal and earning a substantial bonus payment into the bargain. The top 10 customer advisors each quarter receive a bonus payment worth 15% of their salary. There are 2 months of this current quarter remaining and you are keen to do your best to get into that 'top 10' list.",
                options: [
                    {
                        text: "Find out from your team leader who the advisors in the Top 10 were last quarter. Email them and ask if any can spare fifteen minutes for a chat and see if you can glean any hints and tips for improving your performance even further.",
                        explanation: "The Very Effective response. Getting advice 'from the horse's mouth', as it were, should give you a range of ideas for tweaking and improving your performance."
                    },
                    {
                        text: "Tell your colleagues that you are in the Top 20 advisors and say that you will bring cakes and doughnuts in tomorrow to celebrate.",
                        explanation: "The Ineffective response. This is a nice gesture towards your co-workers but will have no effect on your performance this quarter."
                    },
                    {
                        text: "Cancel the three days annual leave that you had booked in for next week as you want to make sure you are one of the top performers.",
                        explanation: "The Counterproductive response. The number of days you work is not one of the measures and, by cancelling a break, you are risking increasing your fatigue and stress levels which will not help your performance."
                    },
                    {
                        text: "Keep working as you have been. After all 'if it ain't broke...' as the saying goes.",
                        explanation: "The Slightly Effective response. There is some logic to this view which is that you have already made it into the Top 20 last quarter and so with a bit of luck you may achieve the Top 10 without changing your approach to work. However, the danger is that your current approach is just not enough to equal the 'best' customer advisors' performance"
                    },
                    {
                        text: "Ask your team leader for feedback and advice on how to achieve Top 10 status.",
                        explanation: "The Effective response. Your team leader should have a good idea of your current performance and may have some useful tips on how to improve even further to put you in that very top section of the list."
                    }
                ],
                competency: "Achieving Results",
                mostEffective: 0,
                leastEffective: 2
            },
            {
                question: "It is 10am on a Tuesday. JoinedUp launched the 'Yphone Xtra' mobile handset today which is the new, sought-after handset of the moment. Customers can acquire the Yphone at a very low cost when they sign up to a 12 or 24 month contract for mobile phone services with JoinedUp. There is an additional offer that the first 1000 customers who sign-up for a relevant JoinedUp mobile contract qualify for a free Yphone. The handset and the offer were made available from 9am today and since then the call centre has been experiencing a very high level of calls. Your team leader has told you that you will be required to work an extra 4 hours from 4pm until 8pm, at the end of your 8 hour shift today but you'll be able to take the time-off-in-lieu sometime next week. Everyone in the team will also have shortened lunch breaks today, again with the time being recouped next week. You haven't said anything to your team leader but you have a report to write for your BTEC in Contact Centre Leadership tonight; it is due in by midday tomorrow and you are working tomorrow morning.",
                options: [
                    {
                        text: "Contact your BTEC tutor and ask for an extension on the report deadline, if at all possible, explain that you are in a uniquely demanding work situation. If the extension isn't granted see if you can reduce your shift from 12 to 10 hours by explaining your predicament to your team leader.",
                        explanation: "The Very Effective response. You are tackling the situation from two angles and hopefully, either your tutor or your team leader will be able to 'cut you some slack' in this case."
                    },
                    {
                        text: "Work very quickly through the calls that you receive in the hope that the call numbers will dwindle later and your team leader will let you go earlier.",
                        explanation: "The Ineffective response. You are jeopardising customer service and satisfaction. Also you are very unlikely to be able to individually influence overall call handling rates."
                    },
                    {
                        text: "Refuse to work the extra time tonight although you will take a shorter lunchbreak. Tell your team leader that you have a prior engagement this evening that you cannot break.",
                        explanation: "The Counterproductive response. This is a rather 'panicky' response to the change in timetable for the day. You should consider other options, such as contacting your BTEC tutor and asking for an extension on the deadline before appearing uncooperative at work."
                    },
                    {
                        text: "Call a colleague who is on leave today and see if they can cover for your extra 4 hours.",
                        explanation: "The Slightly Effective response. You may be lucky and find someone willing to come in for you. Although you will have to square it with the team leader who may not be pleased as she would probably have to pay overtime rather than give time off in lieu as the colleague would be giving up their booked leave."
                    },
                    {
                        text: "Ask your team leader if there is any lee-way in this arrangement as you have an urgent report to write tonight and it is a work-related assignment. Say that you will take a minimal break and work 10 hours without distraction.",
                        explanation: "The Effective response. You are being co-operative and responsive to the work demands although there may be other ways you could address the situation, like asking for an extension on your work."
                    }
                ],
                competency: "Coping With Challenging Situations",
                mostEffective: 0,
                leastEffective: 2
            }
        ]
    }
];

// Test state
let currentScenarioIndex = 0;
let currentQuestionIndex = 0;
let userAnswers = [];

// DOM Elements
const scenarioTitle = document.getElementById('scenario-title');
const scenarioDescription = document.getElementById('scenario-description');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const navigation = document.getElementById('navigation');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
const submitButton = document.getElementById('submit-button');
const explanation = document.getElementById('explanation');

// Initialize the test
function initTest() {
    displayCurrentScenario();
    updateNavigation();
}

// Display current scenario
function displayCurrentScenario() {
    const currentScenario = scenarios[currentScenarioIndex];
    document.getElementById('scenario-title').textContent = currentScenario.title;
    document.getElementById('scenario-description').textContent = currentScenario.description;
}

// Display current question
function displayCurrentQuestion() {
    const currentScenario = scenarios[currentScenarioIndex];
    const currentQuestion = currentScenario.questions[currentQuestionIndex];
    
    document.getElementById('question-text').textContent = currentQuestion.question;
    
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    currentQuestion.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.innerHTML = `
            <input type="radio" name="answer" id="option${index}" value="${index}">
            <label for="option${index}">${option.text}</label>
        `;
        optionElement.addEventListener('click', () => selectOption(index));
        optionsContainer.appendChild(optionElement);
    });
    
    document.getElementById('explanation').style.display = 'none';
    document.getElementById('explanation').innerHTML = '';
}

// Handle option selection
function selectOption(optionIndex) {
    const currentScenario = scenarios[currentScenarioIndex];
    const currentQuestion = currentScenario.questions[currentQuestionIndex];
    const options = document.querySelectorAll('.option');
    
    options.forEach(option => option.classList.remove('selected'));
    options[optionIndex].classList.add('selected');
    
    const explanation = document.getElementById('explanation');
    explanation.style.display = 'block';
    explanation.innerHTML = `
        <h4>${currentQuestion.options[optionIndex].explanation}</h4>
    `;
    
    userAnswers[currentScenarioIndex][currentQuestionIndex] = optionIndex;
    updateNavigation();
}

// Update navigation buttons
function updateNavigation() {
    const scenario = scenarios[currentScenarioIndex];
    const question = scenario.questions[currentQuestionIndex];
    
    // Previous button
    prevButton.disabled = currentScenarioIndex === 0 && currentQuestionIndex === 0;
    
    // Next button
    const hasAnswered = userAnswers[currentScenarioIndex] && 
                       userAnswers[currentScenarioIndex][currentQuestionIndex] !== undefined;
    nextButton.disabled = !hasAnswered;
    
    // Submit button
    const isLastScenario = currentScenarioIndex === scenarios.length - 1;
    const isLastQuestion = currentQuestionIndex === scenario.questions.length - 1;
    submitButton.style.display = isLastScenario && isLastQuestion ? 'block' : 'none';
}

// Navigation handlers
function goToPrevious() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
    } else if (currentScenarioIndex > 0) {
        currentScenarioIndex--;
        currentQuestionIndex = scenarios[currentScenarioIndex].questions.length - 1;
    }
    displayCurrentScenario();
    updateNavigation();
}

function goToNext() {
    const scenario = scenarios[currentScenarioIndex];
    if (currentQuestionIndex < scenario.questions.length - 1) {
        currentQuestionIndex++;
    } else if (currentScenarioIndex < scenarios.length - 1) {
        currentScenarioIndex++;
        currentQuestionIndex = 0;
    }
    displayCurrentScenario();
    updateNavigation();
}

// Calculate score
function calculateScore() {
    let totalScore = 0;
    let maxScore = 0;
    
    scenarios.forEach((scenario, scenarioIndex) => {
        scenario.questions.forEach((question, questionIndex) => {
            const userAnswer = userAnswers[scenarioIndex]?.[questionIndex];
            if (userAnswer !== undefined) {
                const isMostEffective = userAnswer === question.mostEffective;
                const isLeastEffective = userAnswer === question.leastEffective;
                
                if (isMostEffective) {
                    totalScore += 2;
                } else if (!isLeastEffective) {
                    totalScore += 1;
                }
                maxScore += 2;
            }
        });
    });
    
    return {
        score: totalScore,
        maxScore: maxScore,
        percentage: (totalScore / maxScore) * 100
    };
}

// Submit test
function submitTest() {
    const result = calculateScore();
    alert(`Test completed!\nScore: ${result.score}/${result.maxScore} (${result.percentage.toFixed(1)}%)`);
}

// Event listeners
prevButton.addEventListener('click', goToPrevious);
nextButton.addEventListener('click', goToNext);
submitButton.addEventListener('click', submitTest);

// Initialize the test when the page loads
window.addEventListener('load', initTest); 