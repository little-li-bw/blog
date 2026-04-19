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
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("文章服务单元测试")
class PostServiceTest {

    @Mock
    private PostMapper postMapper;

    @Mock
    private PostTagMapper postTagMapper;

    @Mock
    private CategoryMapper categoryMapper;

    @Mock
    private TagMapper tagMapper;

    @Mock
    private PostRenderService postRenderService;

    @InjectMocks
    private PostService postService;

    @Test
    @DisplayName("创建文章 - 成功")
    void testCreatePost_Success() {
        AdminPostSaveRequest request = buildSaveRequest();
        when(categoryMapper.findById(1L)).thenReturn(buildCategory());
        when(tagMapper.findByIds(List.of(1L, 2L))).thenReturn(List.of(buildTag(1L, "Java"), buildTag(2L, "Spring")));
        when(tagMapper.findByPostId(1L)).thenReturn(List.of(buildTag(1L, "Java"), buildTag(2L, "Spring")));
        when(postRenderService.render(request.getContentMd())).thenReturn("<h1>Title</h1>");
        doAnswer(invocation -> {
            Post post = invocation.getArgument(0);
            post.setId(1L);
            return 1;
        }).when(postMapper).insert(any(Post.class));

        PostDetailVO result = postService.createPost(request);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getTitle()).isEqualTo("My First Post");
        assertThat(result.getContentHtml()).isEqualTo("<h1>Title</h1>");
        assertThat(result.getTags()).containsExactly("Java", "Spring");
        verify(postTagMapper).replacePostTags(1L, List.of(1L, 2L));
    }

    @Test
    @DisplayName("创建文章 - 无标签时成功")
    void testCreatePost_WithoutTags_Success() {
        AdminPostSaveRequest request = buildSaveRequest();
        request.setTagIds(null);

        when(categoryMapper.findById(1L)).thenReturn(buildCategory());
        when(tagMapper.findByPostId(1L)).thenReturn(List.of());
        when(postRenderService.render(request.getContentMd())).thenReturn("<h1>Title</h1>");
        doAnswer(invocation -> {
            Post post = invocation.getArgument(0);
            post.setId(1L);
            return 1;
        }).when(postMapper).insert(any(Post.class));

        PostDetailVO result = postService.createPost(request);

        assertThat(result.getTags()).isEmpty();
        verify(postTagMapper).replacePostTags(1L, List.of());
        verify(tagMapper, never()).findByIds(any());
    }

    @Test
    @DisplayName("更新文章状态 - 发布成功")
    void testUpdateStatus_PublishSuccess() {
        Post post = buildPost();
        post.setStatus("DRAFT");
        post.setPublishTime(null);
        when(postMapper.findById(1L)).thenReturn(post);

        postService.updateStatus(1L, "PUBLISHED");

        assertThat(post.getStatus()).isEqualTo("PUBLISHED");
        assertThat(post.getPublishTime()).isNotNull();
        verify(postMapper).updateById(post);
    }

    @Test
    @DisplayName("更新文章状态 - 文章不存在时抛出异常")
    void testUpdateStatus_NotFound_ThrowsException() {
        when(postMapper.findById(99L)).thenReturn(null);

        assertThatThrownBy(() -> postService.updateStatus(99L, "PUBLISHED"))
                .isInstanceOf(NoSuchElementException.class)
                .hasMessage("Post not found");
    }

    @Test
    @DisplayName("后台文章列表 - 返回文章数据")
    void testListAdminPosts_ReturnsPosts() {
        Post post = buildPost();
        when(postMapper.findAllForAdmin()).thenReturn(List.of(post));
        when(categoryMapper.findById(1L)).thenReturn(buildCategory());
        when(tagMapper.findByPostId(1L)).thenReturn(List.of(buildTag(1L, "Java"), buildTag(2L, "Spring")));

        List<PostListItemVO> result = postService.listAdminPosts();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("My First Post");
        assertThat(result.get(0).getCategoryName()).isEqualTo("Java");
        assertThat(result.get(0).getTags()).containsExactly("Java", "Spring");
    }

    @Test
    @DisplayName("公网文章列表 - 返回已发布文章")
    void testListPublishedPosts_ReturnsPublishedPosts() {
        Post post = buildPost();
        when(postMapper.findPublished(null, null, 10, 0)).thenReturn(List.of(post));
        when(categoryMapper.findById(1L)).thenReturn(buildCategory());
        when(tagMapper.findByPostId(1L)).thenReturn(List.of(buildTag(1L, "Java"), buildTag(2L, "Spring")));

        List<PostListItemVO> result = postService.listPublishedPosts(null, null, 1, 10);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("My First Post");
        assertThat(result.get(0).getTags()).containsExactly("Java", "Spring");
    }

    @Test
    @DisplayName("公网文章列表 - 非法分页参数时使用默认值")
    void testListPublishedPosts_InvalidPageParams_UsesDefaults() {
        when(postMapper.findPublished(isNull(), isNull(), eq(10), eq(0))).thenReturn(List.of(buildPost()));
        when(categoryMapper.findById(1L)).thenReturn(buildCategory());
        when(tagMapper.findByPostId(1L)).thenReturn(List.of());

        List<PostListItemVO> result = postService.listPublishedPosts(null, null, 0, 0);

        assertThat(result).hasSize(1);
        verify(postMapper).findPublished(null, null, 10, 0);
    }

    @Test
    @DisplayName("公网文章详情 - 返回详情和上一篇下一篇")
    void testGetPublishedPostDetail_ReturnsDetail() {
        Post post = buildPost();
        when(postMapper.findPublishedById(1L)).thenReturn(post);
        when(categoryMapper.findById(1L)).thenReturn(buildCategory());
        when(tagMapper.findByPostId(1L)).thenReturn(List.of(buildTag(1L, "Java"), buildTag(2L, "Spring")));
        when(postMapper.findPreviousPublished(eq(post.getPublishTime()), eq(1L))).thenReturn(buildNeighbor(2L, "Prev Post"));
        when(postMapper.findNextPublished(eq(post.getPublishTime()), eq(1L))).thenReturn(buildNeighbor(3L, "Next Post"));

        PostDetailVO result = postService.getPublishedPostDetail(1L);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getCategoryName()).isEqualTo("Java");
        assertThat(result.getPreviousPost()).extracting(PostPrevNextVO::getTitle).isEqualTo("Prev Post");
        assertThat(result.getNextPost()).extracting(PostPrevNextVO::getTitle).isEqualTo("Next Post");
    }

    @Test
    @DisplayName("公网文章详情 - 无上一篇下一篇时返回空导航")
    void testGetPublishedPostDetail_WithoutNeighbors_ReturnsNullNavigation() {
        Post post = buildPost();
        when(postMapper.findPublishedById(1L)).thenReturn(post);
        when(categoryMapper.findById(1L)).thenReturn(buildCategory());
        when(tagMapper.findByPostId(1L)).thenReturn(List.of());
        when(postMapper.findPreviousPublished(eq(post.getPublishTime()), eq(1L))).thenReturn(null);
        when(postMapper.findNextPublished(eq(post.getPublishTime()), eq(1L))).thenReturn(null);

        PostDetailVO result = postService.getPublishedPostDetail(1L);

        assertThat(result.getPreviousPost()).isNull();
        assertThat(result.getNextPost()).isNull();
    }

    @Test
    @DisplayName("公网文章详情 - 不存在时抛出异常")
    void testGetPublishedPostDetail_WhenMissing_ThrowsException() {
        when(postMapper.findPublishedById(99L)).thenReturn(null);

        assertThatThrownBy(() -> postService.getPublishedPostDetail(99L))
                .isInstanceOf(NoSuchElementException.class)
                .hasMessage("Post not found");

        verify(tagMapper, never()).findByPostId(any());
    }

    @Test
    @DisplayName("后台文章详情 - 返回可编辑内容")
    void testGetAdminPostDetail_ReturnsEditableDetail() {
        Post post = buildPost();
        when(postMapper.findById(1L)).thenReturn(post);
        when(categoryMapper.findById(1L)).thenReturn(buildCategory());
        when(tagMapper.findByPostId(1L)).thenReturn(List.of(buildTag(1L, "Java"), buildTag(2L, "Spring")));

        PostDetailVO result = postService.getAdminPostDetail(1L);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getContentMd()).isEqualTo("# Title");
        assertThat(result.getTagIds()).containsExactly(1L, 2L);
        assertThat(result.getTags()).containsExactly("Java", "Spring");
    }

    @Test
    @DisplayName("更新文章 - 成功")
    void testUpdatePost_Success() {
        AdminPostSaveRequest request = buildSaveRequest();
        when(postMapper.findById(1L)).thenReturn(buildPost());
        when(categoryMapper.findById(1L)).thenReturn(buildCategory());
        when(tagMapper.findByIds(List.of(1L, 2L))).thenReturn(List.of(buildTag(1L, "Java"), buildTag(2L, "Spring")));
        when(tagMapper.findByPostId(1L)).thenReturn(List.of(buildTag(1L, "Java"), buildTag(2L, "Spring")));
        when(postRenderService.render(request.getContentMd())).thenReturn("<h1>Updated</h1>");

        PostDetailVO result = postService.updatePost(1L, request);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getTitle()).isEqualTo("My First Post");
        assertThat(result.getContentMd()).isEqualTo("# Title");
        assertThat(result.getTags()).containsExactly("Java", "Spring");
        verify(postMapper).updateById(any(Post.class));
        verify(postTagMapper).replacePostTags(1L, List.of(1L, 2L));
    }

    private AdminPostSaveRequest buildSaveRequest() {
        AdminPostSaveRequest request = new AdminPostSaveRequest();
        request.setTitle("My First Post");
        request.setSummary("Intro summary");
        request.setContentMd("# Title");
        request.setCategoryId(1L);
        request.setTagIds(List.of(1L, 2L));
        return request;
    }

    private Post buildPost() {
        Post post = new Post();
        post.setId(1L);
        post.setTitle("My First Post");
        post.setSummary("Intro summary");
        post.setContentMd("# Title");
        post.setContentHtml("<h1>Title</h1>");
        post.setCategoryId(1L);
        post.setStatus("PUBLISHED");
        post.setViewCount(12L);
        post.setPublishTime(LocalDateTime.of(2026, 4, 19, 12, 0));
        return post;
    }

    private Category buildCategory() {
        Category category = new Category();
        category.setId(1L);
        category.setName("Java");
        category.setSort(1);
        return category;
    }

    private Tag buildTag(Long id, String name) {
        Tag tag = new Tag();
        tag.setId(id);
        tag.setName(name);
        return tag;
    }

    private Post buildNeighbor(Long id, String title) {
        Post post = new Post();
        post.setId(id);
        post.setTitle(title);
        return post;
    }
}
