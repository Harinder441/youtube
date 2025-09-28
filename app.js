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
        
        this.initializeElements();
        this.bindEventListeners();
        this.loadSavedApiKey();
    }
    
    initializeElements() {
        this.apiKeyInput = document.getElementById('apiKey');
        this.searchInput = document.getElementById('searchInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.playerSection = document.getElementById('playerSection');
        this.videoPlayer = document.getElementById('videoPlayer');
        this.currentVideoInfo = document.getElementById('currentVideoInfo');
        this.loadingIndicator = document.getElementById('loadingIndicator');
        this.errorMessage = document.getElementById('errorMessage');
        this.resultsGrid = document.getElementById('resultsGrid');
        this.loadMoreIndicator = document.getElementById('loadMoreIndicator');
    }
    
    bindEventListeners() {
        // Search functionality
        this.searchBtn.addEventListener('click', () => this.handleSearch());
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });
        
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