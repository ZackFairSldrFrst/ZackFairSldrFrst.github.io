const testData = {
    title: "VC-02: Practice Passages",
    description: "Test your ability to understand and analyze written passages",
    timeLimit: 20,
    questions: [
        {
            passage: "What is the reason behind the traditional red, white and green of the Christmas period? A professor at Cambridge University has set out to question the popular idea that the Victorians are to thank for the colour coding of the festive season. The research, which began in 2009, looks at the possible influence of medieval wooden art and the traditional decorations that can still be found in churches today.",
            question: "Based on the information in the above passage only, according to popular belief, why do we associate red, white and green with the festive period?",
            options: [
                "We associate these colours due to the Victorians.",
                "We associate these colours due to Coca-Cola.",
                "We associate these colours due to medieval wooden art.",
                "We associate these colours due to traditional decorations"
            ],
            correctAnswer: 0,
            explanation: "The correct answer to this question is option a.\nStep 1: Option a correctly identifies that, according to the information in the passage, popular belief is that the Victorian's are to thank for the colour coding of the festive season.\nStep 2: Based on the information in the passage, option b is incorrect as nowhere in the passage is the Coca-Cola Company mentioned.\nStep 3: Option c incorrectly identifies the possible influence of medieval wooden art as a reason popularly believed to be the reason for the festive colouring. The passage states that medieval wooden art is an area of research rather than a commonly accepted reason. Option c is therefore incorrect.\nStep 4: Option d incorrectly identifies traditional decorations as a popularly believed reason for the festive colouring. Based on the information in the passage, traditional decorations are an area of research rather than a commonly accepted reason. Option d is therefore wrong."
        },
        {
            passage: "The price of gold has increased by almost thirty-five percent across the globe over the last year. As a result, previously abandoned gold mines, which were once seen as financially unviable, have been re-opened. An example of this can be seen at the southern Indian state of Karnataka, where companies are re opening gold mines as even low grade ore becomes valuable. India is currently the largest consumer of gold globally; however, the majority of this demand is currently met by import. Commentators question whether this trend will continue as more and more abandoned mines are re-opened.",
            question: "Based solely on the information in the passage, which of the following statements is definitely correct?",
            options: [
                "India's demand for gold is increasing",
                "It is uncertain if India's demand for gold will continue",
                "The majority of India's demand for gold is met by import",
                "India's demand for imported gold is increasing"
            ],
            correctAnswer: 2,
            explanation: "Step 1: The passage fails to mention that India is currently the largest importer of gold across the globe. Option a is therefore incorrect.\nStep 2: The passage fails to mention that India is currently the largest importer of gold across the globe. Option b is therefore wrong.\nStep 3: Option c correctly states that the majority of India's demand is currently met by import. Option c is therefore the right answer.\nStep 4: passage fails to mention whether gold imports are increasing, and is therefore incorrect"
        },
        {
            passage: "The outlook for Ireland's economy looked bleak at the end of 2011, as the Central Statistics Office (CSO) announced that the nation's economy had shrunk by three percent. Economists suggest that this is the result of the Irish government's austerity measures, which have knocked consumer confidence and reduced spending. Not all parts of the Irish economy have suffered, however, as agricultural exports are up by ten percent. The worst affected industry is that of construction, which recorded a record drop of twenty-five percent.",
            question: "Based on the above information, what part of the Irish economy has been worst hit?",
            options: [
                "Agricultural exports",
                "Agricultural Imports",
                "The construction industry",
                "Consumer confidence"
            ],
            correctAnswer: 2,
            explanation: "Step 1: The passage states that agricultural exports have actually grown by ten percent despite the down turn in the economy. Option a is therefore the wrong answer.\nStep 2: The passage does not refer to agricultural imports.\nStep 3: Option c correctly identifies that, according to the information in the passage, the construction industry has been the worst affected. C is therefore the right answer.\nStep 4: The passage refers to consumer confidence being affected by the austerity measures. However, the question asks for the worst affected industry. D is therefore incorrect."
        },
        {
            passage: "The International Monetary Fund (IMF) has announced plans to give the Republic of Ireland a further loan of four billion pounds over the next three years. This announcement comes as the Irish economy shows signs of stabilizing after new spending cuts were recently implemented. In addition to spending cuts, a rise in tax has also been announced. This would take the level of tax in the Republic of Ireland to twenty nine percent, forcing some members of the Dali (Irish Parliament) to voice concerns that shoppers will go to the North instead. A cut in the number of public service workers is also expected.",
            question: "Based on the information above, which of the follow statements is definitely correct?",
            options: [
                "More Irish shoppers are going to the North instead.",
                "The Republic of Ireland does not expect the loan back",
                "Public sector jobs made up the majority of the cuts",
                "The Irish economy shows signs of stabilizing"
            ],
            correctAnswer: 3,
            explanation: "Step 1: The passage states that members of the Dali voiced concerns that more shoppers would go to the North. There is no evidence in the passage to suggest that this is already happening. For this reason, a is incorrect.\nStep 2: The passage states that the IMF has loaned Ireland this money. This suggests that the money is not a gift, but that Ireland is expected to repay this sum.\nStep 3: The passage states that a cut in the number of public service workers is expected. This hasn't happened yet, as option c states. C is therefore incorrect.\nStep 4: Option d is the right answer. It correctly identifies that the Irish economy shows signs of stabilizing."
        },
        {
            passage: "Technology, such as smart-phones and business software, are said to be making a marked difference to life of local people in Ghana. An example of this can be seen in Janga, in the North of Ghana. Janga's economy is predominantly dependant on the collection and export of Shea nuts, traditionally collected by the women of the community. Thanks to the introduction of smart phones, Shea nut collectors are now able to attach barcodes to each bag of nuts that they collect. Scanning these barcodes on smart-phones means that an individual can keep track of the delivery. The barcodes also identify which bags belong to whom, so that the collector receives the right price for their product, based on the amount of and the quality of nuts they collected. While this business model is simple, it endows local workers with more control and bargaining power.",
            question: "Based on the passage, which statement is definitely true?",
            options: [
                "Technology increased workers control over the products they sell",
                "Technology has enabled individual workers to keep in contact",
                "The business model is described in the passage complicated",
                "The barcodes on each bag identifies which area the nuts came from"
            ],
            correctAnswer: 0,
            explanation: "Step 1: Option a correctly identifies that the passage accredits technology, such as smart phones, with providing individual workers in Janga more control over the products they are selling. Option a is therefore the correct answer.\nStep 2: Option b is incorrect. The passage makes no reference to technological advances enabling workers to keep in contact with each other.\nStep 3: Option c is incorrect. The author describes the business model as 'simple'.\nStep 4: Option d is incorrect. No reference is made to the geographical location of the nuts being identified by the barcode."
        },
        {
            passage: "The traditional view, that gaining a degree will provide long-term employment security, has been questioned. The traditional story goes that to get ahead in society, one must spend three to four years and, in most cases, accumulate debt along the way. To leave school with no further education is to gain an unsatisfying career with little potential. However, it can be questioned whether this pattern provides a valid representation of contemporary society. With the rise of tuition fees, the average student debt is at an all time high. In addition, there is even greater competition for graduate jobs.",
            question: "Based on the passage, which statement is not true?",
            options: [
                "The average student debt is at an all-time high",
                "There has been an increase in the number of people going to university",
                "There has been a decrease in the number of people going to university",
                "The traditional university educational path is being questioned"
            ],
            correctAnswer: 2,
            explanation: "Step 1: The passage states that student debt is at an all-time high. Based on the nature of the question, this answer is incorrect.\nStep 2: Option b correctly identifies there has been an increase in the number of people going to university in the USA, Europe and Asia. Based on the nature of the question, b is therefore incorrect.\nStep 3: The passage notes that there has been an increase in the number of people going to university in the USA, Europe and Asia. Based on the nature of the question, c is the correct answer.\nStep 4: Option d correctly notes that, based on the information in the passage, the traditional university educational path is being questioned. Option d is therefore incorrect."
        },
        {
            passage: "The right of those working in the public sector to strike is controversial. Many private sector workers are of the opinion that the cost to tax payers and delays or closures in services outweighs any benefit that may be achieved through industrial action. In addition to this, employers have been criticised for their inability to prevent their workers from striking; it is the responsibility of employers to provide for the continual smooth running of public services, many of which provide a vital aspect of day to day life. An example of this can be seen in the transport industry, where severe delays can have a knock-on effect on the functioning of other industries. Unions should be encouraged to find a less disruptive way of settling disputes.",
            question: "Which one of the following is a problem caused by industrial action? Base your answer solely on the information in the passage above.",
            options: [
                "Delays or closures in services, such as public transport",
                "A lack of control over workers by employers",
                "An increase in the power of unions",
                "The right of those working in the public sector to belong to a union"
            ],
            correctAnswer: 0,
            explanation: "Step 1: Option a is the correct answer. The passage states that many private sector workers are of the opinion that delays or closures in services outweigh any benefit gained through industrial action. This suggests that the delays or closures in service are also a result of industrial action.\nStep 2: Option b is incorrect. The question asks you to base your answer on the information in the passage only. The passage states that employers should be able to provide for the smooth running of public services. This suggests that employers should be able to prevent strike action. The question asks for a problem caused by strike action, not a possible cause of strike action.\nStep 3: Option c is incorrect. The power of unions is not mentioned in the passage.\nStep 4: Option d is incorrect. The right to belong to a union is not mentioned in the passage."
        },
        {
            passage: "The level of air pollution in London is at a record high, with the level of nitrogen dioxide (NO2) higher than anywhere else in Europe. As a result of such high levels of pollution, the UK has received a number of warnings from the EU for its failure to comply with European laws, and may face a possible fine. In addition to this, experts warn that the levels of pollution will affect the weather; leading to periods of storm like weather throughout the summer months and an increase in temperature in the winter. Such pollutants are particularly problematic for those who run in the city on a regular basis, leading to chest pains, a decrease in lung capacity and coughing and other problems.",
            question: "Based on the information in the above passage, which one of the following statements is true?",
            options: [
                "The UK has been fined for the high levels of pollution in London",
                "London has the highest level of nitrogen dioxide in Europe",
                "European laws ban the production of nitrogen dioxide",
                "Running often in the city does not cause chest pains"
            ],
            correctAnswer: 1,
            explanation: "Step 1: The passage states that the UK may face a fine for the high levels of pollution in London. It does not state that the UK has already been fined. Option a is, therefore, the incorrect answer.\nStep 2: The passage states that London has the highest level of nitrogen dioxide in Europe. Option b is, therefore, the correct answer.\nStep 3: The passage does not state that the production of nitrogen dioxide is banned in by European laws. No reference is made by the passage to what the European law actually states. Option c is, therefore, the wrong answer.\nStep 4: The passage states that those who run in the city on a regular basis are likely to experience these problems. For this reason, option d is incorrect."
        },
        {
            passage: "What qualities and attributes make a political leader successful? A recent poll asked voters what they looked for in the ideal political leader; a good economic strategy perhaps, a willingness to admit the past mistakes of one's party or the ability to be likeable as a person. The popular answer seems to be 'credibility'; voters want someone they can trust. How does this translate into a political strategy? To begin with, the poll suggests confusion surrounds the very basics of politics; what do the parties stand for anymore? The past few years has seen such a convergence in political ideals that the once clear 'blue' conservative and 'red' labour lines are now somewhat purple. To be credible, to be a successful political leader, you mustn't be afraid of hanging the banners and stating your policy. By this, and not doing a political 180 after the election, is the key to number 10.",
            question: "What does the author mean by stating that 'a convergence in political ideals' has blurred the once clear blue and red lines? Pick one answer and refer only to the information in the passage.",
            options: [
                "Conservative and Labour parties have become similar",
                "Conservative and Labour parties have become more distinct",
                "Conservative and Labour MPs have become geographically closer",
                "Conservative and Labour party are currently merging"
            ],
            correctAnswer: 0,
            explanation: "Step 1: The passage states that the political ideas of the parties have 'converged' or 'united'. Option a is the only answer that reflects this. A is therefore the correct answer.\nStep 2: The passage states that the political ideals of the parties have 'converged' or 'united'. Option b states that they have become even more distinct. This is the opposite idea to that stated in the passage. Option b is therefore incorrect.\nStep 3: The passage makes no reference to the geographical locations of the parties' offices. Option c is, therefore, incorrect.\nStep 4: The passage makes no reference to the parties forming one dictatorial party. The question states that you should pick your answer based solely on the information in the passage. Option d is, therefore, incorrect."
        },
        {
            passage: "In 2011, the army announced that thirty thousand redundancies were to be made over the next ten years as a result of the economic climate. Such cuts, while perhaps economically necessary, are likely to leave those troops on the front line exposed and at further risk. At what point do the hindrances of economical cutbacks outweigh the benefits? Further cut-backs expected are those to legal aid and speech therapy services; leaving some of the most vulnerable individuals in society worse off. However, some commentators suggest cutbacks to legal aid are not only needed, but welcomed. It is hoped, somewhat naively, that a reduction in the amount of legal aid will prevent fictitious claims and reduce the number of divorces. This author is of the view that such cuts will only affect those who have suffered and need help; those wrongly accused who cannot afford or who can no longer afford the legal price of freedom. After all, aren't our remaining soldiers fighting for freedom?",
            question: "Based on the information in the passage alone, which one of the following statements is false?",
            options: [
                "The army plans to make thirty thousand redundancies",
                "The budget cuts will affect the most vulnerable individuals most",
                "The budget for legal aid may be cut",
                "Legal aid provides for fictitious claims and encourages divorce"
            ],
            correctAnswer: 3,
            explanation: "Step 1: The passage states that in 2011, the army announced it would make thirty thousand redundancies over the next ten years. Therefore, the army plans to make these redundancies by 2021. This statement is correct. The question asks for the false statement. Option a is therefore the wrong answer.\nStep 2: The author states that further cuts will leave some of the most vulnerable individuals in society worse off. This statement is correct. The question asks for the false statement. Option b is therefore the wrong answer.\nStep 3: The passage states that the budget for legal aid may be cut. This statement is correct. The question asks for the false statement. Option c is therefore the wrong answer.\nStep 4: The passage does not state that legal aid provides for fictitious claims and encourages divorces. It states that some commentators hope that a cut in legal aid will reduce these things. This statement is therefore false. The question asks you to identify which statement is false. D is therefore the right answer."
        },
        {
            passage: "This passage discusses the process of creating glow in the dark stars. These plastic stars have an adhesive on one side and stick to the ceiling, providing a dim light in dark rooms. The target audience for this item ranges from young children to teenagers, who may be afraid of the dark or wish to decorate their room. Glow in the dark stars are created from thin sheets of plastic. These sheets are passed through a stamp-cutting machine which passes the sheet of plastic along a conveyer-belt and cuts the star shapes from the plastic. The cut stars are lifted from the sheet by a further part of this machine, whilst the remaining scrap material continues along the conveyer-belt and is then disposed of. Double-sided adhesive stickers are applied to one side of the stars by hand.",
            question: "Based on the information in the passage alone, which one of the following statements is most true?",
            options: [
                "The stars are made by hand",
                "The stars are made from recyclable materials",
                "The stars are normally yellow in colour",
                "The stars are cut by a machine, but the adhesive is attached by hand"
            ],
            correctAnswer: 3,
            explanation: "Step 1: The question asks which of the statements are true. The passage outlines how the item is made. It states that they are created by both a machine and by hand. Therefore, the statement that the stars are hand-made is mostly false. For this reason, option a is incorrect.\nStep 2: The question asks which of the statements are true. The passage makes no reference to the material used to make the stars as being 'recyclable'. The question states that you are to use the information in the passage only. This statement is therefore false. For this reason, option b is incorrect.\nStep 3: The question asks which of the statements are true. The passage makes no reference to the colour of the stars. The question states that you are to use the information in the passage only. This statement is therefore false. For this reason, option c is incorrect.\nStep 4: Option d correctly identifies that the stars are cut by a machine, but that the adhesive is attached by hand. For this reason, option d is correct."
        },
        {
            passage: "In today's competitive job market, educational achievement is of even greater importance. For this reason, it is not only the result of exams which are important, or even which university or college you attend. In today's climate, a further worry is which primary school students attend. In 2010, over 30,000 parents joined waiting lists for their children to attend a fee paying primary school. This figure is almost double that for the year of 2000. In this way, the UK is following in the footsteps of the United States, where it is estimated that one eighth of all primary schools are fee paying.",
            question: "Based on the information in the passage above alone, which of the following statements is false?",
            options: [
                "The waiting list for primary private schools in 2010 was double that of 2000",
                "Roughly one in eight primary schools in the United States are fee paying",
                "Educational achievement is highly important in the current job market",
                "One in eight primary schools in the UK is private"
            ],
            correctAnswer: 3,
            explanation: "Step 1: The question asks which of the statements is false. The passage states that in 2010, the figure of parents joining waiting lists for private primary schools was almost double the figure for 2000. Based on the nature of the question, option a is incorrect.\nStep 2: The question asks which of the following statement is false. The passage states that one in eight primary schools in the United States are fee paying. Based on the nature of the question, option b is incorrect.\nStep 3: The question asks which of the following statement is false. The passage states that educational achievement is increasingly important due to the current job market. Based on the nature of the question, option c is incorrect.\nStep 4: The question asks which of the following statement is false. The passage makes no reference to the ratio of private primary schools in the UK. Based on the nature of the question, option d is the correct answer."
        },
        {
            passage: "This passage is based on the popularity of websites. It compares figures published by 'Rankings Today', a publishing group which collects and analysis information on the popularity of products. 'Rankings Today' note that such figures are based on the annual income generated by such websites and the number of visitors to websites, also known as website traffic. As a result of these figures, we can see that the two most popular types of website are price comparison sites and social networking sites. It is estimated that over three billion pounds in advertising is generated by such websites every year. As a result of this information, companies are better informed as to where they should advertise to reach the largest possible audience.",
            question: "Based on the information in the passage alone, which of the following statements best completes the following sentence? 'Rankings Today' is a company which...",
            options: [
                "Collects and provides information on products",
                "Collects and provides information on social networking websites only",
                "Provides information on how to achieve the greatest profit",
                "Makes an annual total profit of three million pounds every year"
            ],
            correctAnswer: 0,
            explanation: "Step 1: Option a correctly identifies the nature of 'Rankings Today' as outlined by the passage. For this reason, option a is the right answer.\nStep 2: Option b correctly identifies that 'Rankings Today' collects and provides information on the popularity of social networking websites, however, it states that this is the only thing it does. Based on the information in the passage, this is incorrect. Option b is, therefore, a wrong answer.\nStep 3: Option c is incorrect. The passage states that the information provided by 'Rankings Today' is used as an indication of companies as to where they should advertise to reach the largest target audience. It does not provide information as to where companies should advertise to achieve the greatest profit. For this reason, option c is incorrect.\nStep 4: Option d s incorrect. The passage states that over 3 billion pounds is generated by the website via advertising. There is no reference to the total profit generated by the website. Option d is therefore incorrect."
        },
        {
            passage: "Statistics suggest that the city of London is the number one work destination in the United Kingdom. As one of the most popular cities in the world, London is renowned for its cosmopolitan atmosphere, fast-pace environment and non-stop social scene. As a result of this, London attracts many recent graduates and young-workers. In addition to this, London boasts strengths in areas such as law, commerce, arts and politics. It is the legal capital of England, the home of English politics and proudly welcomes a diverse population. The second most-popular work destination in the UK is Manchester, closely followed by Birmingham. Both of these cities boast continually rising rates of employment.",
            question: "Based on the information in the passage alone, which one of the following statements is false?",
            options: [
                "London is one of the most popular destinations in the UK for young workers",
                "London is the legal capital of England",
                "London boasts continually rising rates of employment",
                "Birmingham is the third most popular work destination in the UK"
            ],
            correctAnswer: 2,
            explanation: "Step 1: The question asks you to identify the false statement. The information contained in statement a can be seen in the passage. For this reason, the information in option a is true. Based on the nature of the question, option a is incorrect.\nStep 2: The question asks you to identify the false statement. The information contained in statement b can be seen in the passage. For this reason, the information in option b is true. Based on the nature of the question, option b is incorrect.\nStep 3: The question asks you to identify the false statement. At no point does the passage state that the rate of employment in London is increasing. Reference is made to the employment rates in Manchester and Birmingham. Option C therefore contains false information and is the right answer.\nStep 4: The question asks you to identify the false statement. The passage notes that Manchester is the second most popular working destination in the UK. It goes on to note that Manchester is closely followed by Birmingham. This implies Birmingham is the third most popular working destination. As such, statement d is true. Option d is therefore incorrect."
        },
        {
            passage: "'Apple Marie' is a company which makes ready-made desserts, such as fruit pies and cheesecakes. These deserts are sold in supermarkets all over the country, and are advertised on national television and in cooking magazines. Apple Marie's most popular product is a home-made cherry pie. Sales from this item make up thirty percent of the company's revenue. The directors of the company wish to increase the sales of their other products in the same way. They have recently hired an advertising consultant, who intends to increase the sales of the company by creating low fat versions of traditional favourites. These products will be advertised as 'Half-baked Apple Marie', as they will have under half the amount of fats and sugars as the traditional product. The Half-baked Apple Marie range will be on sale for a trial period of four weeks.",
            question: "Based on the information in the above passage only, which of the following statements is true? Select the closest answer.",
            options: [
                "Half-baked products have half the sugars of traditional products",
                "Half-baked products required baking at home",
                "Half-baked products have under half the amount of fat of traditional products",
                "Half-baked products will be on sale for a trial period, at half price"
            ],
            correctAnswer: 2,
            explanation: "Step 1: The passage states that these products will have under half of the amount of fat, rather than half the amount of fat than traditional products. For this reason, this statement is false. Based on the nature of the question, option a is incorrect. Step 2: The passage makes no reference to these products requiring further cooking. This statement is false. For this reason, option b is incorrect. Step 3: Option c correctly identifies that the 'Half-baked' products will have under half the amount of fats and sugars as the traditional products. This statement is therefore true. Based on the nature of the question, option c is the correct answer. Step 4: Option d correctly identifies that these products will be on sale for a trail period. However, the passage makes no reference to the price of the products during this period. For this reason, option d is false. Based on the nature of the question, option d is incorrect."
        },
        {
            passage: "Breville is a company which produces kitchen appliances, such as toasters and kettles. The company was formed in 1960 by the Breville family before being bought in 1980. Since this date, the company has doubled its work force and intends to re-locate to larger premises. In preparation for this, the company is currently searching for a local warehouse that may be converted to suit its needs. Such premises must have a loading dock, an office area and, most importantly, a large open space where the factory floor can be located. The Breville company is well known for its use of automated machines as part of its work force, and will continue with this practise in its new location.",
            question: "Based on the information in the above passage alone, which of the statements best completes the following sentence? The Breville company...",
            options: [
                "Has doubled its work force since 1960",
                "Intends to replace the majority of its work force with automated machines",
                "Produces electronic items, such as TVs and computers",
                "Has doubled its work force since 1980"
            ],
            correctAnswer: 3,
            explanation: "Step 1: Option a correctly identified that Breville has doubled its work force; however, it has done so since 1980, not 1960. For this reason, option a is less correct than option d.\nStep 2: Option b correctly identifies that Breville uses automated machines; however, the passage makes no reference to such machines replacing its work force. For this reason, option b is incorrect.\nStep 3: Option c incorrectly identifies the type of items produced by the company. The passage states that Breville creates kitchen appliances, such as toasters, not IT products. For this reason, option c is incorrect.\nStep 4: Option d is the correct answer. The passage states that Breville has doubled its work force since 1980. Option d identifies this and is the only correct statement that could complete the sentence."
        },
        {
            passage: "A common consideration for those applying for undergraduate study is which topic to read. This consideration is of paramount importance in light of the current cost of undergraduate study in the United Kingdom. With many graduates accumulating large levels of debt, and a reduction in the level of graduates gaining graduate level employment within the first five years of graduating, many prospective students are re-considering their subject choice. Statistics suggest that classic subjects, such as English literature and history, have suffered from a reduced number of applicants in recent years. Vocational subjects, such as law, medicine, and journalism, those which demonstrate a clear career path, remain popular. The total number of applicants has also been affected, with five per cent less A level students vying for a position than last year.",
            question: "Based on the information in the above passage alone, which of the statements below cannot be used to complete the following sentence? Since the rise in tuition fees...",
            options: [
                "Vocational subjects have seen an increase in applicants",
                "Classical subjects have suffered a reduction in applicants",
                "Many graduates are leaving university with manageable debt levels",
                "The total number of people applying for undergraduate study has fallen"
            ],
            correctAnswer: 2,
            explanation: "Step 1: This statement can be used to correctly finish the sentence. The question asks you to identify which statement cannot be used to complete the sentence. For this reason, option a is incorrect.\nStep 2: The passage states that, since the rise in tuition fees, classical subjects have noted a reduction in the number of applicants. For this reason, this statement can be used to correctly finish the sentence. The question asks you to identify which statement cannot be used to complete the sentence. For this reason, option b is incorrect.\nStep 3: The passage states that many graduates are leaving university with a level of debt. There is no reference to such debt being manageable. For this reason, statement c does not correctly complete the sentence. The question asks you to identify which statement does not correctly complete the sentence. For this reason, option c is correct.\nStep 4: The passage states that since the rise in tuition fees, the number of applicant for undergraduate study has fallen. For this reason, this statement can be used to correctly finish the sentence. The question asks you to identify which statement cannot be used to complete the sentence. For this reason, option d is incorrect."
        },
        {
            passage: "The Times University Guide is an annually published table placing the universities in the UK in order of their standard of education. Whilst the first place on the table is traditionally represented by either Oxford or Cambridge, there is much rivalry between other institutions to achieve a high-ranking place on the list. Amongst other factors, the guide takes into account the quantity and quality of research published by each university, the number of students who complete the course, the university's average entry requirement and the level of spending on facilities. Unlike many other university guides, the Times University Guide takes into account student satisfaction. This figure is collected from a survey given to current students at the institution, asking them to rate their university. Other league tables are published by The Guardian and the Complete University Guide.",
            question: "Based on the information in the above passage only, which one of the following statements is most true?",
            options: [
                "The Times University Guide relies only on information from student surveys",
                "The Guardian University Guide is based on average entry requirements",
                "The number of students completing the course is a weakness for institutions",
                "The first place position is usually Oxford or Cambridge"
            ],
            correctAnswer: 3,
            explanation: "Step 1: The passage outlines several factors which are taken into consideration by the Times University guide, including student satisfaction. However, as option a states, this is not the only factor taken into consideration. For this reason, option a is false. Based on the nature of the question, option a is incorrect.\nStep 2: The passage makes no reference to the factors relied upon by the Guardian University Guide. For this reason, option b is false. Based on the nature of the question, option b is incorrect.\nStep 3: The passage notes that the number of students who complete their course is a factor taken into consideration by the Times University Guide. However, the passage makes no reference to this being a weakness for many institutions. For this reason, option c is false. Based on the nature of the question, option c is incorrect. Step 4: Option d correctly identifies that the first place position on the Times University Guide is commonly held by either Oxford or Cambridge. For this reason, option d is the correct answer."
        },
        {
            passage: "This passage provides information on the annual profit and popularity of several top tourist attractions in the United Kingdom. The information is provided by visitengland.com, a website that promotes tourism within the UK. Statistics provided by visit England note that over 30 million international visitors travel to London every year, marking the city as the most popular international travel destination in the world. In 2011, London's most popular tourist attraction was the British Museum. The second most popular destination was Madame Tussauds. Outside of the capital, popular tourist destinations include Alton Towers and the Cadbury's Factory. Tourist attractions contribute over two billion pounds to the economy and can be seen as one of the most profitable sectors.",
            question: "Based on the information in the above passage only, which of the following statements is definitely false?",
            options: [
                "Visitengland.com provides information on the popularity of tourist destinations",
                "Visitengland.com states London is most popular for domestic holidays",
                "Visitengland.com states over 30 million visitors travel to London annually",
                "Visitengland.com names London the most popular international travel destination"
            ],
            correctAnswer: 1,
            explanation: "Step 1: Option a correctly identifies that visit England provides information on the popularity of tourist destinations. However, the question asks which statement is false. For this reason, option a is incorrect.\nStep 2: Option b states that London is the most popular destinations for domestic holidays. The passage does not state this. For this reason, the information in option b is false. Based on the nature of the question, option b is the correct answer. Step 3: Option c correctly identifies that over thirty million international visitors travel to London every year. However, the question asks which statement is false. For this reason, option c is incorrect.\nStep 4: Option d correctly identifies that information provided by visit England suggests that London is the most popular travel destination. However, the question asks which statement is false. For this reason, option d is incorrect."
        },
        {
            passage: "Mr Piggins Ltd is a small, home-run company that makes sausages. To date, Mr Piggins' products have been sold at local famers' markets and county fairs; however, the company is keen to break into supermarkets' and larger stores. This will enable the company to reach a wider audience, such as business professionals and those with families who may be currently unfamiliar with the company and its products. However, the company is keen to maintain its current family-run persona, and as such currently refuse to take up larger premises. In the view of many supermarket executives, this has limited their ability to sell the Mr Piggins product, due to the concern that the company will be unable to cope with the supply and demand of supermarket buyers.",
            question: "Select the statement which answers the following question. Why does the Mr Piggins company face difficulty breaking into the supermarket arena?",
            options: [
                "Mr Piggins may not cope with the supply and demand of supermarkets",
                "Mr Piggins is unpopular with consumers",
                "Mr Piggins products are unpopular with supermarket customers",
                "Mr Piggins products do not conform to health and safety standards"
            ],
            correctAnswer: 0,
            explanation: "Step 1: Option a correctly identifies that supermarket executives are concerned as whether the 'Mr Piggins' company can cope with the necessary supply and demand. Option a correctly answers the question and is the right answer. Step 2: The passage makes no reference to being unpopular with consumers. For this reason, option b does not correctly answer the question and is a wrong answer. Step 3: The passage makes no reference to this being popular or unpopular with super market consumers. For this reason, option c does not correctly answer the question and is a wrong answer.\nStep 4: The passage makes no reference to 'Mr Piggins' products conforming to health and safety standards. For this reason, option d does not correctly answer the question and is a wrong answer."
        },
        {
            passage: "This passage outlines the debate regarding the usefulness of social networking websites as a marketing tool. One side of this debate suggests that such websites allow companies to reach the widest target audience possible, and as such, are a powerful advertising tool. In addition to this social networking sites, such as Facebook, provide information such as age, occupation, relationship status, location and often personal 'likes'. In this way, such websites provide companies with a large amount of information, allowing companies to target their product at their ideal with greater ease and efficiency. On the other side of the debate, critics suggest that such websites encourage the publication of personal information on a never before seen level. In this way, companies are in a position to take advantage of previously private information.",
            question: "Based on the information in the passage alone, which one of the following statements is definitely not true?",
            options: [
                "Social networking sites provide a powerful advertising tool",
                "Social networking sites place users in a vulnerable position",
                "Social networking sites encourage the publication of private information",
                "Social networking is used as marketing tool"
            ],
            correctAnswer: 1,
            explanation: "Step 1: Option a correctly identifies that social networking sites provide a powerful advertising tool for companies. However, the question asks which statement is false. For this reason, option a is incorrect.\nStep 2: The passage does note state that this places users in a 'vulnerable position'. Option b, therefore, contains false information. The question asks which statement is false. For this reason, option b is correct\nStep 3: Option c correctly identifies that social networking sites encourage the publication of private information. However, the question asks which statement is false. For this reason, option c is incorrect.\nStep 4: The passage states that social networking is used as a marketing tool, and is therefore an incorrect answer."
        },
        {
            passage: "This passage provides information on the subsidising of renewable energy and its effect on the usage of fossil fuels. The issue of subsidising sources of renewable energy came to the forefront of global politics as record emissions levels continue to be reached despite caps on carbon emissions being agreed up by several global powers. However, renewable energy sources tend more expensive than their fossil-fuel counter parts. In this way, renewable energy cannot be seen as a realistic alternative to fossil-fuel until it is at a price universally achievable. On the opposite side of the spectrum, commentators note that the average temperature is expected to rise by four degrees by the end of the decade. In order to prevent this, they suggest carbon emissions must be reduced by seventy per cent by 2050. Such commentators advocate government subsidised renewable energy forms as a way to achieve this target.",
            question: "Based on the information in the passage, which one of the following statements is false?",
            options: [
                "To be more viable, renewable energy must be more financially available",
                "Government subsidy could reduce renewable energy cost",
                "The average temperature in the UK is set to rise by 4% by 2050",
                "Fossil-fuels are currently cheaper than forms of renewable energy"
            ],
            correctAnswer: 2,
            explanation: "Step 1: The question asks which statement is false. Option a correctly identifies information contained within the passage. For this reason, the statement is true. Based on the nature of the question, option a is incorrect.\nStep 2: The question asks which statement is false. Option b correctly identifies information contained within the passage. For this reason, the statement is true. Based on the nature of the question, option b is incorrect.\nStep 3: The question asks which statement is false. The passage notes that the average temperature is set to rise by four degrees by the end of the decade. This figure is not stated as being specific to the UK and does not provide 2050 as the date. For this reason, the information contained within option c is false. Option c is, therefore, the correct answer.\nStep 4: The question asks which statement is false. Option d correctly identifies information contained within the passage. For this reason, the statement is true. Based on the nature of the question, option d is incorrect."
        },
        {
            passage: "This passage aims to outline the debate regarding the benefit of protecting wilderness land, where mankind is unrepresented, versus using such lands for the good of mankind. Commentators suggest that man's use of such land, whether to build houses or reap the resources that can be extracted, diminishes the value of such spaces. Opposing this line of thought is the view that to corner off such spaces prevents human progress and limits the possibilities of expansion. In accordance with this line of thought, to limit the use of such resources increases their monetary value, placing those with limited resources at a disadvantage.",
            question: "Which one of the following statements cannot be learnt from the information in the above passage?",
            options: [
                "Wilderness land provides future generations with natural substances",
                "Preservation of wilderness land prevents human progress",
                "By preventing the use of limited resources, their value increases",
                "Expansion may be limited by the preservation of wilderness land"
            ],
            correctAnswer: 0,
            explanation: "Step 1: Option a states that future generations may be deprived of limited resources. The passage makes no reference to future generations and the effect that using such land may have on them. For this reason, option a contains information than cannot be gained from the passage. Option a is the correct answer to the question. Step 2: Option b contains information that can be gained from reading the passage. The question is looking for the statement that is not contained within the passage. For this reason, option b is incorrect.\nStep 3: Option c contains information that can be gained from reading the passage. The question is looking for the statement that is not contained within the passage. For this reason, option c is incorrect.\nStep 4: Option d contains information that can be gained from reading the passage. The question is looking for the statement that is not contained within the passage. For this reason, option d is incorrect."
        },
        {
            passage: "Eating organic foods will not make you healthier, say researchers at Stanford University. A meta-analysis of over two hundred studies assessing the health gains of organic over non-organic foods has failed to identify any health benefits of eating organic foods over non-organic foods, even though organic foods were thirty percent less likely to contain pesticides. Organic and non-organic fruit and vegetables were shown to have similar amounts of vitamins and minerals; milk was shown to have the same amount of fat and protein. Critics however say that more research is required, and until then it is inconclusive as to the effect of organic foods. Similarly, it is stated that because none of the studies ran for longer than 2 years.",
            question: "which of the following statements cannot be learnt from the passage?",
            options: [
                "Over two hundred studies where assessed",
                "Organic and non-organic fruit has the same amount of vitamins",
                "Organic and non-organic meat had the a same amount of protein",
                "Organic and non-organic milk had the same amount of fat"
            ],
            correctAnswer: 2,
            explanation: "Step 1: The passage states that over 200 studies were assessed in the meta analysis, therefore this statement can be learnt from the passage.\nStep 2: The passage states that organic and non-organic fruit does have the same amount of vitamins, and therefore can be learnt from the passage.\nStep 3: The passage does not state that organic and non-organic meat has the same amount of protein, and is therefore the correct answer.\nStep 4: The passage does state that organic and non-organic milk has the same amount of fat, and therefore can be learnt from the passage."
        },
        {
            passage: "This passage examines the view that the punishment of criminals is the underlying aim of the criminal justice system, rather than rehabilitation. When looking at the criminal justice system in the United Kingdom, statistics suggest that those convicted of crimes are more likely to re-offend if given a prison sentence than any other sentence, such as community orders or mandatory alcohol or drug dependency support. In addition, those with dependency problems are more likely to further develop their dependency in prison. However, many sectors of society continue to see non-custodial sentences as the 'easy way out' for offender. In this way, the underlying aim of the criminal justice system continues to be attempting to punish rather than rehabilitate.",
            question: "Based on the above passage, which of the following statements is true?",
            options: [
                "Prisoners are 3x more likely to offend than those serving community orders",
                "Illegal substances are easier to acquire in prison",
                "Prisoners are more likely to offend than those serving community orders",
                "Community orders continue to be 'an easy way out' for offenders"
            ],
            correctAnswer: 2,
            explanation: "Step 1: Option a correctly identifies that those who serve a prison sentence are said to be more likely to re-offend. However, the statistic that this is three times more likely to happen is not mentioned by the passage. For this reason, option a is incorrect.\nStep 2: Option b correctly identifies that those with a dependency on substances such as drugs, are more likely to further develop this dependency whilst in prison. However, the passage makes no mention as to the ease with which such substances can be acquired or the reason why this dependency is likely to be developed. For this reason, option b is incorrect.\nStep 3: Option c correctly identifies only information that is stated in the passage. For this reason, option c is the correct answer.\nStep 4: Option d notes that community orders are an 'easy way out'. The way this statement is written implies that this is either the writer's opinion or that it is fact. However, the passage states that 'many sectors of society' see community orders as an easy way out, not that they actually are. For this reason, option d is incorrect."
        },
        {
            passage: "Friskies is an animal rescue centre based in the East End of London. It operates on a donations basis, gaining financial support from the local community. However, due to the current economic climate, Friskies has noticed a reduction in the amount of funds it receives. For this reason, they have decided to host a fund-raising event, inviting local families to visit the centre. On this fund-raising day, there will be food for sale, games and events such as face painting and races. Each event has a £2 entry fee. In this way, the centre hopes to make enough money to remain open and to raise awareness of the type of work they do within the local community.",
            question: "Based on the information in the above passage alone, which one of the following statements is most correct?",
            options: [
                "Friskies, an animal rescue centre, operates throughout the UK",
                "Friskies open day aims to raise awareness of animal cruelty",
                "Friskies will be selling food, such as cakes, on the open day",
                "Friskies are charging a fee to take part in their charity events"
            ],
            correctAnswer: 3,
            explanation: "Step 1: The passage states that 'Friskies' is an animal centre based in the east end of London. At no point does the passage state that the animal centre operates throughout the UK. For this reason, option a is incorrect.\nStep 2: The passage states that the animal centre wants to increase awareness of the type of work they do. At no point does the passage state that the centre wants to raise awareness of animal cruelty; this is an assumption made based on the information provided. For this reason, option b is incorrect.\nStep 3: The passage states that the centre will be selling food at the open day, however, it does not specify that the type of food on offer. This assumption has been read into the passage. For this reason, option c is incorrect.\nStep 4: Option d is the correct answer. It correctly identifies that there is a fee for taking part in the events at the open day."
        },
        {
            passage: "Advertisements in the United Kingdom must conform to the standards set by the Advertisement Standards Agency (ASA). This agency ensures that products are not falsely promoted and attaches a financial penalty for false statements. An example of this is 'Post-Production Enhancement' (PPE). PPE is a process by which images are digitally corrected after they have been captured. PPE is commonly used in skin-care adverts; providing a smoother, younger or healthier appearance than the product actually delivers. Many companies find loop holes in the ASA regulations regarding PPE by stating such a process has been used in small print at the bottom of the image. Such promotions escape the regulations set down by the Advertisement Standards Agency but can still be misleading.",
            question: "Based on the information in the above passage alone, which one answer correctly completes the following sentence? The Advertisement Standards Agency (ASA)... ",
            options: [
                "Provides financial penalties to companies breaching advertisement regulations",
                "Supports the use of PPE to promote skin care products",
                "Supports the use of digitally altered images to promote products",
                "Wants to achieve younger, healthier looking skin for people in the UK"
            ],
            correctAnswer: 0,
            explanation: "Step 1: Option a correctly identifies that the ASA attaches financial penalties to breaches of the advertisement regulation within the UK. For this reason, option a is the correct answer.\nStep 2: Option b incorrectly states that the ASA supports the use of post-production enhancement. The passage states that PPE is an example of a breach of advertisement regulations. For this reason, option b is incorrect.\nStep 3: Option c incorrectly states that ASA supports the use of post-production enhancement, (digitally altered images). The passage states that PPE is an example of a breach of advertisement regulations. For this reason, option c is incorrect. Step 4: The passage makes no reference to the ASA, Advertisement Standards Agency, promoting younger, healthier looking skin. Option d is incorrect and suggests a closer reading of the passage in necessary."
        },
        {
            passage: "Kung-Fu is a popular form of martial arts, first developed in China by Shao Lin monks. Kung-Fu aims to strengthen the body and improve co-ordination. Originally developed to promote the concentration of monks whilst meditating, Kung-Fu exercises the mind as well as the body. In this way, it can be seen as a spiritual activity, as well as physical training. Today, there are several types of Kung-Fu; including Wing Chun, the only form believed to have been created by a woman. Also known as Wushu, Kung-Fu embodies the idea of 'Qi, or 'Chi'. This is described as the inner life force, which is said to provide focus during Kung-Fu.",
            question: "Based on the information in the above passage alone, which of the following answers is not definitely true?",
            options: [
                "Another word for Kung-Fu is Wushu",
                "Kung-Fu was made popular in the Western world by Hollywood",
                "Wing Chun may be the only type of Kung-Fu created by a woman",
                "Kung-Fu exercises the mind as well as providing physical training"
            ],
            correctAnswer: 1,
            explanation: "Step 1: Option a correctly identifies that another word for 'Kung-Fu' is 'Wushu'. However, the question asks which statement is incorrect. For this reason, option a is the wrong answer.\nStep 2: The passage makes no reference to Hollywood, or how Kung-Fu became popular in the West. However, the question asks which statement is incorrect. For this reason, option b is the right answer.\nStep 3: Option c correctly identifies that 'Wing Chun' is the only type of Kung-Fu believed to have been created by a woman. However, the question asks which statement is incorrect. For this reason, option c is the wrong answer. Step 4: Option d correctly identifies that Kung-Fu aims to exercise the mind as well as the body. However, the question asks which statement is incorrect. For this reason, option d is the wrong answer."
        },
        {
            passage: "Beijing is the capital city of China. Formerly known as Peking, Beijing is one of the most populated cities in the world, with an estimated population of 19,612,368 people. Beijing's Capital International Airport is the second busiest in the world. In addition, the city is home to forty-one of the Fortune Global 500 companies and over 100 of the largest companies in China, generating an average of 128.6 billion dollars a year. As one of the fastest developing super powers in the world, it is increasingly important for businesses to understand the cultural background existing in the Chinese business world. This allows for companies to promote their working relationship and increase profitability.",
            question: "Based on the information in the above passage alone, which one of the following statements is true?",
            options: [
                "Beijing is home to the second largest airport in the world",
                "Beijing is home to an estimated 128.6 million people",
                "Beijing is one of the most populated cities in the world",
                "Beijing is the most populated city in the world"
            ],
            correctAnswer: 2,
            explanation: "Step 1: The passage states that Beijing has the second busiest airport in the world. The passage makes no comment on the size of the airport; this has been read into the passage. For this reason, option a is incorrect.\nStep 2: The passage states that Beijing has an estimated population of 19,612,368 people. The figure of 128.6 refers to the average amount of dollars generated by Chinese companies in Beijing. For this reason, option b is incorrect.\nStep 3: Option c correctly identifies that Beijing is one of the most populated cities in the world. For this reason, option c is the correct answer.\nStep 4: The passage states that Beijing is one of the most populated cities in the world, not that it is the most populated city. For this reason, option d is incorrect."
        },
        {
            passage: "A common issue faced by recent graduates is one of finances. With the problem of increasing living costs compounded by a lack of job opportunities in today's economic climate, graduates must learn to be more prudent with their finances. One popular way to do this is by buying 'budget brand' items at the supermarket. Evidence to support this growing trend can be seen in the sales figures of leading UK supermarkets, which demonstrate that the sale of own-brand items has more than doubled since the beginning of the recession in 2008. In addition to this, many graduates are forced to take part-time jobs, live with friends or family and acknowledge the fact it may take longer than hoped to achieve their career goals.",
            question: "What one of the following answers is not mentioned in the passage? Due to the current economic climate, graduates are...?",
            options: [
                "More likely to buy 'budget brand' items in the supermarket",
                "Less likely to be living alone",
                "More likely to have part time jobs",
                "Less likely to take gap-years"
            ],
            correctAnswer: 3,
            explanation: "Step 1: The question asks which statement is not mentioned in the passage. The passage does mention that graduates are more likely to buy 'budget brand' items in the supermarket as a way to be more prudent with their finances. Option a is therefore incorrect.\nStep 2: The question asks which statement is not mentioned in the passage. The passage states that graduates are more likely to be living with friends or family. This implies that they will be less likely to be living alone. Option b is therefore included in the passage and is the wrong answer.\nStep 3: The question asks which statement is not mentioned in the passage. The passage states that graduates are more likely to have part-time jobs due to the current economic climate. Option c is therefore the wrong answer. Step 4: Option d is the correct answer. The passage makes no reference to gap years."
        }
    ]
};

// Initialize the test
window.addEventListener('DOMContentLoaded', function() {
    window.testCore = new TestCore(testData);
    window.testCore.displayQuestion();
    window.testCore.timerInterval = setInterval(window.testCore.updateTimer, 1000);
}); 