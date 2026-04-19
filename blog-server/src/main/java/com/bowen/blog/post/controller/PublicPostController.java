package com.bowen.blog.post.controller;

import com.bowen.blog.common.ApiResponse;
import com.bowen.blog.post.service.PostService;
import com.bowen.blog.post.vo.PostDetailVO;
import com.bowen.blog.post.vo.PostListItemVO;
import com.bowen.blog.stats.service.PostViewService;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PublicPostController {

    private final PostService postService;
    private final PostViewService postViewService;

    public PublicPostController(PostService postService, PostViewService postViewService) {
        this.postService = postService;
        this.postViewService = postViewService;
    }

    @GetMapping
    public ApiResponse<List<PostListItemVO>> list(@RequestParam(required = false) String keyword,
                                                  @RequestParam(required = false) Long categoryId,
                                                  @RequestParam(defaultValue = "1") Integer pageNum,
                                                  @RequestParam(defaultValue = "10") Integer pageSize) {
        return ApiResponse.success(postService.listPublishedPosts(keyword, categoryId, pageNum, pageSize));
    }

    @GetMapping("/{id}")
    public ApiResponse<PostDetailVO> detail(@PathVariable Long id) {
        return ApiResponse.success(postService.getPublishedPostDetail(id));
    }

    @PostMapping("/{id}/views")
    public ApiResponse<Long> incrementViews(@PathVariable Long id) {
        return ApiResponse.success(postViewService.incrementViewCount(id));
    }
}
