package com.bowen.blog.post.vo;

import java.time.LocalDateTime;
import java.util.List;

public class PostDetailVO {

    private Long id;
    private String title;
    private String summary;
    private String contentHtml;
    private String status;
    private Long categoryId;
    private String categoryName;
    private List<String> tags;
    private Long viewCount;
    private LocalDateTime publishTime;
    private PostPrevNextVO previousPost;
    private PostPrevNextVO nextPost;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getContentHtml() {
        return contentHtml;
    }

    public void setContentHtml(String contentHtml) {
        this.contentHtml = contentHtml;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public Long getViewCount() {
        return viewCount;
    }

    public void setViewCount(Long viewCount) {
        this.viewCount = viewCount;
    }

    public LocalDateTime getPublishTime() {
        return publishTime;
    }

    public void setPublishTime(LocalDateTime publishTime) {
        this.publishTime = publishTime;
    }

    public PostPrevNextVO getPreviousPost() {
        return previousPost;
    }

    public void setPreviousPost(PostPrevNextVO previousPost) {
        this.previousPost = previousPost;
    }

    public PostPrevNextVO getNextPost() {
        return nextPost;
    }

    public void setNextPost(PostPrevNextVO nextPost) {
        this.nextPost = nextPost;
    }
}
