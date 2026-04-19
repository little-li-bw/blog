package com.bowen.blog.post.mapper;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("文章标签映射器默认方法测试")
class PostTagMapperTest {

    @Test
    @DisplayName("替换文章标签 - 有标签时先删后插")
    void testReplacePostTags_WithTags_DeletesThenInserts() {
        FakePostTagMapper mapper = new FakePostTagMapper();

        mapper.replacePostTags(1L, List.of(1L, 2L));

        assertThat(mapper.deletedPostIds).containsExactly(1L);
        assertThat(mapper.insertedPostIds).containsExactly(1L);
        assertThat(mapper.insertedTagGroups).containsExactly(List.of(1L, 2L));
    }

    @Test
    @DisplayName("替换文章标签 - 无标签时只删除不插入")
    void testReplacePostTags_WithoutTags_OnlyDeletes() {
        FakePostTagMapper mapper = new FakePostTagMapper();

        mapper.replacePostTags(1L, List.of());

        assertThat(mapper.deletedPostIds).containsExactly(1L);
        assertThat(mapper.insertedPostIds).isEmpty();
        assertThat(mapper.insertedTagGroups).isEmpty();
    }

    private static class FakePostTagMapper implements PostTagMapper {
        private final List<Long> deletedPostIds = new ArrayList<>();
        private final List<Long> insertedPostIds = new ArrayList<>();
        private final List<List<Long>> insertedTagGroups = new ArrayList<>();

        @Override
        public int deleteByPostId(Long postId) {
            deletedPostIds.add(postId);
            return 1;
        }

        @Override
        public int insertBatch(Long postId, List<Long> tagIds) {
            insertedPostIds.add(postId);
            insertedTagGroups.add(tagIds);
            return tagIds.size();
        }
    }
}
