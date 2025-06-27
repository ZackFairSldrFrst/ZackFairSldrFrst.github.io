import React, { useState } from 'react';
import { Send, Bot } from 'lucide-react';
import { format, addDays } from 'date-fns';

const AIAssistant = ({ availability, bookings, onTimeSlotClick }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hi! I'm your AI assistant powered by DeepSeek. I can help you find the best times for appointments based on your availability. Try asking me something like 'When are you free this week?' or 'I need a meeting next Monday afternoon'."
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Generate available time slots for analysis
  const generateAvailableSlots = () => {
    const slots = [];
    const today = new Date();
    
    // Generate slots for the next 2 weeks
    for (let i = 0; i < 14; i++) {
      const checkDate = addDays(today, i);
      const dayName = format(checkDate, 'EEEE').toLowerCase();
      const dayAvailability = availability[dayName];
      
      if (dayAvailability && dayAvailability.available) {
        const daySlots = generateTimeSlotsForDay(checkDate, dayAvailability, bookings);
        if (daySlots.length > 0) {
          slots.push({
            date: format(checkDate, 'yyyy-MM-dd'),
            dayName: format(checkDate, 'EEEE'),
            dateFormatted: format(checkDate, 'MMM d'),
            slots: daySlots
          });
        }
      }
    }
    
    return slots;
  };

  const generateTimeSlotsForDay = (date, dayAvailability, existingBookings) => {
    const slots = [];
    const startTime = new Date(date);
    const [startHour, startMinute] = dayAvailability.start.split(':');
    startTime.setHours(parseInt(startHour), parseInt(startMinute), 0);

    const endTime = new Date(date);
    const [endHour, endMinute] = dayAvailability.end.split(':');
    endTime.setHours(parseInt(endHour), parseInt(endMinute), 0);

    // Generate 30-minute slots
    const currentTime = new Date(startTime);
    while (currentTime < endTime) {
      const timeString = format(currentTime, 'HH:mm');
      const isBooked = existingBookings.some(booking => 
        format(new Date(booking.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') &&
        booking.time === timeString
      );
      
      if (!isBooked) {
        slots.push(timeString);
      }
      
      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }

    return slots;
  };

  // Call DeepSeek API
  const callDeepSeekAPI = async (userInput, availableSlots) => {
    const apiKey = process.env.REACT_APP_DEEPSEEK_API_KEY || 'sk-ed4048785a4e4161a2a7e82780462032';
    const apiUrl = 'https://api.deepseek.com/v1/chat/completions';
    
    const systemPrompt = `You are an AI assistant helping users find appointment times. You have access to the following available time slots:

${availableSlots.map(day => 
  `${day.dayName}, ${day.dateFormatted}: ${day.slots.join(', ')}`
).join('\n')}

Your role is to:
1. Analyze the user's request and understand their preferences
2. Suggest relevant time slots from the available options
3. Format your response with clickable time slots using this format: [TIME_SLOT:date:time]
4. Be conversational and helpful
5. If no suitable times are found, explain why and suggest alternatives

Example response format:
"I found some great times for you! Here are my recommendations:
- [Monday, Dec 16:09:00:2024-12-16:09:00] - Early morning slot
- [Monday, Dec 16:14:00:2024-12-16:14:00] - Afternoon slot

Click on any time slot to book your appointment!"

Only suggest times that are actually available in the provided slots.`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userInput }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('DeepSeek API error:', error);
      return "I'm having trouble connecting to my AI service right now. Please try again later or use the booking interface directly.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isProcessing) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsProcessing(true);

    try {
      const availableSlots = generateAvailableSlots();
      const aiResponse = await callDeepSeekAPI(inputMessage, availableSlots);
      
      const aiMessage = {
        id: messages.length + 2,
        type: 'ai',
        content: aiResponse
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        id: messages.length + 2,
        type: 'ai',
        content: "I'm sorry, I encountered an error. Please try again or use the booking interface directly."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Parse and render message content with clickable time slots
  const renderMessageContent = (content) => {
    // Regular expression to match time slot format: [TIME_SLOT:date:time]
    const timeSlotRegex = /\[([^:]+):([^:]+):([^\]]+)\]/g;
    
    const parts = [];
    let lastIndex = 0;
    let match;
    
    while ((match = timeSlotRegex.exec(content)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: content.slice(lastIndex, match.index)
        });
      }
      
      // Add the clickable time slot
      parts.push({
        type: 'timeSlot',
        displayText: match[1],
        date: match[2],
        time: match[3],
        fullMatch: match[0]
      });
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex)
      });
    }
    
    return parts.map((part, index) => {
      if (part.type === 'timeSlot') {
        return (
          <button
            key={index}
            onClick={() => onTimeSlotClick && onTimeSlotClick(part.date, part.time)}
            className="inline-block bg-primary-600 text-white px-2 py-1 rounded text-sm hover:bg-primary-700 transition-colors mx-1"
          >
            {part.displayText}
          </button>
        );
      } else {
        return <span key={index}>{part.content}</span>;
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-full mr-3">
            <Bot className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">AI Assistant (DeepSeek)</h2>
            <p className="text-sm text-gray-500">Ask me about available times</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="whitespace-pre-line">
                {message.type === 'ai' ? renderMessageContent(message.content) : message.content}
              </div>
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
                Thinking...
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex space-x-2">
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about available times... (e.g., 'When are you free this week?', 'I need a meeting next Monday afternoon')"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              rows={2}
              disabled={isProcessing}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isProcessing}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Quick Suggestions */}
      <div className="border-t border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Quick suggestions:</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "When are you free this week?",
            "I need a meeting next Monday",
            "Any afternoon slots available?",
            "What's your availability next week?"
          ].map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setInputMessage(suggestion)}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIAssistant; 