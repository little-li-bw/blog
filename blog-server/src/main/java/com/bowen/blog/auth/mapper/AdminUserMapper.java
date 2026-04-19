package com.bowen.blog.auth.mapper;

import com.bowen.blog.auth.entity.AdminUser;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface AdminUserMapper {

    @Select("""
            SELECT id, username, password, nickname, create_time, update_time
            FROM admin_user
            WHERE username = #{username}
            LIMIT 1
            """)
    AdminUser findByUsername(String username);
}
