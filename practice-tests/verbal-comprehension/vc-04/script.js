const testData = {
    title: "VC-04: Practice Passages",
    description: "Test your ability to understand and analyze written passages",
    timeLimit: 20,
    questions: [
        {
            passage: "The music, film and video game retailer HMV recently reported an annual loss of £38.6 million due to declining sales and restructuring costs. The main reason attributed to this decline in sales is the rise of online music and film download websites. Music and film lovers are now able to download songs and films at the click of a button, without requiring a stop at their local HMV or retailer. Only time will tell if the online music and film industry will make HMV, the CD and the DVD obsolete in favour of a fully online entertainment industry.",
            question: "What was HMV's reported annual loss?",
            options: [
                "£38.6 Billion",
                "£38.6 Million",
                "$38.6 Million",
                "$38.6 Billion"
            ],
            correctAnswer: 1,
            explanation: "Step 1: The passage states that the reported annual loss was £38.6 million, not billion.\nStep 2: The passage states that the reported annual loss was £38.6 million and is therefore correct.\nStep 3: The passage states that the reported annual loss was £38.6 million, this statement uses $ rather than £ and is therefore incorrect.\nStep 4: The passage states that the reported annual loss was £38.6 million, this statement uses $ rather than £ and a billion, rather than a million and is therefore incorrect."
        },
        {
            passage: "Special economic zones are geographical regions that operate under more free market orientated laws than the rest of that country. In these zones, particular taxes may not be levied, decreased regulation may be present and international tariffs may be decreased/not required. The function of these zones is to increase foreign investment, develop infrastructure or to increase employment opportunities in that area. Numerous countries employ the use of special economic zones including Russia, China, India, South Korea and many others.",
            question: "Based on the passage, which of the following statements is definitely true?",
            options: [
                "Special economic zones are used to increase employment",
                "Special economic zones are used to improve quality of life",
                "Special economic zones are used to improve foreign relations",
                "Special economic zones are used to by the European union"
            ],
            correctAnswer: 0,
            explanation: "Step 1: The passage directly mentions that special economic zones are used to increase employment opportunities and is therefore true.\nStep 2: The passage does not mention quality of life and is therefore not definitely true.\nStep 3: The passage does not mention improving foreign relations and is therefore not definitely true.\nStep 4: The passage does not mention the European Union and is therefore not definitely true."
        },
        {
            passage: "Performance-enhancing drugs have generated controversy in professional sports for decades as demand for optimum performance ever rises. A new method of performance enhancement has been identified as a possible future problem, a process known as gene doping. As genetic research advances, it is possible that rogue athletes may use genetic technology to enhance their ability through gene doping, potentially improving their performance significantly. Because of the numerous controversies and ethical problems this kind of enhancement may bring, anti-doping authorities have pre-emptively banned genetic manipulation.",
            question: "According to the passage what performance enhancing method may become a problem in the future?",
            options: [
                "Gene enhancement",
                "Gene doping",
                "Gene engineering",
                "Gene research"
            ],
            correctAnswer: 1,
            explanation: "Step 1: The passage does not mention \"gene enhancement\" specifically at any point.\nStep 2: The passage mentions \"Gene doping\" twice and refers to it a new method of performance enhancement that may become a problem in the future.\nStep 3: Genetic engineering is not mentioned directly in the passage.\nStep 4: Although genetic research is mentioned in the passage, it is not referred to specifically as the problem facing the future."
        },
        {
            passage: "With more than 32 million smart phones in the United Kingdom alone, the number of mobile phone applications or apps is rapidly increasing. These apps are used for gaming, travel, shopping, and banking and soon the department of health will be encouraging the development of medical apps to help manage medical conditions. Potentially popular apps could include blood pressure monitors, blood sugar monitors and contraceptive choice apps. These apps could make managing disease far more convenient and efficient, improving the quality of life for millions in the UK.",
            question: "Based on the passage, which of the following is not listed as a potential popular app?",
            options: [
                "Heart rate monitor",
                "Blood sugar monitor",
                "Blood pressure monitor",
                "Contraception advice"
            ],
            correctAnswer: 0,
            explanation: "Step 1: The passage does not mention a heart rate monitor and therefore is not listed as a potential app, making this the correct answer.\nStep 2: A blood sugar monitor is mentioned by the passage, making this answer incorrect.\nStep 3: A blood pressure monitor is mentioned in the passage, making this an incorrect answer.\nStep 4: Contraceptive advice is mentioned by the passage, making this an incorrect answer."
        },
        {
            passage: "In an attempt to find a solution to global climate change, scientists are researching the effects of releasing large quantities of iron into the upper ocean. This process is known as iron seeding and it can enhance the reproduction of phytoplankton, which may lower global carbon dioxide levels, reversing climate change. This process is also known as iron fertilisation or ocean nourishment and is the topic of an on-going debate by climate scientists. One criticism of the approach is that iron seeding may lead to a harmful algal bloom, which leads to the phenomenon known as the red tide, releasing numerous toxic chemicals into the ocean.",
            question: "Based on the passage, what is a name for the potential solution to climate change?",
            options: [
                "Iron nourishment",
                "Algal bloom",
                "Iron seeding",
                "Ocean seeding"
            ],
            correctAnswer: 2,
            explanation: "Step 1: Iron nourishment is not mentioned in the passage and is therefore incorrect.\nStep 2: Algal bloom is mentioned as a problem with the potential solution, not as the solution itself, and is therefore incorrect.\nStep 3: Iron seeding is mentioned in the passage directly as the potential solution to climate change and is therefore the correct answer.\nStep 4: Ocean seeding is not mentioned in the passage and is therefore incorrect."
        },
        {
            passage: "The alternative energy market has been growing year upon year, and bio fuels are seen as a major alternative energy source of the future. Renewable biofuels made from corn and other plants are a sustainable alternative to fossil fuels. However, a major criticism of biofuels is the amount of arable land required to grow the plants required for bio fuels, and with growing populations and food shortages around the world, it may not seem feasible. The bio fuel industry however states that numerous parts of crops that are not eaten, and would normally be thrown away could be converted into bio fuel, creating greater opportunity for agriculture not creating problems.",
            question: "Based on the passage, what are bio-fuels not referred to as?",
            options: [
                "Sustainable",
                "Alternative",
                "Renewable",
                "Ecological"
            ],
            correctAnswer: 3,
            explanation: "Step 1: The passage refers to bio fuels as a sustainable alternative to fossil fuel and is therefore referred to.\nStep 2: The passage refers to bio fuels as a major alternative energy source and is therefore referred to.\nStep 3: The passage refers to bio fuels as \"renewable biofuels\" and is therefore referred to.\nStep 4: The passage does not mention the term economical and therefore is not referred to in the passage."
        },
        {
            passage: "Pay day loans are becoming an increasingly common phenomenon in the United Kingdom, with pay-day loans a now £2 billion a year industry. These loans are often extremely high interest over a short period of time, often reaching or exceeding 4000% APR. Due to these high interest rates, missing payments can lead to a debt spiralling effect, in which debtors are trapped under an ever increasing mountain of debt, often using new loans to pay off existing loans, worsening the problem. However for many people that are able to pay back the loan quickly and without incident, pay day loans may be seen as a more convenient alternative to credit cards and bank overdrafts.",
            question: "Based on the passage above, which statement is not definitely true?",
            options: [
                "Pay day loans are a £2 billion industry",
                "Pay day loans often reach or exceed 4000% APR",
                "Pay day loans can lead to a debt spiralling effect",
                "Pay day loans can lead to bankruptcy"
            ],
            correctAnswer: 3,
            explanation: "Step 1: The passage states that payday loans are now a £2 billion industry, and is therefore true as this is a £2 billion industry.\nStep 2: The passage states that payday loans often reach or exceed 4000% APR, and is therefore true.\nStep 3: The passage mentions the debt spiralling effect, and is therefore true.\nStep 4: The passage does not mention bankruptcy, and is therefore not definitely true."
        },
        {
            passage: "The People's Republic of China has enjoyed a rapidly growing economy for decades, with China's export market the key factor in its economic success. However, recently, economic growth and import and export growth have been declining and are at their lowest rates since the late 2000 economic crisis. These may be indications of a slowing economy, which could spell disaster for the People's Republic, which has set its sights at competing with America for economic superpower status. It is possible that the increase in living standards and wages throughout China has increased the prices of its exports, making them less financially desirable. Only time will tell if the world's second largest economy still has the steam to maintain high rates of growth.",
            question: "Based on the passage, what's the suggested reason for China's slowed growth?",
            options: [
                "The Eurozone debt crisis",
                "Increase in wages",
                "The late 2000 economic crisis",
                "Competition with America"
            ],
            correctAnswer: 1,
            explanation: "Step 1: The passage does not mention the Eurozone debt crisis at all.\nStep 2: The passage states that increasing living standards and wages may be the cause, and is therefore the correct answer.\nStep 3: The lowered growth is compared to the late 2000 economic crisis, but is not considered the cause of the slowed growth.\nStep 4: Competing with America is considered an aim, but is not stated as a cause of the slowed growth, and is therefore false."
        },
        {
            passage: "Egalitarianism is a trend of thought that favours equality among all people. The premise is that all people are or should be equal in their worth and social status, and oppose all types of social inequality such as class stratification, caste systems and elitism. This school of thought has been applied to numerous practical applications such as politics, economics and law. However, the extent of proposed equality may vary, for example equality of opportunity seeks to give everyone equality, unless distinctions can be explicitly justified, and equality of outcome involves ensuring total equality between individuals in all measures i.e. wealth, status, income etc.",
            question: "Based on the passage above, what does egalitarianism not definitely oppose?",
            options: [
                "Class stratification",
                "Capitalism",
                "Caste systems",
                "Elitism"
            ],
            correctAnswer: 1,
            explanation: "Step 1: The passage states that egalitarianism opposes class stratification.\nStep 2: The passage does not mention capitalism in anyway, and egalitarianism is therefore not definitely opposed to it based on the passage and is the correct answer.\nStep 3: Caste systems are mentioned in the passage as opposed to egalitarianism.\nStep 4: The passage states that egalitarianism is opposed to elitism."
        },
        {
            passage: "In the United Kingdom, the number of home repossessions has reached an 18 month low of recent. Despite economic problems lingering from the 2008 economic crisis and the impending Eurozone debt crisis, repossessions have dropped from 9,600 in the first quarter to 8,500 in the second quarter. The reason for this drop is believed to be collaboration between lenders, borrowers and debt advisors to avoid repossession, as well as lower interest rates and help for unemployed borrowers.",
            question: "According to the passage, which of the following may not be a cause of the drop in number of home repossessions?",
            options: [
                "Lower interest rates",
                "Help for unemployed borrowers",
                "Financial regulation",
                "Collaboration between relevant parties"
            ],
            correctAnswer: 2,
            explanation: "Step 1: Lower interest rates are mentioned in the passage as a cause.\nStep 2: Help for unemployed borrowers is mentioned as a cause in the passage.\nStep 3: Financial regulation is not mentioned in the passage, and is therefore the correct answer.\nStep 4: Collaboration between relevant parties is mentioned and a cause."
        },
        {
            passage: "The Pareto principle, also known as the 80-20 rule states that for many events, roughly 80% of the effects come from 20% of the causes. For example in a business setting, it is suggested that 80% of a company's sales will likely come from 20% of their client base. This phenomenon was first identified when it was found that 80% of Italy's land was owned by 20% of the population. Similar results have been found in the USA, France and the UK. The theory was further supported by its founder when he discovered that 20% of the peapods in his garden contained 80% of the peas.",
            question: "What country did the identifier of the Pareto principle first identified this phenomenon?",
            options: [
                "Italy",
                "USA",
                "UK",
                "France"
            ],
            correctAnswer: 0,
            explanation: "Step 1: The passage states that the identifier of the principle looked at the landed owned by the Italian population, and is therefore the correct answer.\nStep 2: The passage states that the phenomenon has been observed in the USA, but it is not the country where it was first identified.\nStep 3: The passage states that the phenomenon has been observed in the UK, but it is not the country where it was first identified.\nStep 4: The passage states that the phenomenon has been observed in France, but it is not the country where it was first identified."
        },
        {
            passage: "The democracy index, devised by the Economist intelligence unit measures the state of democracy in 167 countries around the world, 166 of which are sovereign states and 165 are members of the United Nations. In this index there are 4 different groupings which denote a countries level of democracy, at the top is a full democracy, of which many North American and western European countries belong. Next is a flawed democracy, of which many South American and Latin American countries belong. Next are hybrid regimes, of which many Asian and eastern European countries belong. Last, and therefore the least democratic counties are authoritarian regimes, which many north African and middle eastern countries belong.",
            question: "According to the passage, which countries tend to contain hybrid regimes?",
            options: [
                "South America and Latin America countries",
                "Asian and eastern European countries",
                "North African and middle eastern",
                "West African and sub-Sahara"
            ],
            correctAnswer: 1,
            explanation: "Step 1: The passage states that south and Latin American countries often fall in the flawed democracy category, not the hybrid regimes category.\nStep 2: The passage a states that Asian and eastern European countries tent to hybrid regimes and is therefore the correct answer.\nStep 3: North African and Middle Eastern countries often fall into the authoritarian regimes category, not the hybrid regimes category.\nStep 4: West Africa and sub-Sahara are not mentioned in the passage and is therefore an incorrect answer."
        },
        {
            passage: "The emperor penguin is the tallest and heaviest species of penguin, and is native to Antarctica. Both males and females of the species are of similar height (122cm) and weight (22-45kg). Its diet primarily of fish but also includes crustaceans such as krill and cephalopods such as squid. When hunting, the species can remained submerged for up to 18 minutes, diving to a depth of 535m (1755ft). To allow it to function at low oxygen levels, it has evolved solid bones to reduce barotrauma and the ability to reduce its metabolism.",
            question: "According to the passage, how deep can the emperor penguin submerge when hunting?",
            options: [
                "1775ft",
                "1755m",
                "535ft",
                "535m"
            ],
            correctAnswer: 3,
            explanation: "Step 1: The passage states that the depth the penguin can submerge is 1755ft, not 1775ft.\nStep 2: The passage states that the depth the penguin can submerge is 1755ft, not 1755m.\nStep 3: The passage states that the depth the penguin can submerge is 535m, not 535ft.\nStep 4: The passage does state that the depth the penguin can submerge is 535m and is therefore the correct answer."
        },
        {
            passage: "Crowdsourcing is a process that involves outsourcing tasks to a distributed group of people. This process can occur both online and offline. Crowdsourcing differs from ordinary outsourcing by outsourcing to an undefined public, rather than a specific company or formal employment. Participants are either paid financially, with prizes or in recognition. Because of the use of amateurs or volunteers, crowdsourcing is an inexpensive and large numbers of people can be gathered. However, the tasks which crowdsourcing can be use has to be an enjoyable/important activity to rally volunteers, as mundane and tedious activities may not draw in crowds.",
            question: "Based on the passage, how aren't crowdsourced people definitely paid?",
            options: [
                "Recognition",
                "Prizes",
                "Formal employment",
                "Financially"
            ],
            correctAnswer: 2,
            explanation: "Step 1: Recognition is stated in the passage as a form of payment, and is therefore incorrect.\nStep 2: Prized are stated in the passage as a form of payment, and is therefore incorrect.\nStep 3: Formal employment is not stated to be a form of compensation and is therefore the correct answer.\nStep 4: Financial payment is stated in the passage as a form of payment and is therefore incorrect."
        },
        {
            passage: "Qatar is a sovereign Arab nation, located in western Asia occupying the small Qatar peninsular. Qatar's only land border is with Saudi Arabia to the south, with the rest of its territory surrounded by the Persian Gulf. Qatar has been rules as an absolute monarchy since the mid-19th century, and was formerly a British protectorate noted mainly for pearling. Since its independence from the British in 1971 Qatar has become one of the regions richest states, due to vast oil and gas reserves. Qatar is ranked first in the world for highest gross domestic product per capita, has the second highest human development index in the Middle East and fifth largest export market in the Middle East.",
            question: "According to the passage, what human development index ranking does Qatar have in the middle east?",
            options: [
                "1st",
                "2nd",
                "5th",
                "6th"
            ],
            correctAnswer: 1,
            explanation: "Step 1: The passage states that Qatar is ranked 1st for GDP, not human development index, and is therefore false.\nStep 2: The passage states that Qatar is ranked 2nd for human development index, and is therefore correct.\nStep 3: The passage ranks Qatar's exports as 5th in the middle east, not human development index.\nStep 4: The passage does not mention any of Qatar's rankings as 6th, and is therefore false."
        },
        {
            passage: "Is the social media another dotcom bubble? In After the recent fall in value of Facebook post its initial public offering brings back memories, is the interest in social media simple a repeat of the dotcom bubble of 2000-2002? The parallels are striking, both cases investors aggressively purchased stock, euphorically expecting a high return, however in the subsequent months following the IPO it was clear that a sizeable loss was found instead. Facebook's shares had fallen forty percent since they started trading in May and seem to be continuing onward down. Group-on has also seen its shares plummet, losing two thirds of its initial value. Similarly shares for Zynga have dropped seventy percent since trading. Only time will tell is this period shall go down in history as the second dotcom bubble.",
            question: "According to the passage, by what amount has Facebook shares dropped since its initial public offering?",
            options: [
                "40%",
                "Two thirds",
                "70%",
                "50%"
            ],
            correctAnswer: 0,
            explanation: "Step 1: The passage states that Facebook's share value has dropped by 40, and is therefore the correct answer.\nStep 2: The passage states that Group-on shares have dropped two thirds, not Facebook's shares.\nStep 3: The passage states that Zynga's shares have dropped seventy percent, not Facebook's shares.\nStep 4: The passage does not give any statistics at 50% and is therefore not correct."
        },
        {
            passage: "The decline in China's housing and construction market has had a profound knock-on effect on China's steel industry. Due to decreased demand for steel from construction, as huge construction projects around China are reduced to ghost towns by decreased investment, Chinese state-owned steel companies have seen their profits drop by almost 96%. The drop in steel prices may be an indicator of things to come; lower steel prices suggest lower predicted economic growth, and may spell disaster for China's hopes of continued rapid growth.",
            question: "Based on the passage, what is not an effect of China's construction market decline?",
            options: [
                "Decreased steel demand",
                "Decreased steel prices",
                "Decreased steel company profits",
                "Decreased steel exports"
            ],
            correctAnswer: 3,
            explanation: "Step 1: Decreased steel demand is stated as an effect in the passage.\nStep 2: Decrease steel prices are states as an effect in the passage.\nStep 3: Decreased steel company profits are states as an effect in the passage.\nStep 4: Decreased steel exports are not mentioned in the passage, and is therefore the correct answer."
        },
        {
            passage: "Consumer cooperatives are enterprises owned by consumers and managed democratically, with the goal of fulfilling the needs of its members. These cooperatives differ from privately or publicly owned companies as they do not have shareholders in the traditional sense, instead every member of the cooperative has one vote, and they can utilise this vote for electing a board of directors and/or management. Cooperatives also pursue social goals, such as economic democracy, transparency, financial benefits for the consumer.",
            question: "Based on the passage, what statement is not a suggested goal of a consumer cooperative?",
            options: [
                "Fulfilling the needs of its members",
                "Economic democracy",
                "Product quality",
                "Financial benefits"
            ],
            correctAnswer: 2,
            explanation: "Step 1: The passage states that the goal of a cooperative is the fulfil the needs of its members.\nStep 2: The passage states that a social goal of a cooperative is economic democracy.\nStep 3: The passage does not mention product quality, and is therefore the correct answer.\nStep 4: Financial benefits are mentioned as a social goal of a cooperative."
        },
        {
            passage: "Nanotechnology is the manipulation of matter on an atomic or molecular scale. Generally speaking, nanotechnology work with materials, devices and other structure with at least one dimension sized from one to one hundred nanometres. Through the national nanotechnology initiative, the USA has invested 3.7 billion dollars, the European Union 1.2 billion dollars and japan 750 million dollars. Scientists debate the future implication of nanotechnology, suggesting that the technology could have profound effects on the global economy and even cause doomsday scenarios.",
            question: "Based on the passage, how much has japan invested into the national nanotechnology initiative?",
            options: [
                "$750 million",
                "$750 Billion",
                "£750 million",
                "£750 billion"
            ],
            correctAnswer: 0,
            explanation: "Step 1: The passage states that 750 million dollars have been spent by Japan, and is therefore the correct answer.\nStep 2: The passage states that 750 million dollars, not billion dollars have been spent by Japan, and is therefore incorrect.\nStep 3: The passage states that 750 million dollars, not pounds, have been spent, and is therefore incorrect.\nStep 4: The passage states that 750 million dollars, not billion pounds have been spent, and is therefore incorrect."
        },
        {
            passage: "The Aral Sea, located between Uzbekistan and Kazakhstan was once the fourth largest lake in the world. Two port cities were located on it and 22 different varieties of fish could be found in the Aral. However, when the Soviet Union decided to boost cotton farming by constructing dams on the two large rivers that flowed into the Aral Sea, soil erosion and evaporation took its effect. By the 1970s twenty percent of the sea had diminished, by 1980 thirty percent had diminished, forty percent by 1990 and today ninety percent of the Aral Sea has disappeared. However, the Kazakh government pledges to reverse this effect, and return the sea to its former glory.",
            question: "According to the passage, by which year had thirty percent of the Aral sea disappeared?",
            options: [
                "1970",
                "1980",
                "1990",
                "Today"
            ],
            correctAnswer: 1,
            explanation: "Step 1: In 1970 the Aral sea had diminished by 20%, not 30%.\nStep 2: By 1980 the Aral sea had diminished by 30%, and is therefore correct.\nStep 3: By 1990 the Aral sea had diminished by 40%, not 30%.\nStep 4: By today the Aral sea has diminished by 90%, not 30%."
        },
        {
            passage: "The happy planet index is an index of human wellbeing and environmental impact that was introduced by the new economics foundation. The index is designed up challenge the well-established indices of countries development, such as gross domestic product, human development index and quality of life index. Furthermore, it is believed that the notion of sustainable development requires a measure of environment costs in pursuing happiness and health. On this index Costa Rica was ranked the highest in HPI, and Zimbabwe was ranked the lowest in HPI.",
            question: "Based on the passage, what indices does happy planet index not challenge?",
            options: [
                "Gross domestic product",
                "Gross national happiness",
                "Human development index",
                "Quality of life index"
            ],
            correctAnswer: 1,
            explanation: "Step 1: The passage does mention gross domestic product as an index.\nStep 2: The passage does not mention gross national happiness, and is therefore the correct answer.\nStep 3: The passage does mention human development index.\nStep 4: The passage does mention quality of life index."
        },
        {
            passage: "The effects of spaceflight on astronauts have been an important area of study since the start of manned spaceflight. The effects of weightlessness on the body are believed to be the key problem astronaut's face in medium to long term space missions. Short term weightlessness can lead to motion sickness, lethargy and nausea. Long term weightlessness may lead to the loss of bone and muscle mass, disrupted vision and weakened immune system. More research is necessary to limit the effects of weightlessness on astronauts if manned space flight is to continue.",
            question: "Based on the passage above, what is a long-term effect of weightlessness?",
            options: [
                "Motion sickness",
                "Lethargy",
                "Nausea",
                "Disrupted vision"
            ],
            correctAnswer: 3,
            explanation: "Step 1: Motion sickness is stated to be a short-term effect of weightlessness.\nStep 2: Lethargy is stated to be a short-term effect of weightlessness.\nStep 3: Nausea is stated to be a short term effect of weightlessness.\nStep 4: Disrupted vision is stated to be a long-term effect of weightlessness, and is the correct answer."
        },
        {
            passage: "Is internet addiction a real medical disorder? Particularly in Asian countries, compulsive internet and online gaming use has become a serious issue, however, the American psychiatric association doesn't acknowledge it as a real disorder. It was found that both South Korea and China had estimated internet addiction rates of thirty percent in their populations, and 1/8th of Americans affected by internet addiction. A range of treatments are available for the severely internet-addicted and South Korean video gaming companies have dedicated technological resources to promote healthy gaming behaviour. However, the American psychiatric association, the British psychological society and the world health organisation are still undecided as to whether internet addiction is classified as a genuine medical disorder.",
            question: "Which one of the following organisations is not mentioned in the passage",
            options: [
                "The American psychological association",
                "The British psychological association",
                "The world health organisation",
                "The American Psychiatric association"
            ],
            correctAnswer: 0,
            explanation: "Step 1: The American psychological association is not mentioned in the passage, the American psychiatric association is mentioned however, and is therefore the correct answer.\nStep 2: The British's psychological association is mentioned in the passage and is therefore incorrect.\nStep 3: The world health organisation is mentioned in the passage and is therefore incorrect.\nStep 4: The American psychiatric association is mentioned in the passage and is therefore incorrect."
        },
        {
            passage: "With increased demands on business executives to travel in the globalised economy, how do globe-trotting executives manager their travel demands? A highly invaluable resources tapped by senior executives is the use of one or more personal assistants. More than glorified receptionists, PA's hold considerable power in the work place, deciding who gains access to their employer and when, being privy to highly sensitive information and maintaining order in the executives absence. Having this extra helping hand can allow executives to focus on the more important tasks and objectives, allowing them to save time, effort and improve efficiency.",
            question: "Based on the passage above, which statement is definitely true?",
            options: [
                "Personal assistants are glorified receptionists",
                "Personal assistants are efficient",
                "Personal assistants are privy to sensitive information",
                "Personal assistants are expensive"
            ],
            correctAnswer: 2,
            explanation: "Step 1: The passage states that personal assistants are far from glorified receptionists, and is therefore false.\nStep 2: The passage states that personal assistants make executives more efficient, but does not mention PA's efficiency, and is therefore not definitely true.\nStep 3: The passage does state that personal assistants are privy to sensitive information, and is therefore true.\nStep 4: The passage does not state a cost for PA's, and is therefore not definitely true."
        },
        {
            passage: "It was recently announced that the EU has launched a youth unemployment plan to tackle youth unemployment in the 27 EU member countries. This youth opportunities initiative promises to create 370,000 work placements across the EU. It proposed a youth guarantee to put young people in work, study or training within four months of leaving school. The commission states that youth unemployment costs around 20 billion euros per week or one percent of the entire EU's economic output. However critics say that the initiative will not benefit the UK, suggesting that youth unemployment was a problem before the economic turmoil, and will not be solved by reallocating funds.",
            question: "Based on the passage, how much does youth unemployment cost the EU?",
            options: [
                "£20 billion",
                "£20 million",
                "1 percent of total national debt",
                "1 percent of total economic output"
            ],
            correctAnswer: 3,
            explanation: "Step 1: The passage states that youth unemployment cost the EU 20 billion euros, not pounds.\nStep 2: The passage states that youth unemployment costs the EU 20 billion euros, not million or pounds.\nStep 3: The passage does not mention national debt.\nStep 4: The passage states that youth unemployment costs 1 percent of the EU's entire economic output and is therefore correct."
        },
        {
            passage: "On the city liveability scale, the city of Melbourne Australia has overtaken the Canadian city of Vancouver as the world most liveable city. Melbourne's score of 97.5% is just 2.5% away from a perfect score, only losing points for climate, culture and petty crime. Other Australian cities included in the index are the city of Sydney which was ranked seventh and the city Adelaide, which was ranked fifth. However the city of London, due to the recent riots in 2011, as dropped 2 places to 55th in the ranking.",
            question: "Based on the passage, what are the rankings for Melbourne, Sydney and Adelaide?",
            options: [
                "Melbourne (5th) Adelaide (1st), Sydney (7th)",
                "Melbourne (1st), Adelaide (5th), Sydney (7th)",
                "Melbourne (7th) Adelaide (5th) Sydney (1st)",
                "Melbourne (1th) Adelaide (7st), Sydney (5th)"
            ],
            correctAnswer: 1,
            explanation: "Step 1: The correct ranking is Melbourne (1st), Adelaide (5th), Sydney (7th).\nStep 2: The passage states that the correct ranking is Melbourne (1st), Adelaide (5th), Sydney (7th) and is therefore the correct answer.\nStep 3: The correct ranking is Melbourne (1st), Adelaide (5th), Sydney (7th).\nStep 4: The correct ranking is Melbourne (1st), Adelaide (5th), Sydney (7th)."
        },
        {
            passage: "After a ruling that entitled customer taking out credit cards and loans with payment protection (PPI) insurance to reclaim this PPI back in compensation, the financial ombudsman service is taking hundreds of claims a day. The main causes for this increase in claims are due to solicitor's aggressively pursuing compensation on behalf of their clients, and their no win-no fee policies and the large numbers of customers miss sold PPI; customers are making these claims in huge numbers. So far these claims have led to over £200 million in compensation payments. However it was noted that only 5 to 10 percent of all complaints ever make it to the ombudsman, say the service.",
            question: "Based on the passage, what is not stated to be a reason for the increase in PPI compensation claims.",
            options: [
                "Aggressive advertising campaigns",
                "No win-no fee policies",
                "Large number customers miss sold PPI",
                "Aggressive solicitors"
            ],
            correctAnswer: 0,
            explanation: "Step 1: The passage does not mention aggrieve advertising campaigns, and is therefore the correct answer.\nStep 2: No win no fee policies are states to be a reason for the increase in claims.\nStep 3: Large number of customers miss sold PPI is stated to be a reason for the increase in claims.\nStep 4: Solicitors aggressively pursuing claims are stated to be a reason for the increase in claims."
        },
        {
            passage: "The idea of growing a burger in a laboratory seems like farfetched science fiction, however recently this prospect has become closer to reality than ever before. Using synthetic meat made from a small amount of cells from a living animal and growing it into lumps of muscle tissue could provide numerous ethical and economic benefits. For example killing animals for meat will no longer be required and without the need for livestock the environmental damage of keeping livestock can be avoided. Similarly growing meat will eventually become far cheaper than raising livestock, increasing profits and saving time.",
            question: "Based on the passage above, what is not a stated benefit of synthetic meat?",
            options: [
                "Avoiding killing animals",
                "Less environmental damage",
                "Lower amounts of animal waste",
                "Cheaper than raising livestock"
            ],
            correctAnswer: 2,
            explanation: "Step 1: Avoiding killing animals is stated to be a benefit of synthetic meat.\nStep 2: Less environmental damage is stated to be a benefit of synthetic meat.\nStep 3: Animal waste is not mentioned in the statement, and is therefore the correct answer.\nStep 4: Being cheaper than raising livestock is states to be a benefit of synthetic meat."
        },
        {
            passage: "Health and safety at work has been seen as an issue of increasing importance during the 20th and 21st centuries. During the industrial revolution and the 18th and 19th centuries, limited union strength and a lack of regulation made workplaces extremely dangerous environments. Factories with newly designed equipment, with numerous unprotected moving parts could easily seriously injure or kill an employee. Without adequate legislation or union support, those injured in this way would often not be compensated. However as trade union membership grew both in size and influence, health and safety changes were implemented and ensured an improved working environment.",
            question: "Based on the passage above, what is the stated reason for the increased emphasis on health and safety",
            options: [
                "Socialist movement",
                "Industrial revolution",
                "Newly designed equipment",
                "Trade union membership"
            ],
            correctAnswer: 3,
            explanation: "Step 1: The passage does not discuss the socialist movement.\nStep 2: The industrial revolution is not stated to be a reason for increased health and safety.\nStep 3: Newly designed equipment is not stated to be a reason for increased health and safety.\nStep 4: Trade union membership is stated to be the reason for the increased emphasis on health and safety, and is therefore the correct answer."
        },
        {
            passage: "Epidemiology is the study of the distribution and patterns of heath-events, heath-characteristics and their causes or influence in well-defined populations. It is the cornerstone method of public health research and practice, and helps inform public decisions and evidence based medicine. The major areas of epidemiological study include disease etiology, outbreak investigation and disease surveillance. Other areas of study include bio monitoring, screening and comparisons of clinical trials. Epidemiology utilised many other scientific disciplines such as biology, biostatistics and social sciences.",
            question: "Based on the passage, what is a major area of study in epidemiology?",
            options: [
                "Bio monitoring",
                "Comparing clinical trials",
                "Outbreak investigation",
                "Screening"
            ],
            correctAnswer: 2,
            explanation: "Step 1: Bio monitoring is mentioned as an area of study, but not a major area of study.\nStep 2: Comparing clinical trials is mentioned as an area of study, but not a major area of study.\nStep 3: Outbreak investigation is stated to be a major area of study, and is therefore the correct answer.\nStep 4: Screening is stated to be an area of study, but not a major area of study."
        }
    ]
};

// Initialize the test when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeTest(testData);
}); 