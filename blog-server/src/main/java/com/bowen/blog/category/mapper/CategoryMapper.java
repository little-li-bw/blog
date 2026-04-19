package com.bowen.blog.category.mapper;

import com.bowen.blog.category.entity.Category;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface CategoryMapper {

    @Select("""
            SELECT id, name, sort, create_time, update_time
            FROM category
            ORDER BY sort ASC, id ASC
            """)
    List<Category> findAllOrderBySortAscIdAsc();

    @Select("""
            SELECT id, name, sort, create_time, update_time
            FROM category
            WHERE id = #{id}
            LIMIT 1
            """)
    Category findById(Long id);

    @Select("""
            SELECT id, name, sort, create_time, update_time
            FROM category
            WHERE name = #{name}
            LIMIT 1
            """)
    Category findByName(String name);

    @Insert("""
            INSERT INTO category (name, sort)
            VALUES (#{name}, #{sort})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Category category);

    @Update("""
            UPDATE category
            SET name = #{name},
                sort = #{sort}
            WHERE id = #{id}
            """)
    int updateById(Category category);

    @Delete("""
            DELETE FROM category
            WHERE id = #{id}
            """)
    int deleteById(Long id);
}
