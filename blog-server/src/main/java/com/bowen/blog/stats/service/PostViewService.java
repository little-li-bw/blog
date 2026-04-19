package com.bowen.blog.stats.service;

import com.bowen.blog.post.entity.Post;
import com.bowen.blog.post.mapper.PostMapper;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class PostViewService {

    private final PostMapper postMapper;

    public PostViewService(PostMapper postMapper) {
        this.postMapper = postMapper;
    }

    public long incrementViewCount(Long postId) {
        Post post = postMapper.findPublishedById(postId);
        if (post == null) {
            throw new NoSuchElementException("Post not found");
        }

        long current = post.getViewCount() == null ? 0L : post.getViewCount();
        post.setViewCount(current + 1);
        postMapper.updateById(post);
        return post.getViewCount();
    }
}
