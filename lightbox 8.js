// vCROCS Blog - Lightbox Image Gallery
// Enables full-screen image viewing with navigation

class Lightbox {
    constructor() {
        this.images = [];
        this.currentIndex = 0;
        this.overlay = null;
        this.initialize();
    }
    
    initialize() {
        // Find all images in article content
        const contentImages = document.querySelectorAll('article .content img');
        
        if (contentImages.length === 0) return;
        
        // Store image data
        contentImages.forEach((img, index) => {
            this.images.push({
                src: img.src,
                alt: img.alt || 'Image ' + (index + 1)
            });
            
            // Make image clickable
            img.addEventListener('click', (e) => {
                e.preventDefault();
                this.open(index);
            });
            
            // Add cursor pointer style
            img.style.cursor = 'zoom-in';
        });
        
        // Create lightbox overlay
        this.createOverlay();
        
        // Add keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }
    
    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'lightbox-overlay';
        this.overlay.innerHTML = `
            <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
            <button class="lightbox-nav lightbox-prev" aria-label="Previous image">&#8249;</button>
            <button class="lightbox-nav lightbox-next" aria-label="Next image">&#8250;</button>
            <div class="lightbox-content">
                <img class="lightbox-image" src="" alt="">
            </div>
            <div class="lightbox-caption"></div>
            <div class="lightbox-counter"></div>
        `;
        
        document.body.appendChild(this.overlay);
        
        // Event listeners
        this.overlay.querySelector('.lightbox-close').addEventListener('click', () => this.close());
        this.overlay.querySelector('.lightbox-prev').addEventListener('click', (e) => {
            e.stopPropagation();
            this.prev();
        });
        this.overlay.querySelector('.lightbox-next').addEventListener('click', (e) => {
            e.stopPropagation();
            this.next();
        });
        
        // Click overlay background to close
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.close();
            }
        });
        
        // Prevent closing when clicking on image
        this.overlay.querySelector('.lightbox-image').addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    open(index) {
        this.currentIndex = index;
        this.updateImage();
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.updateNavButtons();
    }
    
    close() {
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    next() {
        if (this.currentIndex < this.images.length - 1) {
            this.currentIndex++;
            this.updateImage();
            this.updateNavButtons();
        }
    }
    
    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateImage();
            this.updateNavButtons();
        }
    }
    
    updateImage() {
        const image = this.images[this.currentIndex];
        const imgElement = this.overlay.querySelector('.lightbox-image');
        const caption = this.overlay.querySelector('.lightbox-caption');
        const counter = this.overlay.querySelector('.lightbox-counter');
        
        imgElement.src = image.src;
        imgElement.alt = image.alt;
        caption.textContent = image.alt;
        counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
    }
    
    updateNavButtons() {
        const prevBtn = this.overlay.querySelector('.lightbox-prev');
        const nextBtn = this.overlay.querySelector('.lightbox-next');
        
        // Hide/show navigation buttons based on position
        prevBtn.style.display = this.currentIndex === 0 ? 'none' : 'flex';
        nextBtn.style.display = this.currentIndex === this.images.length - 1 ? 'none' : 'flex';
    }
    
    handleKeyboard(e) {
        if (!this.overlay.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                this.close();
                break;
            case 'ArrowLeft':
                this.prev();
                break;
            case 'ArrowRight':
                this.next();
                break;
        }
    }
}

// Initialize lightbox when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new Lightbox());
} else {
    new Lightbox();
}

