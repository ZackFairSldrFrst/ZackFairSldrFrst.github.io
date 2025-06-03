document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const loading = document.getElementById('loading');
    const results = document.getElementById('results');
    const summary = document.getElementById('summary');
    const summaryContent = document.getElementById('summaryContent');

    // Google Custom Search API configuration
    const GOOGLE_API_KEY = 'AIzaSyAbnJzgFVebnW76raC83XkjiqlDk75sR2k';
    const SEARCH_ENGINE_ID = '017576662512468239146:omuauf_lfve'; // You'll need to create a Custom Search Engine and get this ID

    async function searchRedditPosts(query) {
        try {
            const response = await fetch(
                `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${SEARCH_ENGINE_ID}&q=site:reddit.com ${encodeURIComponent(query)}`
            );
            const data = await response.json();
            
            if (data.items) {
                return data.items
                    .filter(item => item.link.includes('reddit.com/r/'))
                    .map(item => ({
                        title: item.title,
                        url: item.link,
                        snippet: item.snippet
                    }))
                    .slice(0, 5); // Get top 5 results
            }
            return [];
        } catch (error) {
            console.error('Error searching Reddit posts:', error);
            return [];
        }
    }

    async function fetchRedditContent(url) {
        try {
            // Convert Reddit URL to JSON format
            const jsonUrl = url.replace(/\/$/, '') + '.json';
            const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(jsonUrl)}`);
            const data = await response.json();
            const redditData = JSON.parse(data.contents);

            if (redditData && redditData[0] && redditData[0].data && redditData[0].data.children[0]) {
                const post = redditData[0].data.children[0].data;
                const comments = redditData[1].data.children
                    .filter(comment => comment.kind === 't1')
                    .map(comment => ({
                        text: comment.data.body,
                        score: comment.data.score,
                        author: comment.data.author
                    }))
                    .slice(0, 10); // Get top 10 comments

                return {
                    title: post.title,
                    url: url,
                    score: post.score,
                    comments: comments
                };
            }
            return null;
        } catch (error) {
            console.error('Error fetching Reddit content:', error);
            return null;
        }
    }

    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        
        if (!query) return;

        // Show loading state
        loading.classList.remove('hidden');
        results.classList.add('hidden');
        summary.classList.add('hidden');

        try {
            // Search for Reddit posts using Google Custom Search
            const searchResults = await searchRedditPosts(query);
            
            // Fetch content for each post
            const posts = await Promise.all(
                searchResults.map(result => fetchRedditContent(result.url))
            );

            // Filter out failed fetches
            const validPosts = posts.filter(post => post !== null);

            // Prepare text for AI summarization
            const textToSummarize = validPosts
                .map(post => {
                    const commentsText = post.comments
                        .map(comment => `Comment by ${comment.author} (Score: ${comment.score}): ${comment.text}`)
                        .join('\n');
                    return `Post: ${post.title} (Score: ${post.score})\n${commentsText}\n`;
                })
                .join('\n');

            // Use DeepSeek to summarize the content
            const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer sk-c15fc829925a4a5792c181fb80ed550a'
                },
                body: JSON.stringify({
                    model: "deepseek-chat",
                    messages: [
                        {
                            role: "system",
                            content: "You are a helpful assistant that summarizes Reddit discussions. Analyze the provided Reddit posts and comments, and create a comprehensive summary that includes: 1) The most popular viewpoints, 2) Interesting anecdotes or stories, 3) Common themes or patterns, 4) Controversial points, and 5) The overall sentiment of the discussion. For each point, indicate its popularity based on the comment scores."
                        },
                        {
                            role: "user",
                            content: `Please analyze and summarize these Reddit discussions:\n\n${textToSummarize}`
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 1500
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Display summary
                summaryContent.innerHTML = data.choices[0].message.content
                    .split('\n')
                    .map(line => `<p>${line}</p>`)
                    .join('');
                summary.classList.remove('hidden');
                results.classList.remove('hidden');

                // Display original posts
                const postsContainer = document.createElement('div');
                postsContainer.className = 'space-y-4 mt-8';
                validPosts.forEach(post => {
                    const postElement = document.createElement('div');
                    postElement.className = 'bg-white rounded-lg shadow-lg p-6 post-card';
                    postElement.innerHTML = `
                        <h3 class="text-xl font-semibold mb-2">
                            <a href="${post.url}" target="_blank" class="text-blue-600 hover:text-blue-800">
                                ${post.title}
                            </a>
                        </h3>
                        <div class="text-sm text-gray-500 mb-4">
                            Post Score: ${post.score}
                        </div>
                        <div class="space-y-4">
                            ${post.comments.map(comment => `
                                <div class="border-l-4 border-gray-200 pl-4">
                                    <div class="comment-score mb-2">
                                        By ${comment.author} • Score: ${comment.score}
                                    </div>
                                    <p class="text-gray-700">${comment.text}</p>
                                </div>
                            `).join('')}
                        </div>
                    `;
                    postsContainer.appendChild(postElement);
                });
                results.appendChild(postsContainer);
            } else {
                throw new Error(data.error?.message || 'An error occurred');
            }
        } catch (error) {
            alert('Error: ' + error.message);
        } finally {
            loading.classList.add('hidden');
        }
    });
}); 