const testConfig = {
    questions: [
        {
            type: 'most-least',
            passage: "You are a trainee manager on a two year programme working for Superluxe Hotels, a national chain of 4 and 5 star hotels. The programme ensures that trainees gain experience in all areas of hotel and hospitality management through a rotational scheme of 4 month placements. You are currently undertaking your 'Guest Services' placement and you are based at the Alpston Grand, a five-star property and one of Superluxe's flagship hotels. You are working as second-in-command in the Grand Hotel Guest Services team; you report directly to the Guest Relations Manager. The primary job of the Guest Services team is to ensure that customers of the hotel receive an efficient and friendly welcome and departure, while ensuring the reception and front of house departments operate in an organised manner. The team must ensure a professional, friendly and courteous service is provided to all guests and that all complaints the hotel receives are handled properly. The Guest Services staff must also implement Superluxe occupancy policy which is to try to maximise occupancy on a daily basis.",
            question: "It is 7.30pm. You are on duty at the concierge desk when a guest calls down to say that they have just checked in and are extremely unhappy with the cleanliness of their room. They say that the sink has hair in it, the tea cups are smeared and the curtains are dusty. The guest is only at the Grand for one night and has a business meeting in Alpston first thing in the morning. Review the following responses and indicate which one you would be most likely to make and which one you would be least likely to make.",
            options: [
                "Apologise to the customer and say that you will ensure that the room is cleaned thoroughly within the next hour.",
                "Apologise and offer the customer a different room immediately; if necessary an upgraded room if no others are available in his original price range.",
                "Apologise and offer the customer a discount on his room rate.",
                "Apologise and arrange a complimentary room service meal and bottle of wine to be sent to the room."
            ],
            correctAnswer: {
                most: 1,
                least: 3
            },
            explanation: "The most effective response is B - offering a different room immediately. This solves the problem quickly without making the guest wait, which is important given they have an early meeting. The least effective response is D - offering food and wine doesn't address the cleanliness issue and assumes the guest wants these items."
        },
        {
            type: 'ranking',
            passage: "You are a sales representative for Handy Goods, a company that supplies office supplies to businesses. You have noticed that your sales of the toys & games product line have been lower than expected this month. Your manager has asked you to develop a strategy to improve sales in this area. The toys & games line is an important part of Handy Goods' product range as it has high profit margins and helps to differentiate the company from its competitors who focus mainly on traditional office supplies.",
            question: "Review the following responses and rank them from 1 (most effective) to 4 (least effective) in terms of how you would address the situation of low sales in the toys & games product line.",
            options: [
                "Decide that for every visit you do from now on you won't leave the shop until the customer agrees to at least look at the product line of toys & games.",
                "Switch your appointments around this month so that over the next two weeks you will visit all the shops that are located near schools and nurseries. You will have the best chance of selling the pocket toys & games product line to these shops.",
                "Ensure that your product samples for toys & games are bang up-to-date and that you know all about each product and its target market. Aim to talk about toys & games at every sales visit and ask detailed questions to the customers about their requirements in this area.",
                "Ask all your customers about their sales of toys & games and talk in more detail to the ones who have a good turnover of these types of products about Handy Goods' range."
            ],
            correctAnswer: [2, 3, 0, 1],
            explanation: "The most effective response is C - being well-prepared and knowledgeable about the products while maintaining a professional approach. The second most effective is D - gathering information about customer needs. The third most effective is A - being proactive but not overly aggressive. The least effective is B - limiting visits to specific locations may miss other potential customers."
        },
        {
            type: 'most-least',
            passage: "You are a customer service advisor at Greenwinds, a company that provides eco-friendly energy solutions to domestic customers. You have just received a complaint from a customer who says that when they signed up for Greenwinds' service, the salesperson told them there would be no standing charge. However, they have now received their first bill which includes a standing charge of £10 per month. The customer is very upset about this and feels they were misled during the sales process.",
            question: "Review the following responses and indicate which one you would be most likely to make and which one you would be least likely to make when handling this customer complaint.",
            options: [
                "Apologise for the confusion but state that the Greenwinds charging policy is clearly written on the joining contract and on the website.",
                "Apologise for the confusion and ask the customer for more detail about the sales conversation, including the salesperson's name or description. Say that you will ask your manager to investigate the way that the contract was sold and to look at whether any miscommunication had happened on the doorstep. Say you will get back to the customer on a daily basis to keep them updated of progress.",
                "Apologise for the confusion and offer the customer a goodwill waiver of one month's standing charge.",
                "Apologise for the confusion and say that you are sorry to hear that they are feeling upset and hope that Greenwinds excellent service and eco-friendly product will make up for the initial misunderstanding in the long-run."
            ],
            correctAnswer: {
                most: 1,
                least: 3
            },
            explanation: "The most effective response is B - taking the complaint seriously, investigating the sales process, and maintaining regular communication. The least effective response is D - being dismissive of their concerns and not addressing the actual issue of the standing charge."
        },
        {
            type: 'ranking',
            passage: "You are a team leader in a customer contact centre for a large telecommunications company. Your team has been informed that the company is introducing new customer satisfaction measures and mystery shopper criteria next week. The team meeting to discuss this was cut short due to an urgent system issue, and you feel that your team members need more guidance on how to meet these new standards.",
            question: "Review the following responses and rank them from 1 (most effective) to 4 (least effective) in terms of how you would prepare your team for the new customer satisfaction measures.",
            options: [
                "Make an extra special effort to be warm, friendly and helpful to customers throughout the week.",
                "Look at the company intranet 'service quality' site which outlines the new measurement methods in detail. Analyse the customer satisfaction questions and the mystery shopper criteria and change your behaviour, if necessary, to ensure that you are fulfilling these requirements.",
                "Wait for a further briefing from your Team Leader. They usually send a note round following the team meeting summarising what was said. You are hopeful that they will be more specific in this note as to what is required of you in order to improve the service quality ratings.",
                "Ask for a quick chat with your Team Leader sometime today and find out from them what they feel will be the best way for you to contribute to the service quality targets. Make sure you are aware of the details of the new customer satisfaction measure and the Mystery Shopper criteria before you talk to them."
            ],
            correctAnswer: [3, 1, 0, 2],
            explanation: "The most effective response is D - proactively seeking guidance while being prepared with knowledge of the new measures. The second most effective is B - taking initiative to understand the new requirements. The third most effective is A - showing commitment to customer service. The least effective is C - passively waiting for more information instead of taking initiative."
        },
        {
            type: 'most-least',
            passage: "You are a hotel manager at the Alpston Grand Hotel. A guest has just checked in and is complaining that their room is not clean enough for their standards. They have an important business meeting early tomorrow morning and need to get some rest.",
            question: "Review the following responses and indicate which one you would be most likely to make and which one you would be least likely to make.",
            options: [
                "Apologise to the customer and say that you will ensure that the room is cleaned thoroughly within the next hour.",
                "Apologise and offer the customer a different room immediately; if necessary an upgraded room if no others are available in his original price range.",
                "Apologise and offer the customer a discount on his room rate.",
                "Apologise and arrange a complimentary room service meal and bottle of wine to be sent to the room."
            ],
            correctAnswer: {
                most: 1,
                least: 3
            },
            explanation: "The most effective response is B - offering a different room immediately. This solves the problem quickly without making the guest wait, which is important given they have an early meeting. The least effective response is D - offering food and wine doesn't address the cleanliness issue and assumes the guest wants these items."
        },
        {
            type: 'ranking',
            passage: "You are a sales representative for Handy Goods, a company that supplies office supplies to businesses. You have noticed that your sales of the toys & games product line have been lower than expected this month.",
            question: "Rank the following responses from 1 (most effective) to 4 (least effective) in terms of how you would address this situation.",
            options: [
                "Decide that for every visit you do from now on you won't leave the shop until the customer agrees to at least look at the product line of toys & games.",
                "Switch your appointments around this month so that over the next two weeks you will visit all the shops that are located near schools and nurseries. You will have the best chance of selling the pocket toys & games product line to these shops.",
                "Ensure that your product samples for toys & games are bang up-to-date and that you know all about each product and its target market. Aim to talk about toys & games at every sales visit and ask detailed questions to the customers about their requirements in this area.",
                "Ask all your customers about their sales of toys & games and talk in more detail to the ones who have a good turnover of these types of products about Handy Goods' range."
            ],
            correctAnswer: [2, 3, 0, 1],
            explanation: "The most effective response is C - being well-prepared and knowledgeable about the products while maintaining a professional approach. The second most effective is D - gathering information about customer needs. The third most effective is A - being proactive but not overly aggressive. The least effective is B - limiting visits to specific locations may miss other potential customers."
        },
        {
            type: 'most-least',
            passage: "You are a trainee manager on a two year programme working for Superluxe Hotels, a national chain of 4 and 5 star hotels. The programme ensures that trainees gain experience in all areas of hotel and hospitality management through a rotational scheme of 4 month placements. You are currently undertaking your 'Guest Services' placement and you are based at the Alpston Grand, a five-star property and one of Superluxe's flagship hotels. You are working as second-in-command in the Grand Hotel Guest Services team; you report directly to the Guest Relations Manager. The primary job of the Guest Services team is to ensure that customers of the hotel receive an efficient and friendly welcome and departure, while ensuring the reception and front of house departments operate in an organised manner. The team must ensure a professional, friendly and courteous service is provided to all guests and that all complaints the hotel receives are handled properly. The Guest Services staff must also implement Superluxe occupancy policy which is to try to maximise occupancy on a daily basis.",
            question: "It is 8pm on a Thursday evening in February. Fifty percent of the hotel's 300 rooms are currently occupied and a customer without a previous reservation has just arrived at the reception desk. The customer has enquired about the price of a standard double room. You have informed her that the room rate is £120 per night, including breakfast. The customer then asks whether you can let her have the room and breakfast for £80. Review the following responses and indicate which one you would be most likely to make and which one you would be least likely to make.",
            options: [
                "Give her information on the town's inexpensive B&B accommodation and how to find it.",
                "Say that you can offer her the room at £100 for the night and breakfast.",
                "Say that the room rate is £120 and there are no discounts available.",
                "Say that if she returns at 9pm you will probably be able to give her a discount on the standard room rate then."
            ],
            correctAnswer: {
                most: 1,
                least: 2
            },
            explanation: "The most effective response is B - offering £100 is a reasonable compromise that follows the hotel's policy of maximizing occupancy while still maintaining profitability. The least effective response is C - refusing any discount goes against the hotel's policy of maximizing occupancy when rooms are available."
        },
        {
            type: 'most-least',
            passage: "You are a trainee manager on a two year programme working for Superluxe Hotels, a national chain of 4 and 5 star hotels. The programme ensures that trainees gain experience in all areas of hotel and hospitality management through a rotational scheme of 4 month placements. You are currently undertaking your 'Guest Services' placement and you are based at the Alpston Grand, a five-star property and one of Superluxe's flagship hotels. You are working as second-in-command in the Grand Hotel Guest Services team; you report directly to the Guest Relations Manager. The primary job of the Guest Services team is to ensure that customers of the hotel receive an efficient and friendly welcome and departure, while ensuring the reception and front of house departments operate in an organised manner. The team must ensure a professional, friendly and courteous service is provided to all guests and that all complaints the hotel receives are handled properly. The Guest Services staff must also implement Superluxe occupancy policy which is to try to maximise occupancy on a daily basis.",
            question: "The hotel is hosting a large banquet tomorrow night on behalf of a corporate client. The guest list was due to be 150 people, however, just now, you have received a call from the client contact and they have informed you that they had underestimated the numbers and that they need to increase the guestlist to 200 people. It is 10am. Review the following responses and indicate which one you would be most likely to make and which one you would be least likely to make.",
            options: [
                "Tell the client what the increased cost will be for the extra 50 guests based on the amount quoted per person for the original 150.",
                "Thank the client for informing you and say you will call back to confirm the booking once you have spoken to the Catering team.",
                "Thank the client for letting you know about the increase in numbers and then inform the Catering team that there will be 50 extra guests.",
                "Tell the client that the hotel will do everything it can to accommodate the extra numbers and you hope to be able to call them back and confirm the booking shortly."
            ],
            correctAnswer: {
                most: 3,
                least: 0
            },
            explanation: "The most effective response is D - showing willingness to help while being clear that confirmation is needed. The least effective response is A - discussing costs before confirming capacity is premature and could create false expectations."
        },
        {
            type: 'most-least',
            passage: "You are a trainee manager on a two year programme working for Superluxe Hotels, a national chain of 4 and 5 star hotels. The programme ensures that trainees gain experience in all areas of hotel and hospitality management through a rotational scheme of 4 month placements. You are currently undertaking your 'Guest Services' placement and you are based at the Alpston Grand, a five-star property and one of Superluxe's flagship hotels. You are working as second-in-command in the Grand Hotel Guest Services team; you report directly to the Guest Relations Manager. The primary job of the Guest Services team is to ensure that customers of the hotel receive an efficient and friendly welcome and departure, while ensuring the reception and front of house departments operate in an organised manner. The team must ensure a professional, friendly and courteous service is provided to all guests and that all complaints the hotel receives are handled properly. The Guest Services staff must also implement Superluxe occupancy policy which is to try to maximise occupancy on a daily basis.",
            question: "It is Saturday morning and you have just been informed that a large group booking is going to be transferred from the Saldringham Regent Hotel (also part of the Superluxe chain) to your hotel, as the Regent is overbooked. The group requires 110 rooms and the main conference suite to be made available from 6pm this evening. You have room availability tonight but not all of the rooms have been prepared as you weren't expecting a high occupancy level. In order for all the rooms to be prepared the morning shift housekeeping staff will need to work an additional 2 hours each for which they will be paid overtime. Their shift normally finishes at 2pm. Review the following responses and indicate which one you would be most likely to make and which one you would be least likely to make.",
            options: [
                "Call the housekeeping staff together as soon as is convenient and then explain the situation to them saying that the group booking is great for the Alpston Grand as occupancy has been low recently and that they will be helping to keep the hotel running successfully.",
                "Ask the Senior Housekeeper to let the staff know that they will be required to work an extra 2 hours today.",
                "Call the housekeeping staff together and say you are sorry they will be needed for the extra two hours but hopefully the overtime pay will come in handy.",
                "Talk to the housekeeping staff and say that unfortunately they will have to work an extra 2 hours and you are very sorry."
            ],
            correctAnswer: {
                most: 0,
                least: 1
            },
            explanation: "The most effective response is A - explaining the business benefits and showing appreciation for their help. The least effective response is B - delegating this important communication to someone else shows poor leadership."
        },
        {
            type: 'ranking',
            passage: "You are a Field Sales Representative for Handy Goods Ltd. Your company supplies independent corner shops and convenience stores with non-food 'home essential' products such as sewing thread, scissors, paperclips, nail clippers, bootlaces, drawing pins, liquid paper etc. Your brand prides itself on providing all the items that the stores' customers might find it handy to be able to pick up along with their milk, bread and newspapers rather than having to make a special trip to the town centre shops. You have a range of 200 products and each is priced to allow your customers to be competitive with the High Street retailers. You are able to give discounts for bulk purchases. Your sales area is Saldringham City, its suburbs and outlying villages. You have 93 shops on your patch and you are tasked with visiting each one at least once each month. You spend an average of 20 to 30 minutes in a shop when you visit your customers.",
            question: "You are visiting The Pop-in Shop convenience store on Bentley Road, Saldringham this morning. You have a friendly relationship with the proprietor, Ellen Gurty. Ellen has a regular order for a large number of your stationery lines such as pens, pencils, notepads, paper, wall tack and clear tape. However Ellen is grumbling today as trade hasn't been brilliant for her of late and one of your rival suppliers, MoreThanPens Direct, has approached her with a great introductory deal on stationery. They are a specialist office goods supplier and are usually more expensive than Handy Goods, although the quality of their products is also slightly superior. The deal that MoreThanPens have offered Ellen is a bargain, and she has told you today that she has been sorely tempted. You are authorised to give a 15% one-off discount to customers who say they might switch suppliers. You aren't sure how serious Ellen is about swapping as you know she enjoys your visits and the MoreThanPens representative will not hang around for a cup of tea like you do as his patch is much larger. Review the following responses and rank them from 1 (most effective) to 4 (least effective).",
            options: [
                "Say to Ellen that you can understand that she is tempted by the offer from MoreThanPens and empathise with her recent poor sales. Talk to her about the likelihood that when the introductory offer runs out the prices could go higher than Handy Goods. Say you'd really like to talk to her this morning about what Handy Goods can do to keep her as a customer.",
                "Ignore Ellen's grumblings and have a nice cup of tea and a chat with her about her grandchildren; that always seems to cheer her up.",
                "Have a chat with Ellen and ask her what her sales problems have been caused by. Say you can help her out with a 10% discount on this order if that will be helpful.",
                "Offer her a 15% discount on her latest order from Handy Goods. This will undercut MoreThanPens quite neatly."
            ],
            correctAnswer: [0, 2, 3, 1],
            explanation: "The most effective response is A - acknowledging her concerns, explaining the long-term implications of the competitor's offer, and showing willingness to discuss solutions. The second most effective is C - offering a reasonable discount while understanding her situation. The third most effective is D - matching the competitor's offer. The least effective is B - ignoring the business issue and focusing only on social aspects."
        },
        {
            type: 'ranking',
            passage: "You are a Field Sales Representative for Handy Goods Ltd. Your company supplies independent corner shops and convenience stores with non-food 'home essential' products such as sewing thread, scissors, paperclips, nail clippers, bootlaces, drawing pins, liquid paper etc. Your brand prides itself on providing all the items that the stores' customers might find it handy to be able to pick up along with their milk, bread and newspapers rather than having to make a special trip to the town centre shops. You have a range of 200 products and each is priced to allow your customers to be competitive with the High Street retailers. You are able to give discounts for bulk purchases. Your sales area is Saldringham City, its suburbs and outlying villages. You have 93 shops on your patch and you are tasked with visiting each one at least once each month. You spend an average of 20 to 30 minutes in a shop when you visit your customers.",
            question: "It is a Monday morning in May. You have five shop visits booked in today all for shops in the central area of Saldringham City. You were then planning on returning to the office for the later part of the afternoon in order to catch up on a backlog of paperwork. Your manager has just called you to say that your colleague Wendy is off sick today. Wendy had three appointments today in Alpston which is a town about 40 minutes' drive from Saldringham. Your manager is calling to ask whether you can cover any of the appointments as you are the closest sales rep to Wendy's patch. Review the following responses and rank them from 1 (most effective) to 4 (least effective).",
            options: [
                "Apologise to your manager and explain that you would love to help but that you have a full schedule today and therefore you are unable to do so. Your paperwork needs to take precedence here otherwise you risk falling behind.",
                "Say that you are busy today but may be able to take one of the visits on Wendy's behalf, if other colleagues could cover the other two.",
                "Agree to take all three appointments. You can attend all of your 5 visits this morning and there will still be time to drive to Alpston and visit the three customers there.",
                "Agree to take all three appointments and call two of your customers to see if you can re-schedule their visits for tomorrow."
            ],
            correctAnswer: [3, 1, 2, 0],
            explanation: "The most effective response is D - taking all appointments while managing existing commitments. The second most effective is B - offering partial help. The third most effective is C - taking on too much without considering existing commitments. The least effective is A - prioritizing paperwork over customer visits and team support."
        },
        {
            type: 'ranking',
            passage: "You are a Field Sales Representative for Handy Goods Ltd. Your company supplies independent corner shops and convenience stores with non-food 'home essential' products such as sewing thread, scissors, paperclips, nail clippers, bootlaces, drawing pins, liquid paper etc. Your brand prides itself on providing all the items that the stores' customers might find it handy to be able to pick up along with their milk, bread and newspapers rather than having to make a special trip to the town centre shops. You have a range of 200 products and each is priced to allow your customers to be competitive with the High Street retailers. You are able to give discounts for bulk purchases. Your sales area is Saldringham City, its suburbs and outlying villages. You have 93 shops on your patch and you are tasked with visiting each one at least once each month. You spend an average of 20 to 30 minutes in a shop when you visit your customers.",
            question: "You have just come out of a Monday morning team briefing. You have been informed that sales of children's pocket toys and games have been very slow recently and that Handy Goods wish to ensure that sales targets for this product line are achieved, and preferably exceeded. As such, each Field Sales Representative will be reviewed fortnightly on their toys & games sales. The representative who achieves the highest sales for this line each fortnight will receive a cash bonus and the representative with the lowest sales will be shadowed by the Field Sales trainer and given intensive coaching. This representative will also be required to complete a detailed report on all of their visits over that fortnight in order for selling opportunities to be analysed by the trainer to inform the coaching sessions. You are keen to be the highest selling representative but at the very least you are desperate to avoid being the lowest selling as the extra work sounds quite onerous and dispiriting. Review the following responses and rank them from 1 (most effective) to 4 (least effective).",
            options: [
                "Decide that for every visit you do from now on you won't leave the shop until the customer agrees to at least look at the product line of toys & games.",
                "Switch your appointments around this month so that over the next two weeks you will visit all the shops that are located near schools and nurseries. You will have the best chance of selling the pocket toys & games product line to these shops.",
                "Ensure that your product samples for toys & games are bang up-to-date and that you know all about each product and its target market. Aim to talk about toys & games at every sales visit and ask detailed questions to the customers about their requirements in this area.",
                "Ask all your customers about their sales of toys & games and talk in more detail to the ones who have a good turnover of these types of products about Handy Goods' range."
            ],
            correctAnswer: [2, 3, 0, 1],
            explanation: "The most effective response is C - being well-prepared and knowledgeable about the products while maintaining a professional approach. The second most effective is D - gathering information about customer needs. The third most effective is A - being proactive but not overly aggressive. The least effective is B - limiting visits to specific locations may miss other potential customers."
        },
        {
            type: 'ranking',
            passage: "You are a Field Sales Representative for Handy Goods Ltd. Your company supplies independent corner shops and convenience stores with non-food 'home essential' products such as sewing thread, scissors, paperclips, nail clippers, bootlaces, drawing pins, liquid paper etc. Your brand prides itself on providing all the items that the stores' customers might find it handy to be able to pick up along with their milk, bread and newspapers rather than having to make a special trip to the town centre shops. You have a range of 200 products and each is priced to allow your customers to be competitive with the High Street retailers. You are able to give discounts for bulk purchases. Your sales area is Saldringham City, its suburbs and outlying villages. You have 93 shops on your patch and you are tasked with visiting each one at least once each month. You spend an average of 20 to 30 minutes in a shop when you visit your customers.",
            question: "You are conducting a regular visit with one of your customers in Saldringham's outlying villages. The Village Store in Brancombe Brook is the only shop in the area and incorporates the Post Office, a delicatessen, an upmarket off-licence and general store. Ruth Hardlow is the manager of the shop which is owned and run as a cooperative by the villagers. Shortly after you arrived today Miss Hardlow brought up an issue with regard to the quality of some of the products that Handy Goods supply to the store. Miss Hardlow said that in recent weeks she has had 7 customers return products from the Handy Goods range, according to her, due to 'shoddy quality'. Miss Hardlow particularly mentioned the sewing items, needles, thread and scissors as well as some items of stationery. She reminded you that customers here rely on the shop and need to know that the things they buy here are as good quality as those in town. Miss Hardlow appears upset and angry about the issue and the last thing she has said to you is that she is seriously considering looking at other suppliers for her non-food items. Review the following responses and rank them from 1 (most effective) to 4 (least effective).",
            options: [
                "Take a note of the products which have been found faulty by The Village Store customers and say that you will report the matter to your Product Line team when you get back to the office.",
                "Give Miss Hardlow some 'free gift' items in her next order as an apology. Say that you are sure these products were just from a 'bad batch' that slipped past quality control and you are sure it won't happen again. After all her customers are bound to come back to the Store even if there are problems, as it's the only shop in the village.",
                "Apologise to Miss Hardlow. Ask to see the returned products and examine them. Say that you will investigate what has happened and contact her next week to update her.",
                "Apologise to Miss Hardlow and offer a full refund for the goods."
            ],
            correctAnswer: [2, 3, 0, 1],
            explanation: "The most effective response is C - taking the issue seriously, examining the products, and promising to investigate. The second most effective is D - offering immediate compensation. The third most effective is A - taking action but not showing enough urgency. The least effective is B - making assumptions about quality control and customer loyalty while offering inadequate compensation."
        },
        {
            type: 'most-least',
            passage: "You are a customer advisor at the UK contact centre for Greenwinds Energy. Greenwinds is a renewable-source electricity and gas supplier to European domestic and business customers. Your role is to answer inbound telephone calls and emails from customers in the UK, answering questions and queries about Greenwinds products and services and dealing with customer complaints and issues. You work in a team of 15 and you report into a Customer Service Team Leader. Greenwinds has recently introduced a 'one-rate' policy for all its energy packages. Customers will be charged the same rate per unit of electricity or gas regardless of their method of payment or when their peak usage of energy is. This has many advantages including, greater clarity of charging, no encouragement for use of electrical appliances at night, which can be unsafe, and no discrimination against people using pre-pay meters, pre pay cards or monthly cheque payment, all of whom are traditionally the less prosperous customers.",
            question: "A customer has called the contact centre and is interested in changing her mobile phone tariff and handset as her annual contract is due for renewal next month. She has come through to you and has said that she is finding the information on the website very confusing and isn't sure which would be the best tariff for her and how to get the latest 'smartphone' as inexpensively as possible. She says that her phone, text and data usage is liable to stay pretty much the same in the coming year as it was in the past 12 months. She is confident in her choice of handset. Review the following responses and indicate which one you would be most likely to make and which one you would be least likely to make.",
            options: [
                "Apologise for the confusion but state that the Greenwinds charging policy is clearly written on the joining contract and on the website.",
                "Apologise for the confusion and ask the customer for more detail about the sales conversation, including the salesperson's name or description. Say that you will ask your manager to investigate the way that the contract was sold and to look at whether any miscommunication had happened on the doorstep. Say you will get back to the customer on a daily basis to keep them updated of progress.",
                "Apologise for the confusion and offer the customer a goodwill waiver of one month's standing charge.",
                "Apologise for the confusion and say that you are sorry to hear that they are feeling upset and hope that Greenwinds excellent service and eco-friendly product will make up for the initial misunderstanding in the long-run."
            ],
            correctAnswer: {
                most: 1,
                least: 3
            },
            explanation: "The most effective response is B - taking the complaint seriously, investigating the sales process, and maintaining regular communication. The least effective response is D - being dismissive of their concerns and not addressing the actual issue of the standing charge."
        },
        {
            type: 'most-least',
            passage: "You are a customer advisor at the UK contact centre for Greenwinds Energy. Greenwinds is a renewable-source electricity and gas supplier to European domestic and business customers. Your role is to answer inbound telephone calls and emails from customers in the UK, answering questions and queries about Greenwinds products and services and dealing with customer complaints and issues. You work in a team of 15 and you report into a Customer Service Team Leader. Greenwinds has recently introduced a 'one-rate' policy for all its energy packages. Customers will be charged the same rate per unit of electricity or gas regardless of their method of payment or when their peak usage of energy is. This has many advantages including, greater clarity of charging, no encouragement for use of electrical appliances at night, which can be unsafe, and no discrimination against people using pre-pay meters, pre pay cards or monthly cheque payment, all of whom are traditionally the less prosperous customers.",
            question: "You have recently noticed that your fellow team member, Sandy, is raising his voice quite frequently at the customers and has terminated a few calls early when customers have been expressing dissatisfaction in a rude or discourteous way. Another colleague told you in confidence that Sandy has got problems at home, his wife recently lost her job, they are experiencing financial strain and it is taking its toll on their relationship. Sandy is worried that his wife is depressed and he is finding it hard to concentrate on work properly. You sit next to Sandy in the contact centre and you have noticed his behaviour becoming more erratic over the last few weeks. Review the following responses and indicate which one you would be most likely to make and which one you would be least likely to make.",
            options: [
                "Do nothing. It is not your responsibility to intervene with Sandy, it is up to the Customer Service Team Leader to respond if his work is suffering. You feel that Sandy would be upset and offended if you 'poked your nose in' with his personal problems.",
                "Speak to Sandy and say that you want him to know that you are always available for a chat if he ever needs someone to talk to. Ask him if there is anything that you can do to help and support him at work as you have noticed him dealing with customers differently recently, not in his usual friendly, calm manner.",
                "Say to Sandy that you have noticed that his personal life is affecting his work and say that he had better watch out that the Team Leader doesn't give him a formal warning about the way he is dealing with customers.",
                "Tell your Team Leader that you are worried about Sandy and that you know that he has some problems at home. Say to the Team Leader that you are happy to take on some of Sandy's workload whilst he is feeling stressed and under pressure."
            ],
            correctAnswer: {
                most: 1,
                least: 2
            },
            explanation: "The most effective response is B - offering support and showing concern while maintaining professionalism. The least effective response is C - being confrontational and threatening."
        },
        {
            type: 'most-least',
            passage: "You are a customer advisor at the UK contact centre for Greenwinds Energy. Greenwinds is a renewable-source electricity and gas supplier to European domestic and business customers. Your role is to answer inbound telephone calls and emails from customers in the UK, answering questions and queries about Greenwinds products and services and dealing with customer complaints and issues. You work in a team of 15 and you report into a Customer Service Team Leader. Greenwinds has recently introduced a 'one-rate' policy for all its energy packages. Customers will be charged the same rate per unit of electricity or gas regardless of their method of payment or when their peak usage of energy is. This has many advantages including, greater clarity of charging, no encouragement for use of electrical appliances at night, which can be unsafe, and no discrimination against people using pre-pay meters, pre pay cards or monthly cheque payment, all of whom are traditionally the less prosperous customers.",
            question: "Today is Monday. You had a team meeting this morning in which your Team Leader mentioned that Head Office was unhappy with current levels of customer satisfaction with the contact centre and that there has been a dip in service quality. She said that, therefore, she would be looking closely at the service quality report every week and is expecting an improvement. The way that the contact centre service quality is measured has recently been changed: a new customer satisfaction survey has been introduced which is emailed to customers. Mystery shoppers have also been employed to call at random and record the way that they are dealt with by contact centre staff. Review the following responses and indicate which one you would be most likely to make and which one you would be least likely to make.",
            options: [
                "Make an extra special effort to be warm, friendly and helpful to customers throughout the week.",
                "Look at Greenwinds intranet 'service quality' site which outlines the new measurement methods in detail. Analyse the customer satisfaction questions and the mystery shopper criteria and change your behaviour, if necessary, to ensure that you are fulfilling these requirements.",
                "Wait for a further briefing from your Team Leader. She usually sends a note round following the team meeting summarising what was said. You are hopeful that she will be more specific in this note as to what is required of you in order to improve the service quality ratings.",
                "Ask for a quick chat with your Team Leader sometime today and find out from her what she feels will be the best way for you to contribute to the service quality targets. Make sure you are aware of the details of the new customer satisfaction measure and the Mystery Shopper criteria before you talk to her."
            ],
            correctAnswer: {
                most: 3,
                least: 2
            },
            explanation: "The most effective response is D - proactively seeking guidance while being prepared with knowledge of the new measures. The second most effective is B - taking initiative to understand the new requirements. The third most effective is A - showing commitment to customer service. The least effective is C - passively waiting for more information instead of taking initiative."
        },
        {
            type: 'most-least',
            passage: "You are a customer advisor at the UK contact centre for Greenwinds Energy. Greenwinds is a renewable-source electricity and gas supplier to European domestic and business customers. Your role is to answer inbound telephone calls and emails from customers in the UK, answering questions and queries about Greenwinds products and services and dealing with customer complaints and issues. You work in a team of 15 and you report into a Customer Service Team Leader. Greenwinds has recently introduced a 'one-rate' policy for all its energy packages. Customers will be charged the same rate per unit of electricity or gas regardless of their method of payment or when their peak usage of energy is. This has many advantages including, greater clarity of charging, no encouragement for use of electrical appliances at night, which can be unsafe, and no discrimination against people using pre-pay meters, pre pay cards or monthly cheque payment, all of whom are traditionally the less prosperous customers.",
            question: "You are working a 10am to 6pm shift today. You have just returned from your lunch break at 2pm and your colleague informs you that the IT system which allows access to customer account and billing information has crashed. IT support have said that they won't be able to fix the system until 4.30pm. Your normal rate of calls is 7 or 8 queries an hour. Your Team Leader has sent an email to the whole team asking you to carry on answering customer calls and deal with them as best you can until the system is fixed. Review the following responses and indicate which one you would be most likely to make and which one you would be least likely to make.",
            options: [
                "Calculate that you will probably receive about 20 calls over the next 2.5 hours and that some of these may be queries that you can deal with easily using the website or other resources. Resolve to take the details of the other customers and call them back between 4.30pm and 6pm. You may have to call some of them on the following day as 5pm onwards is peak evening call time and you will be busy with new calls.",
                "Go and see your Team Leader and ask her what she expects you to do with customers who need to respond to a billing or account query today, after all it's her responsibility to provide some leadership in this stressful situation. It's probably not realistic to call them all back after 4.30pm as that is the start of the peak evening call time and inbound calls will be going up to 9 or 10 calls an hour per advisor then.",
                "Suggest to your Team Leader that when the system is back up and running after 4.30pm that one customer advisor could be allocated to getting back to all the afternoon customers who's queries were not resolved, whilst the other advisors deal with the new inbound calls.",
                "Deal with the straightforward queries that come in but ask all other customers to call back after 4.30pm. It will be too difficult to schedule outbound calls when the evening peak begins."
            ],
            correctAnswer: {
                most: 0,
                least: 3
            },
            explanation: "The most effective response is A - taking initiative to manage the situation while considering both immediate and future workload. The second most effective is C - suggesting a team-based solution. The third most effective is B - seeking guidance but being somewhat passive. The least effective is D - not taking responsibility for following up with customers."
        },
        {
            type: 'ranking',
            passage: "You are an advisor working in a customer contact centre for a large telecommunications company called JoinedUp. The company provides mobile phone services and handsets, broadband internet and landline services to domestic and business customers in the UK and Europe.",
            question: "A customer has called the contact centre and is interested in changing her mobile phone tariff and handset as her annual contract is due for renewal next month. She has come through to you and has said that she is finding the information on the website very confusing and isn't sure which would be the best tariff for her and how to get the latest 'smartphone' as inexpensively as possible. She says that her phone, text and data usage is liable to stay pretty much the same in the coming year as it was in the past 12 months. She is confident in her choice of handset. Review the following responses and rank them from 1 (most effective) to 5 (least effective).",
            options: [
                "Tell her that you will take a detailed look at her account and then email her the details of the three best price packages for her. State that you will call her in an hour or two (or some other time convenient to her), once she has had a chance to read the email and talk her through the information and answer any questions.",
                "Talk through the information about all the various available tariffs with her and the related prices of the handset she wants.",
                "State that the best place to find all the information is the website and that if she puts the name of the handset that she requires into the search engine then she will find some useful information.",
                "Ask her to wait whilst you take a thorough look at her account and then talk her through the details of the two or three best price packages for her. Once you have established her preferred package through the conversation, then email her the details of this including the cost of the handset.",
                "Tell her that you will take a detailed look at her account and then email her the details of the two or three best price packages for her."
            ],
            correctAnswer: [0, 3, 1, 4, 2],
            explanation: "The most effective response is A - providing personalized information in both written and verbal formats, with follow-up support. The second most effective is D - taking time to understand needs and providing detailed information. The third most effective is B - providing immediate information but without follow-up. The fourth most effective is E - providing information but without immediate support. The least effective is C - directing her back to the website that she already finds confusing."
        },
        {
            type: 'ranking',
            passage: "You are an advisor working in a customer contact centre for a large telecommunications company called JoinedUp. The company provides mobile phone services and handsets, broadband internet and landline services to domestic and business customers in the UK and Europe.",
            question: "You have just finished a customer call and turned to your colleague, Alexis, who looked troubled and concerned. You asked what was wrong and she said that she had just had to put a customer through to the team leader because she wasn't able to explain a new mobile phone text & data tariff which had just been released by JoinedUp today. The team leader briefed the team about the new tariff this morning and said that it was important to promote it as it had been designed to compete directly with an offer made by a competitor in TV ads last week. Review the following responses and rank them from 1 (most effective) to 5 (least effective).",
            options: [
                "Offer to talk Alexis through the new tariff and answer any questions she may have.",
                "As time is tight you write down a few key points about the tariff and leave it on her workstation for her to have as a reminder if another customer enquiries.",
                "Say that the tariff is very straightforward to understand really and that she'll soon get the hang of it.",
                "Suggest that Alexis asks the team leader for another briefing on the tariff and that it's nothing to be worried about as you have sometimes found new products difficult to fathom at first.",
                "Tell her that you'll email her the briefing document that your team leader handed out this morning to remind her of the details of the tariff."
            ],
            correctAnswer: [0, 3, 1, 4, 2],
            explanation: "The most effective response is A - being directly supportive and helpful to your colleague and improving the team's chances of performing effectively. The second most effective is D - being emotionally supportive if not immediately offering practical help yourself but making a reasonable suggestion to Alexis. The third most effective is B - providing some help but not as comprehensive as direct support. The fourth most effective is E - providing information but not addressing the understanding issue. The least effective is C - undermining her confidence and not offering any real help."
        },
        {
            type: 'ranking',
            passage: "You are an advisor working in a customer contact centre for a large telecommunications company called JoinedUp. The company provides mobile phone services and handsets, broadband internet and landline services to domestic and business customers in the UK and Europe.",
            question: "Your team leader called you over this morning and said that she thought you would like to know that, in the last quarter results, you were one of the JoinedUp top 20 UK customer advisors for call quality and efficiency. This means that, compared to other customer advisors, you had managed your calls effectively in terms of customer satisfaction and that you had answered the right number of calls per hour and your calls had mostly been of the target length suggested by JoinedUp. This result suggests that in this current quarter you have a chance of achieving a longstanding personal goal and earning a substantial bonus payment into the bargain. The top 10 customer advisors each quarter receive a bonus payment worth 15% of their salary. There are 2 months of this current quarter remaining and you are keen to do your best to get into that 'top 10' list. Review the following responses and rank them from 1 (most effective) to 5 (least effective).",
            options: [
                "Find out from your team leader who the advisors in the Top 10 were last quarter. Email them and ask if any can spare fifteen minutes for a chat and see if you can glean any hints and tips for improving your performance even further.",
                "Tell your colleagues that you are in the Top 20 advisors and say that you will bring cakes and doughnuts tomorrow to celebrate.",
                "Cancel the three days annual leave that you had booked in for next week as you want to make sure you are one of the top performers.",
                "Keep working as you have been. After all 'if it ain't broke...' as the saying goes.",
                "Ask your team leader for feedback and advice on how to achieve Top 10 status."
            ],
            correctAnswer: [0, 4, 3, 1, 2],
            explanation: "The most effective response is A - getting advice from top performers to improve your performance. The second most effective is E - seeking guidance from your team leader. The third most effective is D - maintaining current performance while looking for improvement opportunities. The fourth most effective is B - celebrating achievement but not focusing on improvement. The least effective is C - sacrificing rest time which could negatively impact performance."
        },
        {
            type: 'ranking',
            passage: "You are an advisor working in a customer contact centre for a large telecommunications company called JoinedUp. The company provides mobile phone services and handsets, broadband internet and landline services to domestic and business customers in the UK and Europe.",
            question: "It is 10am on a Tuesday. JoinedUp launched the 'Yphone Xtra' mobile handset today which is the new, sought-after handset of the moment. Customers can acquire the Yphone at a very low cost when they sign up to a 12 or 24 month contract for mobile phone services with JoinedUp. There is an additional offer that the first 1000 customers who sign-up for a relevant JoinedUp mobile contract qualify for a free Yphone. The handset and the offer were made available from 9am today and since then the call centre has been experiencing a very high level of calls. Your team leader has told you that you will be required to work an extra 4 hours from 4pm until 8pm, at the end of your 8 hour shift today but you'll be able to take the time-off-in-lieu sometime next week. Everyone in the team will also have shortened lunch breaks today, again with the time being recouped next week. You haven't said anything to your team leader but you have a report to write for your BTEC in Contact Centre Leadership tonight; it is due in by midday tomorrow and you are working tomorrow morning. Review the following responses and rank them from 1 (most effective) to 5 (least effective).",
            options: [
                "Contact your BTEC tutor and ask for an extension on the report deadline, if at all possible, explain that you are in a uniquely demanding work situation. If the extension isn't granted see if you can reduce your shift from 12 to 10 hours by explaining your predicament to your team leader.",
                "Work very quickly through the calls that you receive in the hope that the call numbers will dwindle later and your team leader will let you go earlier.",
                "Refuse to work the extra time tonight although you will take a shorter lunch break. Tell your team leader that you have a prior engagement this evening that you cannot break.",
                "Call a colleague who is on leave today and see if they can cover for your extra 4 hours.",
                "Ask your team leader if there is any lee-way in this arrangement as you have an urgent report to write tonight and it is a work-related assignment. Say that you will take a minimal break and work 10 hours without distraction."
            ],
            correctAnswer: [0, 4, 3, 1, 2],
            explanation: "The most effective response is A - proactively addressing both work and study commitments. The second most effective is E - being cooperative while explaining your situation. The third most effective is D - seeking help from colleagues. The fourth most effective is B - compromising service quality. The least effective is C - being uncooperative and potentially damaging team relationships."
        }
    ],
    timeLimit: 25 * 60 // 25 minutes
};

window.addEventListener('DOMContentLoaded', function() {
    window.testCore = new TestCore(testConfig);
    window.testCore.displayQuestion();
    window.testCore.timerInterval = setInterval(window.testCore.updateTimer, 1000);
}); 