// Blog Search Functionality
window.vcrocsSearchUtils = {
    searchIndexPromise: null,

    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    },

    normalizeText(text) {
        return (text || '')
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    },

    tokenize(text) {
        const normalized = this.normalizeText(text);
        return normalized ? normalized.split(' ').filter(Boolean) : [];
    },

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    sitePath(relativePath) {
        const searchInput = document.getElementById('searchInput');
        const rootPath = searchInput ? (searchInput.dataset.siteRoot || '') : '';
        return rootPath + relativePath.replace(/^\//, '');
    },

    highlightMatch(text, query) {
        if (!text) return '';

        const terms = Array.from(new Set(this.tokenize(query))).sort((a, b) => b.length - a.length);
        if (terms.length === 0) {
            return text;
        }

        const pattern = terms.map(term => this.escapeRegex(term)).join('|');
        const regex = new RegExp('(' + pattern + ')', 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    },

    extractContextSnippet(text, query, contextLength = 120) {
        if (!text) return '';

        const terms = this.tokenize(query);
        const lowerText = text.toLowerCase();
        let bestIndex = -1;
        let bestTermLength = 0;

        for (const term of terms) {
            const index = lowerText.indexOf(term.toLowerCase());
            if (index !== -1 && (bestIndex === -1 || index < bestIndex)) {
                bestIndex = index;
                bestTermLength = term.length;
            }
        }

        if (bestIndex === -1) {
            return text.length > contextLength ? text.substring(0, contextLength) + '...' : text;
        }

        const start = Math.max(0, bestIndex - Math.floor(contextLength / 2));
        const end = Math.min(text.length, bestIndex + bestTermLength + Math.floor(contextLength / 2));
        let snippet = text.substring(start, end).trim();

        if (start > 0) snippet = '...' + snippet;
        if (end < text.length) snippet += '...';
        return snippet;
    },

    levenshteinDistance(a, b, maxDistance = 2) {
        if (a === b) return 0;
        if (Math.abs(a.length - b.length) > maxDistance) return maxDistance + 1;

        const previous = new Array(b.length + 1);
        const current = new Array(b.length + 1);

        for (let j = 0; j <= b.length; j++) {
            previous[j] = j;
        }

        for (let i = 1; i <= a.length; i++) {
            current[0] = i;
            let rowMin = current[0];

            for (let j = 1; j <= b.length; j++) {
                const cost = a[i - 1] === b[j - 1] ? 0 : 1;
                current[j] = Math.min(
                    previous[j] + 1,
                    current[j - 1] + 1,
                    previous[j - 1] + cost
                );
                rowMin = Math.min(rowMin, current[j]);
            }

            if (rowMin > maxDistance) {
                return maxDistance + 1;
            }

            for (let j = 0; j <= b.length; j++) {
                previous[j] = current[j];
            }
        }

        return previous[b.length];
    },

    tokenMatchScore(tokens, term, exactScore, prefixScore, fuzzyScore) {
        if (!tokens || tokens.length === 0 || !term) {
            return 0;
        }

        if (tokens.includes(term)) {
            return exactScore;
        }

        if (tokens.some(token => token.startsWith(term) || term.startsWith(token))) {
            return prefixScore;
        }

        if (term.length >= 4) {
            const fuzzyMatch = tokens.some(token => {
                const maxDistance = term.length >= 7 ? 2 : 1;
                return this.levenshteinDistance(token, term, maxDistance) <= maxDistance;
            });
            if (fuzzyMatch) {
                return fuzzyScore;
            }
        }

        return 0;
    },

    scorePost(post, rawQuery) {
        const normalizedQuery = this.normalizeText(rawQuery);
        const queryTerms = Array.from(new Set(this.tokenize(rawQuery)));
        if (!normalizedQuery || queryTerms.length === 0) {
            return null;
        }

        const title = post.title || '';
        const excerpt = post.excerpt || '';
        const content = post.content || '';
        const tags = Array.isArray(post.tags) ? post.tags : [];
        const categories = Array.isArray(post.categories) ? post.categories : [];

        const normalizedTitle = this.normalizeText(title);
        const normalizedExcerpt = this.normalizeText(excerpt);
        const normalizedContent = this.normalizeText(content);
        const normalizedTags = tags.map(tag => this.normalizeText(tag));
        const normalizedCategories = categories.map(category => this.normalizeText(category));

        const titleTokens = this.tokenize(title);
        const excerptTokens = this.tokenize(excerpt);
        const contentTokens = this.tokenize(content);
        const tagTokens = normalizedTags.flatMap(tag => tag.split(' ').filter(Boolean));
        const categoryTokens = normalizedCategories.flatMap(category => category.split(' ').filter(Boolean));

        let score = 0;
        let matchedTerms = 0;
        let hasPhraseMatch = false;

        if (normalizedTitle === normalizedQuery) {
            score += 220;
            hasPhraseMatch = true;
        } else if (normalizedTitle.startsWith(normalizedQuery)) {
            score += 160;
            hasPhraseMatch = true;
        } else if (normalizedTitle.includes(normalizedQuery)) {
            score += 120;
            hasPhraseMatch = true;
        }

        if (normalizedTags.some(tag => tag === normalizedQuery)) {
            score += 140;
            hasPhraseMatch = true;
        } else if (normalizedTags.some(tag => tag.includes(normalizedQuery))) {
            score += 100;
            hasPhraseMatch = true;
        }

        if (normalizedCategories.some(category => category === normalizedQuery)) {
            score += 120;
            hasPhraseMatch = true;
        } else if (normalizedCategories.some(category => category.includes(normalizedQuery))) {
            score += 90;
            hasPhraseMatch = true;
        }

        if (normalizedExcerpt.includes(normalizedQuery)) {
            score += 55;
            hasPhraseMatch = true;
        }

        if (normalizedContent.includes(normalizedQuery)) {
            score += 35;
            hasPhraseMatch = true;
        }

        for (const term of queryTerms) {
            let termScore = 0;

            termScore = Math.max(termScore, this.tokenMatchScore(titleTokens, term, 42, 30, 18));
            termScore = Math.max(termScore, this.tokenMatchScore(tagTokens, term, 34, 24, 14));
            termScore = Math.max(termScore, this.tokenMatchScore(categoryTokens, term, 30, 22, 12));
            termScore = Math.max(termScore, this.tokenMatchScore(excerptTokens, term, 18, 12, 8));
            termScore = Math.max(termScore, this.tokenMatchScore(contentTokens, term, 12, 8, 5));

            if (termScore > 0) {
                matchedTerms += 1;
                score += termScore;
            }
        }

        if (!hasPhraseMatch && matchedTerms === 0) {
            return null;
        }

        const coverage = matchedTerms / queryTerms.length;
        if (queryTerms.length > 1) {
            score *= 0.45 + (coverage * 0.75);
            if (coverage === 1) {
                score += 24;
            }
        }

        if (normalizedTitle.includes(normalizedQuery) && coverage > 0.5) {
            score += 20;
        }

        return {
            ...post,
            score: score,
            coverage: coverage
        };
    },

    searchPosts(posts, query, limit = 50) {
        return (posts || [])
            .map(post => this.scorePost(post, query))
            .filter(Boolean)
            .sort((a, b) => {
                if (b.score !== a.score) {
                    return b.score - a.score;
                }

                const dateA = Date.parse(a.date || '') || 0;
                const dateB = Date.parse(b.date || '') || 0;
                return dateB - dateA;
            })
            .slice(0, limit);
    },

    async loadSearchIndex(url = 'search-index.json') {
        if (window.vcrocsSearchIndex && Array.isArray(window.vcrocsSearchIndex.posts)) {
            this.searchIndexPromise = Promise.resolve(window.vcrocsSearchIndex.posts);
            return this.searchIndexPromise;
        }

        if (!this.searchIndexPromise) {
            const candidates = Array.from(new Set([url, this.sitePath(url)]));
            this.searchIndexPromise = (async () => {
                for (const candidate of candidates) {
                    try {
                        const response = await fetch(candidate);
                        if (response.ok) {
                            const data = await response.json();
                            return data.posts || [];
                        }
                    } catch (error) {
                        console.warn('Search index load attempt failed for', candidate, error);
                    }
                }

                throw new Error('Unable to load search index');
            })();
        }

        return this.searchIndexPromise;
    }
};

class BlogSearch {
    constructor() {
        this.searchInput = document.getElementById('searchInput');
        this.posts = [];
        this.initialize();
    }

    initialize() {
        if (!this.searchInput) return;

        this.loadSearchIndex();

        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.performSearch();
            }
        });

        let debounceTimer;
        this.searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                if (this.searchInput.value.trim().length >= 2) {
                    this.showSuggestions();
                } else {
                    this.removeSuggestions();
                }
            }, 250);
        });
    }

    async loadSearchIndex() {
        try {
            this.posts = await window.vcrocsSearchUtils.loadSearchIndex('search-index.json');
        } catch (error) {
            console.error('Failed to load search index:', error);
            this.extractFromPage();
        }
    }

    extractFromPage() {
        const postItems = document.querySelectorAll('.post-item');
        this.posts = Array.from(postItems).map(item => {
            const titleEl = item.querySelector('h2 a') || item.querySelector('h3 a');
            const title = titleEl ? titleEl.textContent : '';
            const url = titleEl ? titleEl.getAttribute('href') : '';
            const metaEl = item.querySelector('.post-meta time');
            const date = metaEl ? metaEl.getAttribute('datetime') : '';
            const excerptEl = item.querySelector('.post-excerpt');
            const excerpt = excerptEl ? excerptEl.textContent : '';

            return { title: title, url: url, date: date, excerpt: excerpt, content: excerpt, tags: [], categories: [] };
        });
    }

    performSearch() {
        const query = this.searchInput.value.trim();
        if (!query) return;

        this.removeSuggestions();
        window.location.href = window.vcrocsSearchUtils.sitePath('search-results.html') + '?q=' + encodeURIComponent(query);
    }

    removeSuggestions() {
        const existingSuggestions = document.querySelector('.search-suggestions');
        if (existingSuggestions) {
            existingSuggestions.remove();
        }
    }

    showSuggestions() {
        const query = this.searchInput.value.trim();
        if (!query) return;

        const results = window.vcrocsSearchUtils.searchPosts(this.posts, query, 5);
        this.removeSuggestions();

        if (results.length === 0) return;

        const suggestions = document.createElement('div');
        suggestions.className = 'search-suggestions';
        suggestions.innerHTML = results.map(post => {
            const titleHTML = window.vcrocsSearchUtils.highlightMatch(post.title, query);
            const snippetSource = post.content || post.excerpt || '';
            const snippet = window.vcrocsSearchUtils.extractContextSnippet(snippetSource, query, 90);
            const snippetHTML = snippet
                ? '<span class="excerpt">' + window.vcrocsSearchUtils.highlightMatch(snippet, query) + '</span>'
                : '';

            return '<a href="' + window.vcrocsSearchUtils.sitePath(post.url) + '" class="search-suggestion-item">' +
                   '<strong>' + titleHTML + '</strong>' +
                   snippetHTML +
                   '</a>';
        }).join('');

        this.searchInput.parentElement.appendChild(suggestions);

        const closeSuggestions = (e) => {
            if (!suggestions.contains(e.target) && e.target !== this.searchInput) {
                suggestions.remove();
                document.removeEventListener('click', closeSuggestions);
            }
        };
        document.addEventListener('click', closeSuggestions);
    }
}

// Initialize search when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    new BlogSearch();
});