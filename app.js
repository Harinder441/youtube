class YouTubeSearchApp {
    constructor() {
        this.apiKey = localStorage.getItem('youtubeApiKey');
        this.apiEndpoint = 'https://www.googleapis.com/youtube/v3/search';
        this.videoDetailsEndpoint = 'https://www.googleapis.com/youtube/v3/videos';
        this.embedBaseUrl = 'https://www.youtube.com/embed/';
        this.maxResults = 12;
        this.nextPageToken = null;
        this.currentQuery = '';
        this.isLoadingMore = false;
        this.hasMoreResults = true;
        
        // Subscription-related properties
        this.subscriptions = SUBSCRIPTIONS_DATA.subscriptions;
        this.currentPage = 'search'; // 'search' or 'subscriptions'
        this.selectedChannel = null;
        this.subscriptionVideos = new Map(); // Cache for channel videos
        this.subscriptionCache = new Map(); // Cache with timestamps
        
        this.initializeElements();
        this.bindEventListeners();
        this.loadSavedApiKey();
        this.loadSubscriptionCache();
    }
    
    initializeElements() {
        this.apiKeyInput = document.getElementById('apiKey');
        this.searchInput = document.getElementById('searchInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.subscriptionsBtn = document.getElementById('subscriptionsBtn');
        this.playerSection = document.getElementById('playerSection');
        this.videoPlayer = document.getElementById('videoPlayer');
        this.currentVideoInfo = document.getElementById('currentVideoInfo');
        this.loadingIndicator = document.getElementById('loadingIndicator');
        this.errorMessage = document.getElementById('errorMessage');
        this.resultsGrid = document.getElementById('resultsGrid');
        this.loadMoreIndicator = document.getElementById('loadMoreIndicator');
        
        // Subscription page elements
        this.subscriptionsPage = document.getElementById('subscriptionsPage');
        this.subscriptionsList = document.getElementById('subscriptionsList');
        this.subscriptionsVideos = document.getElementById('subscriptionsVideos');
        this.refreshSubscriptionsBtn = document.getElementById('refreshSubscriptionsBtn');
    }
    
    bindEventListeners() {
        // Search functionality
        this.searchBtn.addEventListener('click', () => this.handleSearch());
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });
        
        // Subscription functionality
        this.subscriptionsBtn.addEventListener('click', () => this.showSubscriptionsPage());
        this.refreshSubscriptionsBtn.addEventListener('click', () => this.refreshAllSubscriptions());
        
        // API key management
        this.apiKeyInput.addEventListener('input', () => {
            this.apiKey = this.apiKeyInput.value.trim();
        });
        
        this.apiKeyInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.apiKey = this.apiKeyInput.value.trim();
                this.saveApiKey();
            }
        });
        
        // Clear error message when starting new search
        this.searchInput.addEventListener('focus', () => {
            this.hideError();
        });
        
        // Infinite scroll functionality
        window.addEventListener('scroll', () => this.handleScroll());
    }
    
    loadSavedApiKey() {
        const savedApiKey = localStorage.getItem('youtubeApiKey');
        if (savedApiKey) {
            this.apiKey = savedApiKey;
            this.apiKeyInput.value = savedApiKey;
            this.hideApiKeySection();
        } else {
            this.showApiKeySection();
        }
    }
    
    saveApiKey() {
        if (this.apiKey) {
            localStorage.setItem('youtubeApiKey', this.apiKey);
            this.hideApiKeySection();
        }
    }
    
    async handleSearch() {
        const query = this.searchInput.value.trim();
        
        if (!this.apiKey) {
            this.showError('Please enter your YouTube Data API v3 key first.');
            this.showApiKeySection();
            this.apiKeyInput.focus();
            return;
        }
        
        if (!query) {
            this.showError('Please enter a search query.');
            this.searchInput.focus();
            return;
        }
        
        // Hide subscriptions page if it's currently shown
        if (this.currentPage === 'subscriptions') {
            this.hideSubscriptionsPage();
        }
        
        // Reset pagination for new search
        this.nextPageToken = null;
        this.currentQuery = query;
        this.hasMoreResults = true;
        this.isLoadingMore = false;
        
        await this.searchVideos(query);
    }
    
    async searchVideos(query, isLoadMore = false) {
        if (!isLoadMore) {
            this.showLoading();
            this.hideError();
            this.clearResults();
        } else {
            this.showLoadMoreIndicator();
        }
        
        try {
            const url = new URL(this.apiEndpoint);
            url.searchParams.append('part', 'snippet');
            url.searchParams.append('type', 'video');
            url.searchParams.append('q', query);
            url.searchParams.append('maxResults', this.maxResults.toString());
            url.searchParams.append('key', this.apiKey);
            
            if (this.nextPageToken) {
                url.searchParams.append('pageToken', this.nextPageToken);
            }
            
            const response = await fetch(url.toString());
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error?.message || 'Failed to fetch videos');
            }
            
            this.nextPageToken = data.nextPageToken || null;
            this.hasMoreResults = !!this.nextPageToken;
            
            if (isLoadMore) {
                this.hideLoadMoreIndicator();
                this.appendResults(data.items || []);
            } else {
                this.hideLoading();
                this.displayResults(data.items || []);
            }
            
        } catch (error) {
            if (isLoadMore) {
                this.hideLoadMoreIndicator();
            } else {
                this.hideLoading();
            }
            this.handleApiError(error);
        }
    }
    
    displayResults(videos) {
        if (videos.length === 0) {
            this.showError('No videos found for your search query. Try different keywords.');
            return;
        }
        
        this.resultsGrid.innerHTML = '';
        
        videos.forEach((video, index) => {
            const videoCard = this.createVideoCard(video, index);
            this.resultsGrid.appendChild(videoCard);
        });
        
        // Show search results section
        document.getElementById('searchResults').classList.remove('hidden');
        
        // Scroll to the video list after results are displayed
        this.scrollToVideoList();
    }
    
    appendResults(videos) {
        if (videos.length === 0) {
            this.hasMoreResults = false;
            return;
        }
        
        const currentCardCount = this.resultsGrid.children.length;
        
        videos.forEach((video, index) => {
            const videoCard = this.createVideoCard(video, currentCardCount + index);
            this.resultsGrid.appendChild(videoCard);
        });
    }
    
    createVideoCard(video, index) {
        const { id, snippet } = video;
        const videoId = id.videoId;
        const title = snippet.title;
        const channelTitle = snippet.channelTitle;
        const thumbnail = snippet.thumbnails.medium?.url || snippet.thumbnails.default?.url;
        const publishedDate = this.formatDate(snippet.publishedAt);
        
        const card = document.createElement('div');
        card.className = 'video-card';
        card.tabIndex = 0;
        card.setAttribute('data-video-id', videoId);
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Play video: ${title}`);
        
        card.innerHTML = `
            <div class="video-thumbnail">
                <img src="${thumbnail}" alt="${title}" loading="lazy">
            </div>
            <div class="video-info">
                <h3 class="video-title">${this.escapeHtml(title)}</h3>
                <p class="video-channel">${this.escapeHtml(channelTitle)}</p>
                <p class="video-date">${publishedDate}</p>
            </div>
        `;
        
        // Add click and keyboard event listeners
        card.addEventListener('click', () => this.playVideo(videoId, title, channelTitle));
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.playVideo(videoId, title, channelTitle);
            }
        });
        
        return card;
    }
    
    playVideo(videoId, title, channelTitle) {
        const embedUrl = `${this.embedBaseUrl}${videoId}?autoplay=1&rel=0`;
        
        this.videoPlayer.src = embedUrl;
        this.updateCurrentVideoInfo(title, channelTitle);
        this.showVideoPlayer();
        
        // Scroll to video player
        this.playerSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
    
    updateCurrentVideoInfo(title, channelTitle) {
        this.currentVideoInfo.innerHTML = `
            <div class="current-video-title">${this.escapeHtml(title)}</div>
            <div class="current-video-channel">by ${this.escapeHtml(channelTitle)}</div>
        `;
    }
    
    showVideoPlayer() {
        this.playerSection.classList.remove('hidden');
    }
    
    hideVideoPlayer() {
        this.playerSection.classList.add('hidden');
        this.videoPlayer.src = '';
    }
    
    showApiKeySection() {
        this.apiKeyInput.parentElement.parentElement.style.display = 'block';
    }
    
    hideApiKeySection() {
        this.apiKeyInput.parentElement.parentElement.style.display = 'none';
    }
    
    showLoading() {
        this.loadingIndicator.classList.remove('hidden');
    }
    
    hideLoading() {
        this.loadingIndicator.classList.add('hidden');
    }
    
    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.classList.remove('hidden');
        this.errorMessage.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }
    
    hideError() {
        this.errorMessage.classList.add('hidden');
    }
    
    clearResults() {
        this.resultsGrid.innerHTML = '';
    }
    
    handleScroll() {
        if (this.isLoadingMore || !this.hasMoreResults || !this.currentQuery) {
            return;
        }
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Trigger load more when user is 200px from bottom
        if (scrollTop + windowHeight >= documentHeight - 200) {
            this.loadMoreResults();
        }
    }
    
    async loadMoreResults() {
        if (this.isLoadingMore || !this.hasMoreResults || !this.currentQuery) {
            return;
        }
        
        this.isLoadingMore = true;
        await this.searchVideos(this.currentQuery, true);
        this.isLoadingMore = false;
    }
    
    showLoadMoreIndicator() {
        if (this.loadMoreIndicator) {
            this.loadMoreIndicator.classList.remove('hidden');
        }
    }
    
    hideLoadMoreIndicator() {
        if (this.loadMoreIndicator) {
            this.loadMoreIndicator.classList.add('hidden');
        }
    }
    
    scrollToVideoList() {
        // Scroll to the search results section with smooth behavior
        const searchResults = document.getElementById('searchResults');
        if (searchResults) {
            searchResults.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }
    
    // Subscription-related methods
    showSubscriptionsPage() {
        if (!this.apiKey) {
            this.showError('Please enter your YouTube Data API v3 key first.');
            this.showApiKeySection();
            this.apiKeyInput.focus();
            return;
        }
        
        this.currentPage = 'subscriptions';
        this.hideSearchPage();
        this.showSubscriptionsPageContent();
        this.populateSubscriptionsList();
    }
    
    hideSearchPage() {
        document.getElementById('searchResults').classList.add('hidden');
        this.playerSection.classList.add('hidden');
        this.hideError();
    }
    
    showSubscriptionsPageContent() {
        this.subscriptionsPage.classList.remove('hidden');
        this.subscriptionsPage.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
    
    hideSubscriptionsPage() {
        this.subscriptionsPage.classList.add('hidden');
        this.currentPage = 'search';
    }
    
    populateSubscriptionsList() {
        this.subscriptionsList.innerHTML = '';
        
        this.subscriptions.forEach((subscription, index) => {
            const subscriptionItem = document.createElement('div');
            subscriptionItem.className = 'subscription-item';
            subscriptionItem.setAttribute('data-channel-id', subscription.id);
            subscriptionItem.setAttribute('data-channel-name', subscription.name);
            
            subscriptionItem.innerHTML = `
                <div class="subscription-thumbnail">
                    <img src="${subscription.thumbnail}" alt="${subscription.name}" loading="lazy">
                </div>
                <div class="subscription-name">${this.escapeHtml(subscription.name)}</div>
            `;
            
            subscriptionItem.addEventListener('click', () => {
                this.selectChannel(subscription);
            });
            
            this.subscriptionsList.appendChild(subscriptionItem);
        });
    }
    
    async selectChannel(subscription) {
        // Update active state
        document.querySelectorAll('.subscription-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeItem = document.querySelector(`[data-channel-id="${subscription.id}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
        
        this.selectedChannel = subscription;
        
        // Check if we have cached data
        const cachedData = this.getCachedChannelData(subscription.id);
        const now = Date.now();
        const cacheExpiry = 30 * 60 * 1000; // 30 minutes
        
        if (cachedData && (now - cachedData.timestamp) < cacheExpiry) {
            this.displayChannelVideos(cachedData.videos, subscription);
        } else {
            await this.fetchChannelVideos(subscription);
        }
    }
    
    async fetchChannelVideos(subscription) {
        this.showSubscriptionLoading();
        
        try {
            const url = new URL(this.apiEndpoint);
            url.searchParams.append('part', 'snippet');
            url.searchParams.append('channelId', subscription.id);
            url.searchParams.append('type', 'video');
            url.searchParams.append('order', 'date');
            url.searchParams.append('maxResults', '20');
            url.searchParams.append('key', this.apiKey);
            
            const response = await fetch(url.toString());
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error?.message || 'Failed to fetch channel videos');
            }
            
            const videos = data.items || [];
            
            // Cache the data
            this.cacheChannelData(subscription.id, videos);
            
            this.displayChannelVideos(videos, subscription);
            
        } catch (error) {
            this.hideSubscriptionLoading();
            this.handleApiError(error);
        }
    }
    
    displayChannelVideos(videos, subscription) {
        this.hideSubscriptionLoading();
        
        if (videos.length === 0) {
            this.subscriptionsVideos.innerHTML = `
                <div class="subscriptions-placeholder">
                    <p>No videos found for ${subscription.name}</p>
                </div>
            `;
            return;
        }
        
        const videosGrid = document.createElement('div');
        videosGrid.className = 'subscription-videos-grid';
        
        videos.forEach(video => {
            const videoCard = this.createSubscriptionVideoCard(video);
            videosGrid.appendChild(videoCard);
        });
        
        this.subscriptionsVideos.innerHTML = '';
        this.subscriptionsVideos.appendChild(videosGrid);
    }
    
    createSubscriptionVideoCard(video) {
        const { id, snippet } = video;
        const videoId = id.videoId;
        const title = snippet.title;
        const channelTitle = snippet.channelTitle;
        const thumbnail = snippet.thumbnails.medium?.url || snippet.thumbnails.default?.url;
        const publishedDate = this.formatDate(snippet.publishedAt);
        
        const card = document.createElement('div');
        card.className = 'subscription-video-card';
        card.tabIndex = 0;
        card.setAttribute('data-video-id', videoId);
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Play video: ${title}`);
        
        card.innerHTML = `
            <div class="subscription-video-thumbnail">
                <img src="${thumbnail}" alt="${title}" loading="lazy">
            </div>
            <div class="subscription-video-info">
                <h3 class="subscription-video-title">${this.escapeHtml(title)}</h3>
                <p class="subscription-video-channel">${this.escapeHtml(channelTitle)}</p>
                <p class="subscription-video-date">${publishedDate}</p>
            </div>
        `;
        
        // Add click and keyboard event listeners
        card.addEventListener('click', () => this.playVideo(videoId, title, channelTitle));
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.playVideo(videoId, title, channelTitle);
            }
        });
        
        return card;
    }
    
    showSubscriptionLoading() {
        this.subscriptionsVideos.innerHTML = `
            <div class="subscription-loading">
                <div class="loading-spinner"></div>
                <p>Loading videos from ${this.selectedChannel?.name || 'channel'}...</p>
            </div>
        `;
    }
    
    hideSubscriptionLoading() {
        // Loading will be replaced by displayChannelVideos
    }
    
    async refreshAllSubscriptions() {
        if (!this.apiKey) {
            this.showError('Please enter your YouTube Data API v3 key first.');
            return;
        }
        
        // Clear all cached data
        this.clearSubscriptionCache();
        
        // Refresh current channel if one is selected
        if (this.selectedChannel) {
            await this.fetchChannelVideos(this.selectedChannel);
        } else {
            // Show placeholder
            this.subscriptionsVideos.innerHTML = `
                <div class="subscriptions-placeholder">
                    <p>Select a channel to view its latest videos</p>
                </div>
            `;
        }
    }
    
    // Local storage methods for subscription cache
    loadSubscriptionCache() {
        try {
            const cached = localStorage.getItem('subscriptionCache');
            if (cached) {
                const cacheData = JSON.parse(cached);
                this.subscriptionCache = new Map(cacheData);
            }
        } catch (error) {
            console.warn('Failed to load subscription cache:', error);
            this.subscriptionCache = new Map();
        }
    }
    
    saveSubscriptionCache() {
        try {
            const cacheArray = Array.from(this.subscriptionCache.entries());
            localStorage.setItem('subscriptionCache', JSON.stringify(cacheArray));
        } catch (error) {
            console.warn('Failed to save subscription cache:', error);
        }
    }
    
    getCachedChannelData(channelId) {
        return this.subscriptionCache.get(channelId);
    }
    
    cacheChannelData(channelId, videos) {
        const cacheData = {
            videos: videos,
            timestamp: Date.now(),
            batchId: `batch_${Date.now()}_${channelId}`
        };
        
        this.subscriptionCache.set(channelId, cacheData);
        this.saveSubscriptionCache();
    }
    
    clearSubscriptionCache() {
        this.subscriptionCache.clear();
        this.saveSubscriptionCache();
    }
    
    handleApiError(error) {
        console.error('YouTube API Error:', error);
        
        let errorMessage = 'An error occurred while searching for videos.';
        
        if (error.message.includes('API key')) {
            errorMessage = 'Invalid API key. Please check your YouTube Data API v3 key and try again.';
        } else if (error.message.includes('quota')) {
            errorMessage = 'API quota exceeded. Please try again later or check your Google Cloud Console quota limits.';
        } else if (error.message.includes('403')) {
            errorMessage = 'Access forbidden. Please ensure your API key has the correct permissions and YouTube Data API v3 is enabled.';
        } else if (error.message.includes('400')) {
            errorMessage = 'Bad request. Please check your search query and API key.';
        } else if (!navigator.onLine) {
            errorMessage = 'No internet connection. Please check your network and try again.';
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        this.showError(errorMessage);
    }
    
    formatDate(dateString) {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffTime = Math.abs(now - date);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                return 'Yesterday';
            } else if (diffDays < 7) {
                return `${diffDays} days ago`;
            } else if (diffDays < 30) {
                const weeks = Math.floor(diffDays / 7);
                return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
            } else if (diffDays < 365) {
                const months = Math.floor(diffDays / 30);
                return months === 1 ? '1 month ago' : `${months} months ago`;
            } else {
                const years = Math.floor(diffDays / 365);
                return years === 1 ? '1 year ago' : `${years} years ago`;
            }
        } catch (e) {
            return 'Date unknown';
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new YouTubeSearchApp();
});

// Add some additional utility functions for better UX
document.addEventListener('DOMContentLoaded', () => {
    // Add keyboard navigation improvements
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Clear focus from video cards
            const focusedCard = document.querySelector('.video-card:focus');
            if (focusedCard) {
                focusedCard.blur();
            }
        }
    });
    
    // Add smooth scrolling for better UX
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Handle image loading errors
    document.addEventListener('error', (e) => {
        if (e.target.tagName === 'IMG') {
            e.target.style.display = 'none';
            const placeholder = document.createElement('div');
            placeholder.className = 'thumbnail-placeholder';
            placeholder.textContent = 'No thumbnail available';
            placeholder.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                background: var(--color-secondary);
                color: var(--color-text-secondary);
                font-size: var(--font-size-sm);
                position: absolute;
                top: 0;
                left: 0;
            `;
            e.target.parentNode.appendChild(placeholder);
        }
    }, true);
});