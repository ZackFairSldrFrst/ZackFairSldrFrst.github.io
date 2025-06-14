// Test configuration
const testConfig = {
    questions: [
        {
            passage: "The music industry continues to be one of the fastest growing sectors of the British economy. This trend can be traced to the large range of media available, such as concerts and downloads, and the wide ranging target audience. For example, the music industry confidently boasts to be the only form of media enjoyed by both the youngest and oldest individuals in society. In comparison, forms of media, such as gaming, are enjoyed a by a marginal sector of society. However, statistics suggest that not all forms of music are enjoying this boom. Sales figures for operatic music continue to decrease steadily. In this way, it is feared that the dominance of the music industry, catering to popular culture, comes at the expense of long-standing art forms.",
            question: "Why is the music industry the fastest growing sector in the British economy? Base your answer on the information in the passage alone.",
            options: [
                "It caters to a wide target audience",
                "It is enjoyed by a marginal sector of society",
                "It is a long-standing art form",
                "Operatic music is finally dying out"
            ],
            correctAnswer: 0,
            explanation: "The passage states that the music industry is the fastest growing sector of the economy because it is enjoyed by both the youngest and oldest individuals in society. This suggests that it is enjoyed by a wide ranging target audience."
        },
        {
            passage: "'Dumbards' champagne house, a company based in the south of France, employ local workers only. The reason behind this policy is that Dumbards promote their products as home-crafted, 'lovingly-made'. They believe that by employing local workers, their products appear more exclusive, and therefore, more expensive. In recruiting its workers, Dumbards place advertisements in the local newspaper and shop windows. They are heavily sceptical about the internet and refuse to advertise on it. Another way in which Dumbards recruit their staff is via recommendations from current employees. In September last year, the company was taken over by an American businessman who is keen to rebrand the company. He wants Dumbards to be more metropolitan and intends to open the selection process to workers from other EU countries. This idea has been controversial and may lead to strike action by current employees.",
            question: "Based on the information in the passage, which one of the following statements is true?",
            options: [
                "Dumbards employ local workers as it is cheaper",
                "Dumbards refuse to use internet advertising due to bad experiences",
                "Dumbards rely exclusively on recommendations from current employees",
                "Dumbards only employ local workers to appear exclusive"
            ],
            correctAnswer: 3,
            explanation: "The passage identifies that 'Dumbards' only select local employees as it wishes to appear 'exclusive'."
        },
        {
            passage: "The colour of a product's packaging often denotes what is inside of it. The most common example of this can be seen in the flavours of crisps. For example, the colour red commonly denotes ready salted whereas blue is often cheese and onion. The colour coding of product packaging can also be seen in cleaning products, with lemon yellow packaging or apple green. In addition to the packaging of products, the choice of colour can also represent emotion (with red as sensual, or black for mourning), instructions (such as green for go), and gender (with blue and pink). In this way, the colour of the world around us can often be a helpful message. However, these 'colour codes' are often dependant to a particular culture they are formed in and may not be universal.",
            question: "Based on the information in the passage only, which one of the following options is incorrect?",
            options: [
                "The colour of packaging can indicate what the product is",
                "The product's packaging colour may depend on culture",
                "The colour of a product's packaging tends to be universal",
                "'Colour coding' is seen in foods, cleaning products and traffic signals"
            ],
            correctAnswer: 2,
            explanation: "The passage identifies that the colouring of a product's packaging may be culturally dependant and are, therefore, not always universal."
        },
        {
            passage: "Over half the population of the UK take a form of food supplement daily. Food supplements, such as vitamin c, are said to make up for a lack of nutrients in an individual's diet. An example of this can be seen with vegetarianism. Vegetarians are recommended to take iron supplements to make-up for a lack of iron, most commonly found in meat products. Such an addition can prevent common problems associated with vegetarianism, such as anaemia. Statistics suggest that the most popular food supplement in the UK is multi vitamins, with two thirds of people adding multi-vitamins to their diet. Iron tablets are the second most popular daily supplement. However, such supplements are not intended to replace a balanced diet.",
            question: "Based on the information in the paragraph alone, which one of the following statements is true?",
            options: [
                "Food supplements can aid weight loss",
                "Half the UK population take multivitamin daily",
                "Supplements are becoming increasingly popular",
                "Supplements are not intended to replace a balanced diet"
            ],
            correctAnswer: 3,
            explanation: "The passage notes these products are not intended to replace a balanced diet."
        },
        {
            passage: "There are several forms of public transport in the UK. Statistics suggest that forms of public transport are becoming increasingly popular, due to relatively cheap cost when compared to private transport. In addition to this, public transport is often quicker and more reliable, especially when travelling in busy cities, such as London. One reason why public transport is increasingly popular in London is the ease in which people can travel around the city centre. Services such as the Underground provide the opportunity to beat traffic congestion and negate the need for often costly parking. In addition, the regularity of such services is popular. However, public transport is often less popular in less densely populated areas. A possible reason for this is that services tend to be less regular, making public transport a less practical option.",
            question: "Based on the information in the passage alone, which of the following reasons does the writer give for the popularity of public transport in cities?",
            options: [
                "Public transport can be cheaper and more practical in busy cities",
                "Public transport is more entertaining than private transport",
                "Public transport is often safer than parking in busy cities",
                "Public transport offers less regular services and can be unpractical"
            ],
            correctAnswer: 0,
            explanation: "The passage states that public transport is often cheaper and more practical than private transport."
        },
        {
            passage: "YoGo is a company that makes low-fat dairy products. It built its reputation making virtually fat-free yogurts, but has since branched out to produce low fat ice-creams, milkshakes and cooking sauces. YoGo's biggest competitor is DairyFree, a company that makes fat-free, dairy-free products. In order to compete with DairyFree, YoGo is trying to lower the cost of its products. It hopes to do this by buying its ingredients in bulk, using automated production lines and reducing the amount of packaging. Since implementing these changes, YoGo has seen an increase in its profit margin but sales figures are yet to change. In comparison, DairyFree has out sold its target for this month, as a result of a marketing scheme. This scheme included the giving away free samples and discount vouchers, a marketing ploy that YoGo will not be able to compete with.",
            question: "Based on the information in the passage alone, which of the following has YoGo implemented in an attempt to compete with DairyFree?",
            options: [
                "A scheme that gives away free samples and discount vouchers",
                "A scheme that aims to reduce the cost of production",
                "YoGo has lowered the costs and given away free samples",
                "YoGo will go into administration"
            ],
            correctAnswer: 1,
            explanation: "The passage states that YoGo has been trying to reduce the cost of its productions."
        },
        {
            passage: "The following passage provides information regarding the most popular type of foods in the United Kingdom. Such information has been compiled by the UK Foods Standards Agency since 1990 as part of an on-going project to encourage consumers to purchase healthier products, such as fruit and vegetables, whole grain foods and foods low in saturated fat. Currently, the most popular types of food in the UK are those which are easy to prepare. Items requiring time consuming preparation continue to suffer comparatively lower sales rates. In this way, the Foods Standards Agency has found that 'pack items', those containing ready-measured baking ingredients, are more popular than buying fresh ingredients in bulk. Similarly, ready baked items, such as bread and biscuits, continue to sell well.",
            question: "Since 1990, the UK Foods Standards Agency has...",
            options: [
                "Discouraged the purchase of 'pack-items'",
                "Encouraged consumers to purchase items such as fruit",
                "Encouraged consumers to purchase items that are easy to prepare",
                "Encouraged consumers to purchase items with no fat"
            ],
            correctAnswer: 1,
            explanation: "The passage notes that the Food Standards Agency is encouraging consumers to eat healthily. Option B correctly identifies 'fruit' as an example noted by the passage of a food promoted by the Foods Standards Agency."
        },
        {
            passage: "The Tea Palace, a popular shop in London's West End, opened its doors in 1880. Nowadays over an estimated one million consumers pass through its doors every year. The shop, commonly known as 'the palace', imports products from all over the world. A major attraction for tourists, 'the palace' has continued to make tea in the same way since opening. Large ladles of dried tea leaves are placed in metal cauldrons over the fires of the open kitchen; customers are able to see this process and the tea, in traditional pots, is then brought to the table. Many customers take pictures of this process and like to pose for pictures in front of the shop's world-famous front door.",
            question: "Based on the information in the passage alone, which of the following answers is most likely to be false?",
            options: [
                "The Tea Palace receives half a million people every six months",
                "The Tea Palace makes its tea at the customer's table",
                "The Tea Palace imports items from all over the globe",
                "The Tea Palace is a major attraction for tourists"
            ],
            correctAnswer: 1,
            explanation: "The passage states that the 'Tea palace' makes the tea over fires in its open kitchen, not at the customer's table."
        },
        {
            passage: "An important skill when working in an office environment is the ability to get on well with those around you. As many people spend the majority of their waking day at work, the ability to be polite and respectful has never been more important. For this reason, when hiring new staff, employers look at the inter personal skills of possible employees. How well is this person able to get on with those around them? Are they respectful of other people or do they push through their own will at the expense of others? Such skills are also of value in occupations where there is prolonged contact with clients. Many businesses making a lasting impression through the way their staffs represent them, and are unlikely to employ those who make a negative impression.",
            question: "Based on the information in the passage alone, which of the following statements is not mentioned by the passage?",
            options: [
                "Respectful individuals are more likely to get promoted",
                "Respectful individuals are likely to appear attractive to an employer",
                "Businesses are less likely to employ those who have a negative attitude",
                "Many people spend the majority of their day at work"
            ],
            correctAnswer: 0,
            explanation: "The passage makes no reference to promotions."
        },
        {
            passage: "Engineering firm Westerns reported annual net profits of one-billion pounds over the last financial year. The company plans to re-invest this money into the business by creating three hundred new apprenticeships. Westerns, who are known for hiring from within their own apprentices, hope that such a step will encourage other companies to offer more jobs for younger workers. Youth unemployment rates are currently at an all-time high in the UK. A possible reason for this is a lack of training placements and non-academic routes for school leavers. However, as the average unemployment rate continues to rise, mirroring that of youths, differing reasons may be to blame.",
            question: "Using the information in the passage only, select the answer that most accurately completes the following sentence. Westerns engineering firm...",
            options: [
                "Reported net-profits of one-million pounds over the last financial year",
                "Are known for the careful selection of their apprentices",
                "Always re-invest their profits back into the business",
                "Plan to create a number of new apprenticeship placements"
            ],
            correctAnswer: 3,
            explanation: "Option d correctly identifies that Western's plan to create a number of new apprenticeships."
        },
        {
            passage: "Many graduates opt to house-share during the beginning of their careers. A benefit of this is that it provides the opportunity to save money; it reduces rent without compromising the standard of accommodation. In this way, house-sharing is often a popular option. However, living in close proximity with non-family members can often be taxing. Issues such as division of chores, payment of bills and respecting personal privacy can make such arrangements difficult. Statistics suggest that over sixty percent of graduates who opt to house-share live with the same people for no more than one year before finding other arrangements. For this reason there has been an increase in the number of graduates renting self-sufficient accommodation.",
            question: "Based on the information in the passage alone, which of the following statements is most likely to be true?",
            options: [
                "A source of disruption between house-mates is tax",
                "House-sharing became popular in the nineteen-fifties",
                "House-sharing is a popular option amongst graduates",
                "Graduates live with their house-mates for much less than one year"
            ],
            correctAnswer: 2,
            explanation: "The passage correctly identifies that house sharing is a popular option amongst graduates at the beginning of their careers."
        },
        {
            passage: "A leading holiday provider was forced to close the doors of 200 hundred of its stores yesterday. The travel giant, who had been in operation for almost 170 years, made this move after it reported a loss of over £350 million at its annual shareholders' meeting. The company, which has over 1,000 stores in the UK, confirmed that 660 members of staff were also being let go. Business analysts suggest that the company faces another difficult year, as consumer confidence is at an all-time low.",
            question: "Based on the information in the passage, which one of the following statements is correct?",
            options: [
                "The holiday provider has over 1,000 UK stores and 660 staff",
                "The holiday provider recently confirmed that staff were being let go",
                "The holiday provider has been in operation for exactly 170 years",
                "More closures are planned for the future"
            ],
            correctAnswer: 1,
            explanation: "Option b correctly identifies that the holiday provider discussed in the passage has over 1,000 stores. It also correctly identifies that the company recently confirmed that it was letting a number of staff go."
        },
        {
            passage: "A leading supermarket recently announced plans to open twenty-five new stores, despite the difficult economic conditions facing the country. It is hoped that the expansion will create more than 6,500 jobs over the next year, with the focus placed on local residents who are currently unemployed. This announcement comes as official statistics suggest unemployment is at a seventeen-year high in Britain.",
            question: "Complete the following sentence based on only the passage. It was recently announced that..?",
            options: [
                "Unemployment in Britain is at an all-time high",
                "Local people are more likely to be unemployed",
                "A supermarket opens new stores, despite financial problems",
                "A supermarket opens new stores, despite the economic climate"
            ],
            correctAnswer: 3,
            explanation: "D is the right answer. It correctly identifies that new stores are to be opened despite the current economic conditions facing the country."
        },
        {
            passage: "A growing number of university and A-level students are turning to extreme means as a way of funding their education. The National Union of Students (NUS) found that an alarming number of students are working as escorts, gambling or volunteering to take part in medical experiments to bolster their income. According to the NUS, the increased cost of living and the reduction in graduate jobs and educational maintenance allowance (EMA) is behind such drastic action. The NUS predicts that 15% of women working in lap-dancing clubs are students. Responding to the release of this information, a spokesman for the Department for Education stated that there is currently over one hundred and eighty million pounds of financial support available each year for the most vulnerable students, but further support from the universities and colleges themselves is required, in the form of bursaries, for any real change to take place.",
            question: "Based on the passage, which one of the following statements cannot be deduced?",
            options: [
                "More female students are lap dancers than female non-students",
                "£180 million of funding is available for vulnerable students",
                "Some students rely on extreme measures such as escorting",
                "The number of graduate jobs available has reduced"
            ],
            correctAnswer: 0,
            explanation: "The passage states that 15% of women in lap-dancing clubs are estimated to be students. Therefore this is answer false, and A is the correct answer."
        },
        {
            passage: "Current figures suggest that one in five British children will be obese by the time they reach the final year of primary school. This statement comes from a survey conducted by the National Child Measurement Programme, which collected data based on more than one million school children. London was found to have the highest percentage of obese children, with 20% of final year pupils affected by the issue. The survey also noted that the problem was twice as acute in deprived areas, with 14% of four and five year olds in deprived area being obese, compared to only 6% in well-off areas. In comparison to the rising rates of obesity in children, the percentage of obese adults in the UK has fallen, currently standing at 23%.",
            question: "Based on the information in the passage, what percentage of obese children will become obese adults?",
            options: [
                "20%",
                "14%",
                "23%",
                "Cannot say"
            ],
            correctAnswer: 3,
            explanation: "Based on the information in the passage, we cannot say what percentage of obese children will become obese adults."
        },
        {
            passage: "The Office of Fair Trading (OFT) has begun an investigation into Britain's car insurance industry after prices soared by twenty five percent in the last two years. The regulatory body believe that a restriction has been placed on the market by a lack of competition between insurance providers. In addition, the OFT suggest that the increasing popularity of comparison sites has led to an increase in referral fees, which insurance companies passed on to drivers. Further research into the issue is being carried out and is predicted to be completed in the spring of next year.",
            question: "Based on the passage, which one of the following reasons does the OFT blame for the rise in cost for car insurance?",
            options: [
                "An increase in referral fees covered by the insurance provider",
                "An increase in referral fees that get passed on to drivers",
                "An increase in referral fees that are passed on to the OFT",
                "A lack of competition between OFT providers"
            ],
            correctAnswer: 1,
            explanation: "B is the correct answer. It correctly identifies the issue."
        },
        {
            passage: "The luxury goods market has seen a sudden slump in sales in China thanks to the emergence of Chinese labels. While China's love of Western brands, such as Prada and Louis Vuitton, shows no sign of ending, a new group of smaller luxury Chinese companies is gaining in popularity. Such companies try to promote traditional Chinese values, rather than the exclusivity of Western labels that have been ever popular in China. Feedback for the new rivals has been positive so far, yet they are expected to face an up hill struggle as Western heavy-weights rise to meet the challenge.",
            question: "Based on the information in the passage, which one of the following statements is incorrect?",
            options: [
                "Luxury Chinese labels decreased sales of western luxury goods",
                "Chinese companies are emulating the exclusivity of Western luxury goods",
                "Chinese companies are trying to promote traditional values",
                "The Western market is rising to the challenge of Chinese companies"
            ],
            correctAnswer: 1,
            explanation: "B is the right answer. The passage states that the Chinese companies are promoting traditional values, 'rather than the exclusivity of Western labels'."
        },
        {
            passage: "The National Institute for Clinical Excellence (NICE) has announced that the number of cases of anaphylactic shock in the UK has risen by over 600 per cent in the past twenty years. Anaphylaxis is usually triggered by an allergic reaction and can cause a decrease in blood pressure, swelling of the affected area and a difficulty to breath. Such reactions, which can cause death or serious illness in otherwise healthy individuals, are estimated to affect an average of fifty thousand people over the course of their lifetime. Guidelines for dealing with anaphylactic shock were published today by NICE and include advice such as giving those who have previously suffered from anaphylaxis an adrenaline injection, which they can administer themselves in the advent of a future attack. Such measures may prove lifesaving.",
            question: "Based on the passage information, which of the following statements is definitely correct?",
            options: [
                "UK annual Anaphylactic shock cases are numbered at fifty-thousand",
                "UK Anaphylactic shock cases have risen over six hundred percent in ten year",
                "Injection of adrenaline is the only cure for anaphylactic shock",
                "Anaphylactic shock can cause death or serious illness in healthy individuals"
            ],
            correctAnswer: 3,
            explanation: "Option d is the correct answer. The passage states that anaphylactic shock can cause the death or serious illness of otherwise healthy individuals."
        },
        {
            passage: "Over the past decade, the process of out-sourcing has become a common aspect of daily life for many British companies. However, a local governmental authority recently took this phenomenon to a new level when it out-sourced its waste-collection, leisure facilities, planning, licensing and pest control. Acting now in a supervisory role, the local authority now has only fourteen remaining employees. A spokesman for the council stated that this move aimed to reduce spending cuts, as central government grant money is cut substantially across the country. Talking about her workload since the job cuts, a remaining employee commented that the cuts have brought more variety to her day as different tasks now come under one officer, when they would have been segregated prior to the cuts. It remains to be seen whether such changes will streamline local government authorities into more commercial like operations.",
            question: "Which of the following statements is not mentioned by the passage?",
            options: [
                "Local authorities are considering new ways to save money",
                "Since outsourcing, remaining employees have more variety in their day",
                "Out-sourcing has become common practise in many Companies",
                "Authorities must act like commercial operations to survive funding cuts"
            ],
            correctAnswer: 3,
            explanation: "The passage does not mention this statement, and is therefore the correct answer."
        },
        {
            passage: "The rise and fall in the annual gross income of Britain's biggest supermarkets is well documented. For this reason it came as no surprise to many when Tesco's annual figures represented a loss this quarter. Official figures suggest that a price-cutting campaign by Britain's biggest retailer failed to plug the losses, as Tesco made its fourth quarterly loss in a row. Commentators suggest that the fall in sales is a result of the current economic climate, with shoppers' not only spending less on clothing and electronic items, but also on their weekly food shops. However, this view is controversial as smaller competitors, such as Sainsbury's and Morrison's, continue to make a profit.",
            question: "Complete the following sentence based only on the information in the paragraph. Competitors, such as Sainsbury's and Morrison's...",
            options: [
                "Continually pose a threat to Tesco",
                "Continually made a loss in the last four quarters",
                "Continue to make a profit, despite the economic downturn",
                "Continue to make a profit on clothing and electrical items"
            ],
            correctAnswer: 2,
            explanation: "The passage states that these retailers continued to make a profit, and is therefore the correct answer."
        },
        {
            passage: "UK unemployment has reached a new high after the public sector made a new wave of cuts this week. Statistics suggest that those particularly hit by the cuts will be youths, as a record high of over 1 million youths were recorded as unemployed at the beginning of this month. This figure is just under half of the total national statistic for unemployment, a reported 2.5 million. Yet, the number of people claiming unemployment benefits has not risen as far as it was expected to. Economists predicted that the number of people claiming support would rise by an estimated 15,000, yet the actual figure demonstrates a rise of less than 4,000. Perhaps things are not as bad as they seem after all.",
            question: "Based on the information in the passage, what does the writer mean when he states 'perhaps things are not as bad as they seem...'?",
            options: [
                "Unemployment is about to fall, improving the economic outlook",
                "The government is likely to make new public sector cuts",
                "Economists are mistaken and unemployment is lower",
                "Economists over-estimated the number rise in benefits claims"
            ],
            correctAnswer: 3,
            explanation: "The passages mentions the statement in the passage, and is therefore the correct answer."
        },
        {
            passage: "The Law Commission has recommended, as part of a major overhaul to inheritance law, that unmarried couples should have equal inheritance rights. The proposal suggests that unmarried couples who live together for five years or more should be able to inherit from each other without writing a will. This provision would also apply to couples who had lived together for two years or more and who had a child, providing that the child lived with the couple at the time one parent died. An exception to the proposed law would be where one partner had been previously married to another partner and had not divorced them. In this situation, the surviving co-habitant would have no right to the deceased's estate. If passed, this British law is thought to affect roughly 7 million families who cohabit but have never married.",
            question: "Which one of the following statements can we not know based on the information provided in the passage?",
            options: [
                "7 million families in Britain are cohabiting but never married",
                "Recommendations to change inheritance laws have been made",
                "Children without married parents are not entitled to inherit their parents' estate",
                "Cohabiting with a partner still married to someone else would be an exception"
            ],
            correctAnswer: 2,
            explanation: "The inheritance rights of children are not mentioned in the passage, merely the rights of partners who have children."
        },
        {
            passage: "Official statistics from countries around the European Union suggest that Britain has the second-highest living standard within the EU. Research suggests that a major reason for this is the service provided by the NHS. The European research body, 'Eurostat', compared the figures for Britain both with the services supplied by the NHS and without such services. It found that without the aid of the NHS, Britain moved down to 10th in the scale for its standard of living. In the recent report Bulgaria was found to be the worst off country in the EU, with Norway and Sweden as the richest. Denmark was found to be the most expensive to live in within the EU. These figures represent a dramatic change since the last survey carried out in 2007. At the time of the 2007 survey, Ireland was found to be one of the richest countries with its standard of living 48% above the average, beating even Sweden. However, this is no longer the case.",
            question: "Based on the passage, which one of the following statements is correct?",
            options: [
                "'Eurostat' is backed by the European Commission",
                "Denmark is one of the richest countries in the EU",
                "The richest countries are Sweden and Norway",
                "The richest countries are Denmark and Norway"
            ],
            correctAnswer: 2,
            explanation: "The fourth sentence gives 'Norway and Sweden as the richest [in the EU]'."
        },
        {
            passage: "To what extent does advertising a product at a sporting event increase sales? In light of the London Olympics, the relationship between sporting events and advertising is under greater scrutiny by British companies than ever before. Research suggests that in the year prior to the Games, twelve percent of adults talked about the Olympics on a typical day. With this in mind, it is estimated that more than one billion pounds have been invested in the Games in the form of sponsorship from companies. In return for their investment, the exposure gained by sponsors is now legally protected by statute to prevent non-official sponsors from profiting.",
            question: "As a result of the London Olympics...",
            options: [
                "Sporting events and advertising has been researched for the first time",
                "Sporting events and advertising is receiving more attention from companies",
                "Sporting events and advertising is receiving more attention from adults",
                "Sporting events and advertising is now protected by statute"
            ],
            correctAnswer: 1,
            explanation: "Option b is the correct answer. It correctly identifies that the relationship between sporting events and advertising is receiving more attention from British companies as a result of the London 2012 Olympics."
        },
        {
            passage: "The AAA rating currently enjoyed by British banks' may be about to change, as the governor of the Banque de France, Christian Noyer, lashed out at the amount of British debt. This statement was made in response to warnings received by the French government that a number of banks across Europe, including France, are being considered for downgrading. Noyer's outburst continued, as he stated that a downgrade from AAA for France was 'unjust', and that the downgrades should start with the UK, which currently has a larger amount of debt, more inflation and weaker growth than France. However, the French economy is expected to shrink both this quarter and the next, suggesting the nation is suffering from recession. In light of this, a warning for Mr Noyer not to throw stones in glass houses appears apt.",
            question: "Based on the information in the passage only, which of the following statements is definitely correct?",
            options: [
                "British banks will be downgraded from their AAA status",
                "Christian Noyer called it unjust for French banks to lose their AAA status",
                "British bankers are all members of the AA insurance group",
                "The governor of the Banque de France lives in a glass house"
            ],
            correctAnswer: 1,
            explanation: "Option b is the correct answer. It identifies that the governor of the Banque de France stated it would be 'unjust' or 'unfair' if French banks lost their AAA status when British banks did not."
        },
        {
            passage: "Official statistics suggest that only a third of drivers' tax is spent on the roads. In 2010, figures suggest revealed that drivers spent twenty eight billion pounds in fuel taxes, yet, in the same year, only five billion was spent on local roads and a further four billion on national highways. In addition to fuel taxes, excise tax has almost doubled since 1988. Speaking on this subject, the president of the AA stated that the poorest motorists are often the most affected by tax hikes.",
            question: "Based on the information in the above passage, how much tax, in total, was spent on local roads and national highways in 2010?",
            options: [
                "Four billion pounds",
                "Five billion pounds",
                "Nine billion pounds",
                "Twenty-eight billion pounds"
            ],
            correctAnswer: 2,
            explanation: "The passage states that four billion pounds were spent on national highways, and five billion pounds were spent on local roads in 2010. The question asks for the total figure spent on both of these in 2010. This is nine billion pounds."
        },
        {
            passage: "The prime minister recently announced a new plan to kick-start social recovery and 'troubleshoot' dysfunctional families. Under this scheme, the government plans to invest £450 million into families; providing more case workers, probation officers and social workers. While forty percent of the total bill is expected to be provided by central government, the remaining sixty percent is to be provided by local councils. Those in opposition appear sceptical as to the worth of the scheme, highlighting that the funding must be gained by cuts to other key areas. In this way, the prime minister has been accused of 'taking with one hand while giving with the other'.",
            question: "Based on the information in the above passage, what does the author mean when he refers to the proposed scheme as 'taking with one hand while giving with the other'?",
            options: [
                "The author means the scheme will be detrimental to families",
                "The author means funding for the scheme may come from other areas",
                "The author means that only local government will be giving funds",
                "The author means that funds will come from companies"
            ],
            correctAnswer: 1,
            explanation: "Option b correctly identifies that the author suggests funding for the scheme will have to be drawn from other areas currently provided for by the central government."
        },
        {
            passage: "A British surgeon has invented a new device that kills pain without the use of drugs. The gadget, which aims to reduce knee pain and the need for operations, is said to block the pain signal as the spinal cord is unable to carry both the pain and the vibration at the same time. This technique, using vibration to block pain signals, is not new; first appearing in the American civil war before being re-examined in the 1960's and eventually appearing on the market in 2009. This technology, which is powered by AAA batteries, is the first time the product has been widely available for knee pains.",
            question: "Based on the information in the passage only, when was the technology to specifically kill knee pain by the use of vibrations first invented?",
            options: [
                "In the American civil war",
                "In the 1960's",
                "In 2009",
                "Cannot say"
            ],
            correctAnswer: 3,
            explanation: "We are unable to say, based on the information available in the passage, when the technology to block knee pain was first invented."
        },
        {
            passage: "Experts warn that the growing number of dementia cases may become the social problem of this century. The World Alzheimer Report predicts that the burden placed on social resources by cases of dementia will continue to grow as the number of cases escalates. A reason behind the growing number of people suffering from dementia is due to an increase in life expectancy, with more people living into their eighties and nineties that than ever before. In addition to the increasing number of cases, a difference in how differing European countries care for patients with Alzheimer's has also been found. The World Alzheimer report noted that in counties with higher income, patients are more likely to be looked after by professional healthcare workers, than by family members themselves.",
            question: "Based on the information in the passage only, which one of the following statements cannot be deduced?",
            options: [
                "Increased dementia cases will be a burden on social resources",
                "Life expectancy can be seen to be increasing",
                "European countries employ more nurses than other countries",
                "Wealthy European countries are more likely to employ healthcare workers"
            ],
            correctAnswer: 2,
            explanation: "The passage refers to European Countries being more likely to employ professional healthcare workers, but no mention is made on whether these professionals are nurses or whether there are a greater number of nurses than any other country."
        },
        {
            passage: "Australia's economic growth slows down in second quarter, say economists. Annual economic growth in Australia has begun to slow as demand for natural resources slows around the world. Decreased growth in key developing countries such as china and India has taken its toll on the Australian economic, which is heavily based on the mining sector. Similarly commodity prices such as iron ore have also fallen in recent months, negatively effecting Australian mining company profits. A knock on effect of this is decreased investment in the Australian mining sector, hurting investment in the country. It is believed that this decline in demand for natural resources will continue throughout the year, and Australian economic growth is not likely to increase for some time.",
            question: "Based on the passage, which one of the following statements is not correct?",
            options: [
                "Australian mining company profits have been negatively affected",
                "The price of Iron ore has fallen",
                "Increased growth in developing countries is to blame",
                "Investment into Australia has been hurt"
            ],
            correctAnswer: 2,
            explanation: "The increased growth in developing countries is the opposite of the reason given in the passage, which is decreased growth in development countries."
        }
    ],
    timeLimit: 20 * 60 // 20 minutes
};

// Initialize the test
const testCore = new TestCore(testConfig);
testCore.start(); 