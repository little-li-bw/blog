package com.bowen.blog.post.mapper;

import com.bowen.blog.post.entity.Post;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import org.apache.ibatis.annotations.Delete;

import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface PostMapper {

    @Insert("""
            INSERT INTO post (title, summary, content_md, content_html, category_id, status, view_count, publish_time)
            VALUES (#{title}, #{summary}, #{contentMd}, #{contentHtml}, #{categoryId}, #{status}, #{viewCount}, #{publishTime})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Post post);

    @Update("""
            UPDATE post
            SET title = #{title},
                summary = #{summary},
                content_md = #{contentMd},
                content_html = #{contentHtml},
                category_id = #{categoryId},
                status = #{status},
                view_count = #{viewCount},
                publish_time = #{publishTime}
            WHERE id = #{id}
            """)
    int updateById(Post post);

    @Delete("""
            DELETE FROM post
            WHERE id = #{id}
            """)
    int deleteById(Long id);

    @Select("""
            SELECT id, title, summary, content_md, content_html, category_id, status, view_count, publish_time, create_time, update_time
            FROM post
            WHERE id = #{id}
            LIMIT 1
            """)
    Post findById(Long id);

    @Select("""
            SELECT id, title, summary, content_md, content_html, category_id, status, view_count, publish_time, create_time, update_time
            FROM post
            ORDER BY update_time DESC, id DESC
            """)
    List<Post> findAllForAdmin();

    @Select("""
            <script>
            SELECT id, title, summary, content_md, content_html, category_id, status, view_count, publish_time, create_time, update_time
            FROM post
            WHERE status = 'PUBLISHED'
            <if test="keyword != null and keyword != ''">
              AND title LIKE CONCAT('%', #{keyword}, '%')
            </if>
            <if test="categoryId != null">
              AND category_id = #{categoryId}
            </if>
            ORDER BY publish_time DESC, id DESC
            LIMIT #{limit} OFFSET #{offset}
            </script>
            """)
    List<Post> findPublished(@Param("keyword") String keyword,
                             @Param("categoryId") Long categoryId,
                             @Param("limit") int limit,
                             @Param("offset") int offset);

    @Select("""
            SELECT id, title, summary, content_md, content_html, category_id, status, view_count, publish_time, create_time, update_time
            FROM post
            WHERE id = #{id} AND status = 'PUBLISHED'
            LIMIT 1
            """)
    Post findPublishedById(Long id);

    @Select("""
            SELECT id, title, summary, content_md, content_html, category_id, status, view_count, publish_time, create_time, update_time
            FROM post
            WHERE status = 'PUBLISHED'
              AND publish_time &lt; #{publishTime}
            ORDER BY publish_time DESC, id DESC
            LIMIT 1
            """)
    Post findPreviousPublished(@Param("publishTime") LocalDateTime publishTime, @Param("currentId") Long currentId);

    @Select("""
            SELECT id, title, summary, content_md, content_html, category_id, status, view_count, publish_time, create_time, update_time
            FROM post
            WHERE status = 'PUBLISHED'
              AND publish_time &gt; #{publishTime}
            ORDER BY publish_time ASC, id ASC
            LIMIT 1
            """)
    Post findNextPublished(@Param("publishTime") LocalDateTime publishTime, @Param("currentId") Long currentId);
}
