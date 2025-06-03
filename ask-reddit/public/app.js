document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const loading = document.getElementById('loading');
    const results = document.getElementById('results');
    const summary = document.getElementById('summary');
    const summaryContent = document.getElementById('summaryContent');

    async function searchRedditPosts(query) {
        // Use Google Search to find Reddit posts
        const searchUrl = `https://www.google.com/search?q=site:reddit.com ${encodeURIComponent(query)}`;
        
        try {
            const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(searchUrl)}`);
            const data = await response.json();
            const parser = new DOMParser();
            const doc = parser.parseFromString(data.contents, 'text/html');
            
            // Extract Reddit links from Google search results
            const redditLinks = Array.from(doc.querySelectorAll('a'))
                .filter(link => link.href.includes('reddit.com/r/'))
                .map(link => link.href)
                .slice(0, 5); // Get top 5 results

            return redditLinks;
        } catch (error) {
            console.error('Error searching Reddit posts:', error);
            return [];
        }
    }

    async function scrapeRedditPost(url) {
        try {
            const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
            const data = await response.json();
            const parser = new DOMParser();
            const doc = parser.parseFromString(data.contents, 'text/html');

            // Extract post title
            const title = doc.querySelector('h1')?.textContent || '';

            // Extract comments
            const comments = Array.from(doc.querySelectorAll('[data-testid="comment"]'))
                .slice(0, 10) // Get top 10 comments
                .map(comment => {
                    const text = comment.querySelector('[data-testid="comment-text"]')?.textContent || '';
                    const score = comment.querySelector('[data-testid="vote-score"]')?.textContent || '0';
                    return { text, score: parseInt(score) || 0 };
                })
                .filter(comment => comment.text.length > 0);

            return {
                title,
                url,
                comments
            };
        } catch (error) {
            console.error('Error scraping Reddit post:', error);
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
            // Search for Reddit posts
            const redditLinks = await searchRedditPosts(query);
            
            // Scrape each post
            const posts = await Promise.all(
                redditLinks.map(url => scrapeRedditPost(url))
            );

            // Filter out failed scrapes
            const validPosts = posts.filter(post => post !== null);

            // Prepare text for AI summarization
            const textToSummarize = validPosts
                .map(post => {
                    const commentsText = post.comments
                        .map(comment => `Comment (Score: ${comment.score}): ${comment.text}`)
                        .join('\n');
                    return `Post: ${post.title}\n${commentsText}\n`;
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
                        <div class="space-y-4">
                            ${post.comments.map(comment => `
                                <div class="border-l-4 border-gray-200 pl-4">
                                    <div class="comment-score mb-2">
                                        Score: ${comment.score}
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