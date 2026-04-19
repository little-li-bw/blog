package com.bowen.blog.post.service;

import com.bowen.blog.category.entity.Category;
import com.bowen.blog.category.mapper.CategoryMapper;
import com.bowen.blog.post.dto.AdminPostSaveRequest;
import com.bowen.blog.post.entity.Post;
import com.bowen.blog.post.mapper.PostMapper;
import com.bowen.blog.post.mapper.PostTagMapper;
import com.bowen.blog.post.vo.PostDetailVO;
import com.bowen.blog.post.vo.PostListItemVO;
import com.bowen.blog.post.vo.PostPrevNextVO;
import com.bowen.blog.tag.entity.Tag;
import com.bowen.blog.tag.mapper.TagMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class PostService {

    private final PostMapper postMapper;
    private final PostTagMapper postTagMapper;
    private final CategoryMapper categoryMapper;
    private final TagMapper tagMapper;
    private final PostRenderService postRenderService;

    public PostService(PostMapper postMapper,
                       PostTagMapper postTagMapper,
                       CategoryMapper categoryMapper,
                       TagMapper tagMapper,
                       PostRenderService postRenderService) {
        this.postMapper = postMapper;
        this.postTagMapper = postTagMapper;
        this.categoryMapper = categoryMapper;
        this.tagMapper = tagMapper;
        this.postRenderService = postRenderService;
    }

    public PostDetailVO createPost(AdminPostSaveRequest request) {
        validateSaveRequest(request);
        ensureCategoryExists(request.getCategoryId());
        validateTags(request.getTagIds());

        Post post = new Post();
        post.setTitle(request.getTitle().trim());
        post.setSummary(request.getSummary().trim());
        post.setContentMd(request.getContentMd().trim());
        post.setContentHtml(postRenderService.render(request.getContentMd()));
        post.setCategoryId(request.getCategoryId());
        post.setStatus("DRAFT");
        post.setViewCount(0L);
        postMapper.insert(post);
        postTagMapper.replacePostTags(post.getId(), normalizeTagIds(request.getTagIds()));
        return toDetailVO(post);
    }

    public List<PostListItemVO> listAdminPosts() {
        return postMapper.findAllForAdmin().stream()
                .map(this::toListItemVO)
                .toList();
    }

    public PostDetailVO updateStatus(Long id, String status) {
        Post post = postMapper.findById(id);
        if (post == null) {
            throw new NoSuchElementException("Post not found");
        }

        String normalizedStatus = normalizeStatus(status);
        post.setStatus(normalizedStatus);
        if ("PUBLISHED".equals(normalizedStatus) && post.getPublishTime() == null) {
            post.setPublishTime(LocalDateTime.now());
        }
        postMapper.updateById(post);
        return toDetailVO(post);
    }

    public List<PostListItemVO> listPublishedPosts(String keyword, Long categoryId, Integer pageNum, Integer pageSize) {
        int normalizedPageNum = pageNum == null || pageNum < 1 ? 1 : pageNum;
        int normalizedPageSize = pageSize == null || pageSize < 1 ? 10 : pageSize;
        int offset = (normalizedPageNum - 1) * normalizedPageSize;

        return postMapper.findPublished(keyword, categoryId, normalizedPageSize, offset).stream()
                .map(this::toListItemVO)
                .toList();
    }

    public PostDetailVO getPublishedPostDetail(Long id) {
        Post post = postMapper.findPublishedById(id);
        if (post == null) {
            throw new NoSuchElementException("Post not found");
        }

        PostDetailVO detail = toDetailVO(post);
        detail.setPreviousPost(toPrevNextVO(postMapper.findPreviousPublished(post.getPublishTime(), id)));
        detail.setNextPost(toPrevNextVO(postMapper.findNextPublished(post.getPublishTime(), id)));
        return detail;
    }

    private void validateSaveRequest(AdminPostSaveRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Post request must not be null");
        }
        if (isBlank(request.getTitle())) {
            throw new IllegalArgumentException("Post title must not be blank");
        }
        if (isBlank(request.getSummary())) {
            throw new IllegalArgumentException("Post summary must not be blank");
        }
        if (isBlank(request.getContentMd())) {
            throw new IllegalArgumentException("Post content must not be blank");
        }
        if (request.getCategoryId() == null) {
            throw new IllegalArgumentException("Post category must not be null");
        }
    }

    private void ensureCategoryExists(Long categoryId) {
        if (categoryMapper.findById(categoryId) == null) {
            throw new IllegalArgumentException("Category not found");
        }
    }

    private void validateTags(List<Long> tagIds) {
        List<Long> normalizedTagIds = normalizeTagIds(tagIds);
        if (normalizedTagIds.isEmpty()) {
            return;
        }

        List<Tag> tags = tagMapper.findByIds(normalizedTagIds);
        if (tags.size() != normalizedTagIds.size()) {
            throw new IllegalArgumentException("Tag not found");
        }
    }

    private List<Long> normalizeTagIds(List<Long> tagIds) {
        return tagIds == null ? Collections.emptyList() : tagIds;
    }

    private String normalizeStatus(String status) {
        if (isBlank(status)) {
            throw new IllegalArgumentException("Post status must not be blank");
        }
        String normalizedStatus = status.trim().toUpperCase();
        if (!List.of("DRAFT", "PUBLISHED", "OFFLINE").contains(normalizedStatus)) {
            throw new IllegalArgumentException("Unsupported post status");
        }
        return normalizedStatus;
    }

    private PostListItemVO toListItemVO(Post post) {
        PostListItemVO item = new PostListItemVO();
        item.setId(post.getId());
        item.setTitle(post.getTitle());
        item.setSummary(post.getSummary());
        item.setStatus(post.getStatus());
        item.setCategoryId(post.getCategoryId());
        item.setCategoryName(resolveCategoryName(post.getCategoryId()));
        item.setTags(resolveTagNames(post.getId()));
        item.setViewCount(post.getViewCount());
        item.setPublishTime(post.getPublishTime());
        return item;
    }

    private PostDetailVO toDetailVO(Post post) {
        PostDetailVO detail = new PostDetailVO();
        detail.setId(post.getId());
        detail.setTitle(post.getTitle());
        detail.setSummary(post.getSummary());
        detail.setContentHtml(post.getContentHtml());
        detail.setStatus(post.getStatus());
        detail.setCategoryId(post.getCategoryId());
        detail.setCategoryName(resolveCategoryName(post.getCategoryId()));
        detail.setTags(resolveTagNames(post.getId()));
        detail.setViewCount(post.getViewCount());
        detail.setPublishTime(post.getPublishTime());
        return detail;
    }

    private String resolveCategoryName(Long categoryId) {
        Category category = categoryMapper.findById(categoryId);
        return category == null ? "" : category.getName();
    }

    private List<String> resolveTagNames(Long postId) {
        return tagMapper.findByPostId(postId).stream()
                .map(Tag::getName)
                .toList();
    }

    private PostPrevNextVO toPrevNextVO(Post post) {
        if (post == null) {
            return null;
        }
        PostPrevNextVO vo = new PostPrevNextVO();
        vo.setId(post.getId());
        vo.setTitle(post.getTitle());
        return vo;
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
