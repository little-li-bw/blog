package com.bowen.blog.tag.mapper;

import com.bowen.blog.tag.entity.Tag;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface TagMapper {

    @Select("""
            SELECT id, name, create_time, update_time
            FROM tag
            ORDER BY name ASC, id ASC
            """)
    List<Tag> findAllOrderByNameAscIdAsc();

    @Select("""
            SELECT id, name, create_time, update_time
            FROM tag
            WHERE id = #{id}
            LIMIT 1
            """)
    Tag findById(Long id);

    @Select("""
            SELECT id, name, create_time, update_time
            FROM tag
            WHERE name = #{name}
            LIMIT 1
            """)
    Tag findByName(String name);

    @Insert("""
            INSERT INTO tag (name)
            VALUES (#{name})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Tag tag);

    @Update("""
            UPDATE tag
            SET name = #{name}
            WHERE id = #{id}
            """)
    int updateById(Tag tag);

    @Delete("""
            DELETE FROM tag
            WHERE id = #{id}
            """)
    int deleteById(Long id);

    @Select("""
            <script>
            SELECT id, name, create_time, update_time
            FROM tag
            WHERE id IN
            <foreach collection="ids" item="id" open="(" separator="," close=")">
                #{id}
            </foreach>
            ORDER BY id ASC
            </script>
            """)
    List<Tag> findByIds(@Param("ids") List<Long> ids);

    @Select("""
            SELECT t.id, t.name, t.create_time, t.update_time
            FROM tag t
            INNER JOIN post_tag pt ON pt.tag_id = t.id
            WHERE pt.post_id = #{postId}
            ORDER BY t.id ASC
            """)
    List<Tag> findByPostId(@Param("postId") Long postId);
}
