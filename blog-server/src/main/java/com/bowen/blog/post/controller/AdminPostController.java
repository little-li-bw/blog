package com.bowen.blog.post.controller;

import com.bowen.blog.common.ApiResponse;
import com.bowen.blog.post.dto.AdminPostSaveRequest;
import com.bowen.blog.post.dto.PostStatusUpdateRequest;
import com.bowen.blog.post.service.PostService;
import com.bowen.blog.post.vo.PostDetailVO;
import com.bowen.blog.post.vo.PostListItemVO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;

import java.util.List;

@RestController
@RequestMapping("/api/admin/posts")
public class AdminPostController {

    private final PostService postService;

    public AdminPostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    public ApiResponse<List<PostListItemVO>> list() {
        return ApiResponse.success(postService.listAdminPosts());
    }

    @GetMapping("/{id}")
    public ApiResponse<PostDetailVO> detail(@PathVariable Long id) {
        return ApiResponse.success(postService.getAdminPostDetail(id));
    }

    @PostMapping
    public ApiResponse<PostDetailVO> create(@RequestBody AdminPostSaveRequest request) {
        return ApiResponse.success(postService.createPost(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<PostDetailVO> update(@PathVariable Long id, @RequestBody AdminPostSaveRequest request) {
        return ApiResponse.success(postService.updatePost(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        postService.deletePost(id);
        return ApiResponse.success("Deleted successfully", null);
    }

    @PutMapping("/{id}/status")
    public ApiResponse<PostDetailVO> updateStatus(@PathVariable Long id, @RequestBody PostStatusUpdateRequest request) {
        return ApiResponse.success(postService.updateStatus(id, request.getStatus()));
    }
}
