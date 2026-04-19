package com.bowen.blog.post.mapper;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PostTagMapper {

    @Delete("""
            DELETE FROM post_tag
            WHERE post_id = #{postId}
            """)
    int deleteByPostId(Long postId);

    @Insert("""
            <script>
            INSERT INTO post_tag (post_id, tag_id)
            VALUES
            <foreach collection="tagIds" item="tagId" separator=",">
                (#{postId}, #{tagId})
            </foreach>
            </script>
            """)
    int insertBatch(@Param("postId") Long postId, @Param("tagIds") List<Long> tagIds);

    default void replacePostTags(Long postId, List<Long> tagIds) {
        deleteByPostId(postId);
        if (tagIds != null && !tagIds.isEmpty()) {
            insertBatch(postId, tagIds);
        }
    }
}
