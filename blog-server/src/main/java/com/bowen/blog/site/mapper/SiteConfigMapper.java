package com.bowen.blog.site.mapper;

import com.bowen.blog.site.entity.SiteConfig;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface SiteConfigMapper {

    @Select("""
            SELECT id, site_name, hero_title, hero_subtitle, about_me, skills_backend,
                   skills_frontend, skills_database, skills_tools, email, github_url,
                   resume_url, create_time, update_time
            FROM site_config
            ORDER BY id ASC
            LIMIT 1
            """)
    SiteConfig findFirst();

    @Insert("""
            INSERT INTO site_config (
                site_name, hero_title, hero_subtitle, about_me, skills_backend,
                skills_frontend, skills_database, skills_tools, email, github_url, resume_url
            )
            VALUES (
                #{siteName}, #{heroTitle}, #{heroSubtitle}, #{aboutMe}, #{skillsBackend},
                #{skillsFrontend}, #{skillsDatabase}, #{skillsTools}, #{email}, #{githubUrl}, #{resumeUrl}
            )
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(SiteConfig siteConfig);

    @Update("""
            UPDATE site_config
            SET site_name = #{siteName},
                hero_title = #{heroTitle},
                hero_subtitle = #{heroSubtitle},
                about_me = #{aboutMe},
                skills_backend = #{skillsBackend},
                skills_frontend = #{skillsFrontend},
                skills_database = #{skillsDatabase},
                skills_tools = #{skillsTools},
                email = #{email},
                github_url = #{githubUrl},
                resume_url = #{resumeUrl}
            WHERE id = #{id}
            """)
    int updateById(SiteConfig siteConfig);
}
