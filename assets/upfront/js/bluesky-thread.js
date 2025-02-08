const styles = `
  :host {
    display: block;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .thread-container {
    margin: 0 auto;
    padding: 1rem;
  }

  .post {
  }

  .post-link {
    display: block;
    text-decoration: none;
    color: inherit;
    padding: 0.5rem 0;
  }

  .post-link:hover {
  }

  .reply {
    margin: .5rem 0;
    border-left: 2px solid #ccc;
    padding-left: .5rem;
  }

  .author {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .author-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: inherit;
  }

  .author-link:hover {
    text-decoration: underline;
  }

  .author-info {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .handle {
    color: #666;
  }

  .avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .loading {
    text-align: center;
    padding: 1rem;
  }

  .error {
    color: red;
    padding: 1rem;
    text-align: center;
  }

  .metadata {
    display: flex;
    gap: 1rem;
    color: #666;
    font-size: 0.875rem;
    margin-top: 0.5rem;
  }

  .content {
  }

  .load-more {
    display: block;
    width: 100%;
    padding: 8px;
    margin: 8px 0;
    background: none;
    border: none;
    color: #666;
    font-size: 0.875rem;
    cursor: pointer;
    text-align: left;
  }

  .load-more:hover {
    color: #000;
  }


  /* Theme: Light */
  :host(.theme-light) {
    background: #ffffff;
    color: #000000;
  }

  /* Theme: Dark */
  :host(.theme-dark) {
    background: #1a1a1a;
    color: #ffffff;
  }

  :host(.theme-dark) .post-link:hover {
    background: rgba(255, 255, 255, 0.02);
  }

  :host(.theme-dark) .load-more {
    color: #999;
  }

  :host(.theme-dark) .load-more:hover {
    color: #fff;
  }
`;

class BlueSkyFeed extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.thread = null;
    this.loading = false;
    this.error = null;
    this.expandedReplies = new Set();
  }

  static get observedAttributes() {
    return ['post-url', 'theme', 'max-posts'];
  }

  parseBlueskyUrl(url) {
    try {
      const regex = /https:\/\/bsky\.app\/profile\/([^/]+)\/post\/([^/]+)/;
      const match = url.match(regex);
      if (!match) throw new Error('Invalid Bluesky URL format');

      const [_, handle, postId] = match;
      return { handle, postId };
    } catch (err) {
      throw new Error('Failed to parse Bluesky URL');
    }
  }

  async getAtUri(handle, postId) {
    try {
      const resolveResponse = await fetch(
        `https://public.api.bsky.app/xrpc/com.atproto.identity.resolveHandle?handle=${encodeURIComponent(handle)}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (!resolveResponse.ok) {
        throw new Error('Failed to resolve handle');
      }

      const { did } = await resolveResponse.json();
      return `at://${did}/app.bsky.feed.post/${postId}`;
    } catch (err) {
      console.error('Error getting AT URI:', err);
      throw new Error('Failed to get AT URI');
    }
  }

  async connectedCallback() {
    this.render();
    await this.fetchThread();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.handleAttributeChange(name, newValue);
    }
  }

  async handleAttributeChange(name, value) {
    switch (name) {
      case 'post-url':
        await this.fetchThread();
        break;
      case 'theme':
        this.updateTheme(value);
        break;
      case 'max-posts':
        this.render();
        break;
    }
  }

  async fetchThread() {
    try {
      this.loading = true;
      this.render();

      const url = this.getAttribute('post-url');
      if (!url) {
        throw new Error('No post URL provided');
      }

      const { handle, postId } = this.parseBlueskyUrl(url);
      const uri = await this.getAtUri(handle, postId);

      const response = await fetch(
        `https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?uri=${encodeURIComponent(uri)}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch thread');
      }

      const data = await response.json();
      this.thread = data.thread;
      this.loading = false;
      this.error = null;
    } catch (err) {
      this.error = err.message;
      this.loading = false;
    } finally {
      this.render();
    }
  }

  updateTheme(theme) {
    this.shadowRoot.host.className = `theme-${theme}`;
  }

  formatDate(timestamp) {
    return new Date(timestamp).toLocaleString();
  }

  toggleReplies(postId) {
    if (this.expandedReplies.has(postId)) {
      this.expandedReplies.delete(postId);
    } else {
      this.expandedReplies.add(postId);
    }
    this.render();
  }

  render() {
    const maxPosts = parseInt(this.getAttribute('max-posts')) || 5;

    const renderPost = (post, depth = 0) => {
      if (!post || !post.post) return '';

      const { author, record, indexedAt } = post.post;
      const profileUrl = `https://bsky.app/profile/${author.handle}`;
      const postUrl = `${profileUrl}/post/${post.post.uri.split('/').pop()}`;
      const postId = post.post.uri;
      const hasReplies = post.replies && post.replies.length > 0;
      const isExpanded = this.expandedReplies.has(postId);
      const visibleReplies = isExpanded ? post.replies : post.replies?.slice(0, maxPosts);

      return `
        <div class="post">
          <h2>Comments</h2>
          <p><a href="${profileUrl}">Reply on Bluesky</a> to join the conversation.</p>
          <!-- <div class="author">
            <a href="${profileUrl}" target="_blank" class="author-link">
              ${author.avatar ? `<img src="${author.avatar}" alt="" class="avatar">` : ''}
              <div class="author-info">
                <strong>${author.displayName || author.handle}</strong>
                <span class="handle">@${author.handle}</span>
              </div>
            </a>
          </div>
          <a href="${postUrl}" target="_blank" class="post-link">
            <div class="content">${record.text}</div>
            <div class="metadata">
              <span>${this.formatDate(indexedAt)}</span>
              <span>❤️ ${post.post.likeCount || 0}</span>
              <span>🔄 ${post.post.repostCount || 0}</span>
            </div>
          </a> -->
          ${hasReplies ? `
            <div class="replies">
              ${visibleReplies.map(reply => `
                <div class="reply">
                  ${renderPost(reply, depth + 1)}
                </div>
              `).join('')}
              ${!isExpanded && post.replies.length > maxPosts ? `
                <button class="load-more" onclick="this.getRootNode().host.toggleReplies('${postId}')">
                  Show ${post.replies.length - maxPosts} more replies...
                </button>
              ` : ''}
              ${isExpanded ? `
                <button class="load-more" onclick="this.getRootNode().host.toggleReplies('${postId}')">
                  Show less
                </button>
              ` : ''}
            </div>
          ` : ''}
        </div>
      `;
    };

    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <div class="thread-container">
        ${this.loading ? '<div class="loading">Loading...</div>' : ''}
        ${this.error ? `<div class="error">${this.error}</div>` : ''}
        ${this.thread ? renderPost(this.thread) : ''}
      </div>
    `;
  }
}

customElements.define('bluesky-feed', BlueSkyFeed);

export { BlueSkyFeed as default };